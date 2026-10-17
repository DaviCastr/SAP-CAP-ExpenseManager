import { randomBytes, scrypt, timingSafeEqual, type ScryptOptions } from 'crypto';

const KEY_LENGTH = 64;
const SALT_BYTES = 16;
const OPTIONS = { N: 16384, r: 8, p: 1 };

function derive(password: string, salt: Buffer, options: ScryptOptions): Promise<Buffer> {

    return new Promise((resolve, reject) => {
        scrypt(password, salt, KEY_LENGTH, { ...options, maxmem: 64 * 1024 * 1024 }, (error, key) => error ? reject(error) : resolve(key));
    });

}

/**
 * scrypt password hashes stored as `scrypt$N$r$p$salt$hash` (base64), so the
 * cost can be raised later without breaking existing hashes.
 */
export class PasswordHasher {

    public static async hash(password: string): Promise<string> {

        const salt = randomBytes(SALT_BYTES);
        const key = await derive(password, salt, OPTIONS);

        return ['scrypt', OPTIONS.N, OPTIONS.r, OPTIONS.p, salt.toString('base64'), key.toString('base64')].join('$');

    }


    public static async verify(password: string, stored?: string | null): Promise<boolean> {

        const [scheme, N, r, p, salt, hash] = (stored || '').split('$');

        if (scheme !== 'scrypt' || !salt || !hash) {
            return false;
        }

        const expected = Buffer.from(hash, 'base64');
        const actual = await derive(password, Buffer.from(salt, 'base64'), { N: Number(N), r: Number(r), p: Number(p) });

        return actual.length === expected.length && timingSafeEqual(actual, expected);

    }

}
