import cds from '@sap/cds';

export interface XsuaaCredentials {
    url: string;
    clientid: string;
    clientsecret: string;
}

export class XsuaaTokenExchangeError extends Error {

    public constructor(message: string) {
        super(message);
        this.name = 'XsuaaTokenExchangeError';
    }

}

function tryParseVcap(): XsuaaCredentials | null {
    try {
        const vcap = JSON.parse(process.env.VCAP_SERVICES || '{}');
        const xsuaa = (vcap.xsuaa || [])[0];

        if (
            xsuaa &&
            xsuaa.credentials &&
            xsuaa.credentials.url &&
            xsuaa.credentials.clientid &&
            xsuaa.credentials.clientsecret
        ) {
            return xsuaa.credentials;
        }
    } catch (error) {
        /* ignore */
    }

    return null;
}

function getXsuaaCredentials(): XsuaaCredentials {
    const fromVcap = tryParseVcap();

    if (fromVcap) {
        return fromVcap;
    }

    const credentials = cds.env.requires?.auth?.credentials as
        Partial<XsuaaCredentials> | undefined;

    if (credentials?.url && credentials.clientid && credentials.clientsecret) {
        return credentials as XsuaaCredentials;
    }

    throw new XsuaaTokenExchangeError('XSUAA credentials are not available');
}

async function callXsuaaTokenEndpoint(
    payload: Record<string, string>
): Promise<Record<string, unknown>> {
    const { url, clientid, clientsecret } = getXsuaaCredentials();
    const params = new URLSearchParams({
        ...payload,
        client_id: clientid,
        client_secret: clientsecret
    });

    const response = await fetch(`${url}/oauth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
        signal: AbortSignal.timeout(15000)
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`XSUAA token endpoint returned ${response.status}: ${text}`);
    }

    return response.json() as Promise<Record<string, unknown>>;
}

export async function exchangeAuthorizationCode(
    code: string,
    redirectUri: string
): Promise<Record<string, unknown>> {
    if (!code) {
        throw new XsuaaTokenExchangeError('missing_code');
    }

    return callXsuaaTokenEndpoint({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri
    });
}

export async function refreshAccessToken(
    refreshToken: string
): Promise<Record<string, unknown>> {
    if (!refreshToken) {
        throw new XsuaaTokenExchangeError('missing_refresh_token');
    }

    return callXsuaaTokenEndpoint({
        grant_type: 'refresh_token',
        refresh_token: refreshToken
    });
}