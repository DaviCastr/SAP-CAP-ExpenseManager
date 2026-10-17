import { Router, type Request, type Response } from 'express';
import express from 'express';
import cds from '@sap/cds';
import { AuthError, AuthService } from './AuthService';
import type { UserRecord } from './UserRepository';
import { RateLimiter } from '../infrastructure/RateLimiter';
import { AUTH_LIMITS } from '../constants/auth-limits';

const authRouter = Router();
const passwordLimiter = new RateLimiter(
    Number(process.env.AUTH_RATE_LIMIT) || AUTH_LIMITS.maxAttemptsPerWindow,
    AUTH_LIMITS.windowInMinutes
);

const ERROR_DESCRIPTIONS: Record<string, string> = {
    invalid_credentials: 'Invalid e-mail or password',
    account_pending: 'The account is waiting for confirmation',
    account_disabled: 'The account is disabled',
    invalid_token: 'The session expired, sign in again',
    weak_password: `The password must have at least ${AUTH_LIMITS.minPasswordLength} characters`
};

authRouter.use(express.json());

/**
 * Uses the last x-forwarded-for hop, which is the one appended by the Cloud Foundry router,
 * so a client cannot bypass the rate limit by sending its own header.
 */
function clientIp(req: Request): string {
    const forwardedFor = req.headers['x-forwarded-for'];
    const lastHop = (Array.isArray(forwardedFor) ? forwardedFor.join(',') : forwardedFor)?.split(',').pop()?.trim();

    return lastHop || req.ip || 'unknown';
}

function isValidCredential(value: unknown): value is string {
    return typeof value === 'string' && value.trim().length > 0 && value.length <= AUTH_LIMITS.maxCredentialLength;
}

function sendError(res: Response, error: unknown, context: string): void {
    if (error instanceof AuthError) {
        res.status(error.status).json({ error: error.code, error_description: ERROR_DESCRIPTIONS[error.code] });
        return;
    }

    cds.log('auth').error(context, error instanceof Error ? error.message : String(error));
    res.status(500).json({ error: 'auth_failed', error_description: 'Authentication is not available right now' });
}

function tooManyAttempts(req: Request, res: Response): boolean {
    if (passwordLimiter.tryConsume(clientIp(req))) {
        return false;
    }

    res.status(429).json({ error: 'too_many_attempts', error_description: 'Too many attempts, try again later' });
    return true;
}

async function bearerUser(req: Request): Promise<UserRecord | null> {
    const [scheme, token] = (req.headers.authorization || '').split(' ');

    return /^bearer$/i.test(scheme) && token ? AuthService.userFromToken(token) : null;
}

/**
 * Signs in with e-mail and password against the Users table.
 */
authRouter.post('/password', async (req, res) => {
    const { username, password } = (req.body || {}) as { username?: unknown; password?: unknown };

    if (!isValidCredential(username) || !isValidCredential(password)) {
        res.status(400).json({ error: 'missing_credentials', error_description: 'Parameters "username" and "password" are required' });
        return;
    }

    if (tooManyAttempts(req, res)) {
        return;
    }

    try {
        res.json(await AuthService.login(username.trim(), password));
    } catch (error) {
        if (error instanceof AuthError) {
            cds.log('auth').warn('Password login rejected for', username.trim(), error.code);
        }
        sendError(res, error, 'Password login failed');
    }
});

authRouter.post('/refresh', async (req, res) => {
    const { refresh_token } = (req.body || {}) as { refresh_token?: unknown };

    if (!isValidCredential(refresh_token)) {
        res.status(400).json({ error: 'missing_refresh_token', error_description: 'Parameter "refresh_token" is required' });
        return;
    }

    try {
        res.json(await AuthService.refresh(refresh_token));
    } catch (error) {
        sendError(res, error, 'Token refresh failed');
    }
});

/**
 * Changes the password of the signed-in user (also the mandatory first
 * change) and returns new tokens.
 */
authRouter.post('/change-password', async (req, res) => {
    const { current_password, new_password } = (req.body || {}) as { current_password?: unknown; new_password?: unknown };

    if (!isValidCredential(current_password) || !isValidCredential(new_password)) {
        res.status(400).json({ error: 'missing_credentials', error_description: 'Parameters "current_password" and "new_password" are required' });
        return;
    }

    if (tooManyAttempts(req, res)) {
        return;
    }

    try {
        const user = await bearerUser(req);

        if (!user) {
            throw new AuthError('invalid_token', 401);
        }

        res.json(await AuthService.changePassword(user, current_password, new_password));
    } catch (error) {
        sendError(res, error, 'Password change failed');
    }
});

authRouter.get('/me', async (req, res) => {
    try {
        const user = await bearerUser(req);

        if (!user) {
            throw new AuthError('invalid_token', 401);
        }

        res.json(AuthService.profile(user));
    } catch (error) {
        sendError(res, error, 'Profile lookup failed');
    }
});

export const oAuthRouter = authRouter;
