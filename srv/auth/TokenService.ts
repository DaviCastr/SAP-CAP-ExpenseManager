import { createHmac, timingSafeEqual } from 'crypto';
import { AppSecret } from '../infrastructure/AppSecret';

const ISSUER = 'expense-manager';

export type TokenType = 'access' | 'refresh';

export interface TokenClaims {
    sub: string;
    typ: TokenType;
    ver: number;
    iat: number;
    exp: number;
    iss: string;
}

function base64Url(value: Buffer | string): string {

    return Buffer.from(value).toString('base64url');

}

function signature(content: string): string {

    return createHmac('sha256', AppSecret.key('token')).update(content).digest('base64url');

}

/**
 * HS256 JSON Web Tokens issued by the app itself. The token version (`ver`)
 * matches Users.TokenVersion, so a password change or a disabled account
 * invalidates every token already handed out.
 */
export class TokenService {

    public static sign(subject: string, type: TokenType, version: number, lifetimeSeconds: number): string {

        const now = Math.floor(Date.now() / 1000);
        const claims: TokenClaims = { sub: subject, typ: type, ver: version, iat: now, exp: now + lifetimeSeconds, iss: ISSUER };
        const content = `${base64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))}.${base64Url(JSON.stringify(claims))}`;

        return `${content}.${signature(content)}`;

    }


    /**
     * @returns the claims when the token is authentic, unexpired and of the
     * expected type; otherwise null
     */
    public static verify(token: string, type: TokenType): TokenClaims | null {

        const [header, payload, signed] = (token || '').split('.');

        if (!header || !payload || !signed) {
            return null;
        }

        const expected = Buffer.from(signature(`${header}.${payload}`));
        const actual = Buffer.from(signed);

        if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
            return null;
        }

        try {

            const claims = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as TokenClaims;
            const valid = claims.iss === ISSUER && claims.typ === type && claims.exp > Math.floor(Date.now() / 1000);

            return valid ? claims : null;

        } catch {

            return null;

        }

    }

}
