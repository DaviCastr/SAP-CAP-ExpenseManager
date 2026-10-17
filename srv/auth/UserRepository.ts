import cds from '@sap/cds';

const ENTITIES_NAMESPACE = 'apps.dflc.expensemanager.entities';

export interface UserRecord {
    ID: string;
    Email: string;
    Name?: string | null;
    PasswordHash?: string | null;
    Role: string;
    Status: string;
    MustChangePassword: boolean;
    TokenVersion: number;
    LastLoginAt?: string | null;
}

/**
 * Data access of the Users table. The e-mail is matched case-insensitively,
 * but kept as stored because it is the user id found in createdBy and
 * Shares.User.
 */
export class UserRepository {

    public static async findByEmail(email: string): Promise<UserRecord | null> {

        const user = await SELECT.one.from(this.entity()).where('tolower(Email) =', email.trim().toLowerCase());

        return (user as UserRecord | undefined) ?? null;

    }


    public static async findAll(): Promise<UserRecord[]> {

        return await SELECT.from(this.entity()).orderBy('Email') as UserRecord[];

    }


    public static async create(user: Partial<UserRecord> & { Email: string }): Promise<void> {

        await INSERT.into(this.entity()).entries({ ...user, Email: user.Email.trim() });

    }


    public static async update(id: string, changes: Partial<UserRecord>): Promise<void> {

        await UPDATE(this.entity()).set(changes).where({ ID: id });

    }


    private static entity() {

        return cds.entities(ENTITIES_NAMESPACE).Users;

    }

}
