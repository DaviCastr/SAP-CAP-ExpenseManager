import cds from '@sap/cds';
import { createHash } from 'crypto';

const LOCAL_SECRET = 'expense-manager-local-only';

/**
 * Server-side secret used to sign the app tokens (and, later, to encrypt
 * stored settings). Comes from SETTINGS_SECRET, falling back to the XSUAA
 * client secret; a fixed value is only accepted outside Cloud Foundry.
 */
export class AppSecret {

    public static isAvailable(): boolean {

        return !!this.secret();

    }


    /**
     * Derives a 32-byte key for one purpose, so the same secret never signs
     * and encrypts with the same key.
     *
     * @param purpose what the key is used for (e.g. "token")
     */
    public static key(purpose: string): Buffer {

        const secret = this.secret();

        if (!secret) {
            throw new Error('No application secret configured (SETTINGS_SECRET)');
        }

        return createHash('sha256').update(`expense-manager:${purpose}:${secret}`).digest();

    }


    private static secret(): string | undefined {

        return process.env.SETTINGS_SECRET
            || this.xsuaaClientSecret()
            || (process.env.VCAP_APPLICATION ? undefined : LOCAL_SECRET);

    }


    private static xsuaaClientSecret(): string | undefined {

        try {

            const services = JSON.parse(process.env.VCAP_SERVICES || '{}');
            const fromVcap = services?.xsuaa?.[0]?.credentials?.clientsecret;

            return fromVcap || (cds.env.requires as any)?.xsuaa?.credentials?.clientsecret;

        } catch {

            return undefined;

        }

    }

}
