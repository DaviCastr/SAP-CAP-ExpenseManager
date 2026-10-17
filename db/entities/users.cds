namespace apps.dflc.expensemanager.entities;

using {
    cuid,
    managed,
} from '@sap/cds/common';

type UserRoles   : String(20) enum {
    User;
    Admin;
};

type UserStatuses : String(20) enum {
    Pending;
    Active;
    Disabled;
};

/**
 * Application users. Not exposed by any service: only the /auth routes and
 * the admin actions read or change it. The e-mail (lowercase) is the user id
 * used in createdBy and Shares.User.
 */
@assert.unique: {email: [Email]}
entity Users : cuid, managed {
    Email              : String(255) @mandatory;
    Name               : String(100);
    PasswordHash       : String(500);
    Role               : UserRoles default 'User';
    Status             : UserStatuses default 'Active';
    MustChangePassword : Boolean default false;
    TokenVersion       : Integer default 0;
    LastLoginAt        : Timestamp;
}
