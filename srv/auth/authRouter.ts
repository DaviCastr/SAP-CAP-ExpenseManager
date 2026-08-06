import { Router, type Response } from 'express';
import express from 'express';
import cds from '@sap/cds';
import {
    exchangeAuthorizationCode,
    refreshAccessToken
} from './xsuaa-token';

const authRouter = Router();

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