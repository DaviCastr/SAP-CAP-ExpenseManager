import cds from '@sap/cds';
import type { NextFunction, Request, Response } from 'express';
import { AuthService } from './AuthService';

function isDevelopment(): boolean {

    return (cds.env as any).profiles?.includes('development') && !process.env.VCAP_APPLICATION;

}

async function basicUser(credentials: string): Promise<cds.User | null> {

    const decoded = Buffer.from(credentials, 'base64').toString('utf8');
    const separator = decoded.indexOf(':');
    const user = separator > 0 ? await AuthService.userFromPassword(decoded.slice(0, separator), decoded.slice(separator + 1)) : null;

    return user ? AuthService.toCdsUser(user) : null;

}

/**
 * CAP custom authentication (cds.requires.auth.impl): turns the Bearer token
 * issued by /auth into the request user. Requests without credentials go on
 * as anonymous, so the services' @requires answer them with 401.
 */
async function appAuth(req: Request, res: Response, next: NextFunction): Promise<void> {

    try {

        const [scheme, credentials] = (req.headers.authorization || '').split(' ');

        if (/^bearer$/i.test(scheme) && credentials) {

            const user = await AuthService.userFromToken(credentials);

            if (!user) {
                res.status(401).json({ error: 'invalid_token', error_description: 'The session expired, sign in again' });
                return;
            }

            (req as any).user = AuthService.toCdsUser(user);

            return next();

        }

        if (/^basic$/i.test(scheme) && credentials && isDevelopment()) {

            const user = await basicUser(credentials);

            if (!user) {
                res.set('WWW-Authenticate', 'Basic realm="Users"').status(401).end();
                return;
            }

            (req as any).user = user;

            return next();

        }

        (req as any).user = cds.User.anonymous;

        next();

    } catch (error) {

        next(error);

    }

}

export = appAuth;
