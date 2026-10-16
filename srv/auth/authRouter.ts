import { Router, type Request, type Response } from 'express';
import express from 'express';
import cds from '@sap/cds';
import {
    exchangeAuthorizationCode,
    loginWithPassword,
    refreshAccessToken,
    XsuaaTokenEndpointError
} from './xsuaa-token';
import { RateLimiter } from '../infrastructure/RateLimiter';
import { AUTH_LIMITS } from '../constants/auth-limits';

const authRouter = Router();
const passwordLimiter = new RateLimiter(AUTH_LIMITS.maxAttemptsPerWindow, AUTH_LIMITS.windowInMinutes);
const REJECTED_CREDENTIAL_STATUSES = [400, 401];

authRouter.use(express.json());

function sendTokenError(
    res: Response,
    error: unknown,
    fallbackError: string,
    fallbackDescription: string
): void {
    const detail =
        error instanceof Object && 'response' in error
            ? (error as { response?: { data?: unknown } }).response?.data
            : error instanceof Error
                ? error.message
                : String(error);

    cds.log('auth').error(fallbackError, detail);

    res.status(502).json({
        error: fallbackError,
        error_description: typeof detail === 'string' ? detail : JSON.stringify(detail)
    });
}

authRouter.post('/login', (req, res) => {
    const { code, redirect_uri } = (req.body || {}) as {
        code?: string;
        redirect_uri?: string;
    };

    if (!code) {
        return res.status(400).json({
            error: 'missing_code',
            error_description: 'Parameter "code" is required'
        });
    }

    return exchangeAuthorizationCode(code, redirect_uri || '')
        .then((data) => res.json(data))
        .catch((error) => sendTokenError(res, error, 'token_exchange_failed', 'XSUAA token exchange failed'));
});

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

/**
 * Signs in with e-mail and password (XSUAA password grant) for the app's own login page.
 * The password is only forwarded to XSUAA and is never logged.
 */
authRouter.post('/password', (req, res) => {
    const { username, password } = (req.body || {}) as { username?: unknown; password?: unknown };

    if (!isValidCredential(username) || !isValidCredential(password)) {
        return res.status(400).json({
            error: 'missing_credentials',
            error_description: 'Parameters "username" and "password" are required'
        });
    }

    if (!passwordLimiter.tryConsume(clientIp(req))) {
        return res.status(429).json({
            error: 'too_many_attempts',
            error_description: 'Too many login attempts, try again later'
        });
    }

    return loginWithPassword(username.trim(), password)
        .then((data) => res.json(data))
        .catch((error) => {
            if (error instanceof XsuaaTokenEndpointError && REJECTED_CREDENTIAL_STATUSES.includes(error.status)) {
                cds.log('auth').warn('Password login rejected for', username.trim());

                return res.status(401).json({
                    error: 'invalid_credentials',
                    error_description: 'Invalid username or password'
                });
            }

            cds.log('auth').error('Password login failed', error instanceof Error ? error.message : String(error));

            return res.status(502).json({
                error: 'login_failed',
                error_description: 'Login is not available right now'
            });
        });
});

authRouter.post('/refresh', (req, res) => {
    const { refresh_token } = (req.body || {}) as { refresh_token?: string };

    if (!refresh_token) {
        return res.status(400).json({
            error: 'missing_refresh_token',
            error_description: 'Parameter "refresh_token" is required'
        });
    }

    return refreshAccessToken(refresh_token)
        .then((data) => res.json(data))
        .catch((error) => sendTokenError(res, error, 'token_refresh_failed', 'XSUAA token refresh failed'));
});

export const oAuthRouter = authRouter;