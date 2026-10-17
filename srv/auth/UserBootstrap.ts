import cds from '@sap/cds';
import { PasswordHasher } from './PasswordHasher';
import { UserRepository } from './UserRepository';
import { USER_ROLES, USER_STATUSES } from '../constants/auth-limits';

const ENTITIES_NAMESPACE = 'apps.dflc.expensemanager.entities';
const TECHNICAL_USERS = ['anonymous', 'privileged', 'system'];

/**
 * Runs on every start and only fills what is missing:
 * - the administrator from ADMIN_EMAIL / ADMIN_PASSWORD;
 * - a user for every owner (Persons.createdBy) and share recipient
 *   (Shares.User) of the existing data, without a password, so an admin
 *   can hand them one.
 */
export class UserBootstrap {

    public static async run(): Promise<void> {

        try {

            await this.ensureAdmin();
            await this.importExistingOwners();

        } catch (error) {

            cds.log('users').error('User bootstrap failed:', (error as Error).message);

        }

    }


    private static async ensureAdmin(): Promise<void> {

        const email = process.env.ADMIN_EMAIL?.trim();
        const password = process.env.ADMIN_PASSWORD;

        if (!email) {
            return;
        }

        const existing = await UserRepository.findByEmail(email);

        if (!existing) {

            await UserRepository.create({
                Email: email.toLowerCase(),
                Role: USER_ROLES.admin,
                Status: USER_STATUSES.active,
                PasswordHash: password ? await PasswordHasher.hash(password) : null,
                MustChangePassword: false
            });

            cds.log('users').info('Administrator created:', email);
            return;

        }

        const changes = {
            ...(existing.Role !== USER_ROLES.admin ? { Role: USER_ROLES.admin } : {}),
            ...(!existing.PasswordHash && password ? { PasswordHash: await PasswordHasher.hash(password) } : {})
        };

        if (Object.keys(changes).length) {
            await UserRepository.update(existing.ID, changes);
        }

    }


    private static async importExistingOwners(): Promise<void> {

        const { Persons, Shares } = cds.entities(ENTITIES_NAMESPACE);
        const owners = await SELECT.distinct.from(Persons).columns('createdBy as id') as { id?: string }[];
        const recipients = await SELECT.distinct.from(Shares).columns('User as id') as { id?: string }[];
        const known = new Set((await UserRepository.findAll()).map((user) => user.Email.toLowerCase()));

        const missing = [...new Set([...owners, ...recipients].map((row) => row.id?.trim() || ''))]
            .filter((id) => id && !TECHNICAL_USERS.includes(id) && !known.has(id.toLowerCase()));

        for (const id of missing) {
            await UserRepository.create({ Email: id, Role: USER_ROLES.user, Status: USER_STATUSES.active, MustChangePassword: true });
        }

        if (missing.length) {
            cds.log('users').info(`Created ${missing.length} user(s) for the owners of existing data`);
        }

    }

}
