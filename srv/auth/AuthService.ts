import cds from '@sap/cds';
import { PasswordHasher } from './PasswordHasher';
import { TokenService } from './TokenService';
import { UserRepository, type UserRecord } from './UserRepository';
import { APP_ROLE, AUTH_LIMITS, USER_ROLES, USER_STATUSES } from '../constants/auth-limits';

export type AuthErrorCode =
    | 'invalid_credentials'
    | 'account_pending'
    | 'account_disabled'
    | 'invalid_token'
    | 'weak_password';

export class AuthError extends Error {

    constructor(public readonly code: AuthErrorCode, public readonly status: number) {

        super(code);

    }

}

export interface TokenResponse {
    access_token: string;
    refresh_token: string;
    token_type: 'Bearer';
    expires_in: number;
    user_name: string;
    name: string;
    role: string;
    must_change_password: boolean;
}

export interface UserProfile {
    email: string;
    name: string;
    role: string;
    mustChangePassword: boolean;
}

const userCache = new Map<string, { user: UserRecord | null; expires: number }>();

/**
 * Sign-in, token refresh and password change against the app's own Users
 * table. Passwords are only compared through their hashes and never logged.
 */
export class AuthService {

    public static async login(email: string, password: string): Promise<TokenResponse> {

        const user = await UserRepository.findByEmail(email);

        if (!user || !(await PasswordHasher.verify(password, user.PasswordHash))) {
            throw new AuthError('invalid_credentials', 401);
        }

        this.assertActive(user);

        await UserRepository.update(user.ID, { LastLoginAt: new Date().toISOString() });

        return this.issue(user);

    }


    public static async refresh(refreshToken: string): Promise<TokenResponse> {

        const claims = TokenService.verify(refreshToken, 'refresh');
        const user = claims ? await UserRepository.findByEmail(claims.sub) : null;

        if (!claims || !user || user.TokenVersion !== claims.ver) {
            throw new AuthError('invalid_token', 401);
        }

        this.assertActive(user);

        return this.issue(user);

    }


    /**
     * Replaces the password (also the first one, when an admin asked for a
     * change) and invalidates every token issued before.
     */
    public static async changePassword(user: UserRecord, currentPassword: string, newPassword: string): Promise<TokenResponse> {

        if (!(await PasswordHasher.verify(currentPassword, user.PasswordHash))) {
            throw new AuthError('invalid_credentials', 401);
        }

        this.assertStrong(newPassword);

        const changes = {
            PasswordHash: await PasswordHasher.hash(newPassword),
            MustChangePassword: false,
            TokenVersion: (user.TokenVersion || 0) + 1
        };

        await UserRepository.update(user.ID, changes);
        this.forget(user.Email);

        return this.issue({ ...user, ...changes });

    }


    /**
     * Resolves the user of an access token, still active and with the token
     * version unchanged; results are cached for a few seconds per e-mail.
     */
    public static async userFromToken(accessToken: string): Promise<UserRecord | null> {

        const claims = TokenService.verify(accessToken, 'access');

        if (!claims) {
            return null;
        }

        const user = await this.cachedUser(claims.sub);

        return user && user.Status === USER_STATUSES.active && user.TokenVersion === claims.ver ? user : null;

    }


    /**
     * Only for local development: lets scripts and tests call the services
     * with Basic credentials of a Users row.
     */
    public static async userFromPassword(email: string, password: string): Promise<UserRecord | null> {

        const user = await UserRepository.findByEmail(email);
        const valid = !!user && user.Status === USER_STATUSES.active && await PasswordHasher.verify(password, user.PasswordHash);

        return valid ? user : null;

    }


    /**
     * The CAP user of a Users row. A user who still has to change the
     * password gets no role, so only the /auth routes accept them.
     */
    public static toCdsUser(user: UserRecord): cds.User {

        const roles = user.MustChangePassword
            ? []
            : [APP_ROLE, ...(user.Role === USER_ROLES.admin ? [USER_ROLES.admin] : [])];

        return new cds.User({ id: user.Email, roles, attr: { name: user.Name || '' } });

    }


    public static profile(user: UserRecord): UserProfile {

        return {
            email: user.Email,
            name: user.Name || '',
            role: user.Role,
            mustChangePassword: !!user.MustChangePassword
        };

    }


    public static assertStrong(password: string): void {

        if (typeof password !== 'string' || password.length < AUTH_LIMITS.minPasswordLength || password.length > AUTH_LIMITS.maxCredentialLength) {
            throw new AuthError('weak_password', 400);
        }

    }


    /** Drops the cached user, so status or role changes apply right away. */
    public static forget(email: string): void {

        userCache.delete(email.trim().toLowerCase());

    }


    private static issue(user: UserRecord): TokenResponse {

        const version = user.TokenVersion || 0;

        return {
            access_token: TokenService.sign(user.Email, 'access', version, AUTH_LIMITS.accessTokenSeconds),
            refresh_token: TokenService.sign(user.Email, 'refresh', version, AUTH_LIMITS.refreshTokenSeconds),
            token_type: 'Bearer',
            expires_in: AUTH_LIMITS.accessTokenSeconds,
            user_name: user.Email,
            name: user.Name || '',
            role: user.Role,
            must_change_password: !!user.MustChangePassword
        };

    }


    private static assertActive(user: UserRecord): void {

        if (user.Status === USER_STATUSES.pending) {
            throw new AuthError('account_pending', 403);
        }

        if (user.Status !== USER_STATUSES.active) {
            throw new AuthError('account_disabled', 403);
        }

    }


    private static async cachedUser(email: string): Promise<UserRecord | null> {

        const key = email.trim().toLowerCase();
        const cached = userCache.get(key);

        if (cached && cached.expires > Date.now()) {
            return cached.user;
        }

        const user = await UserRepository.findByEmail(email);
        userCache.set(key, { user, expires: Date.now() + AUTH_LIMITS.userCacheSeconds * 1000 });

        return user;

    }

}
