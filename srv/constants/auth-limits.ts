export const AUTH_LIMITS = {
    maxAttemptsPerWindow: 10,
    windowInMinutes: 15,
    maxCredentialLength: 256,
    minPasswordLength: 8,
    accessTokenSeconds: 60 * 60,
    refreshTokenSeconds: 30 * 24 * 60 * 60,
    userCacheSeconds: 30
} as const;

export const USER_ROLES = {
    user: 'User',
    admin: 'Admin'
} as const;

export const USER_STATUSES = {
    pending: 'Pending',
    active: 'Active',
    disabled: 'Disabled'
} as const;

/** Role every signed-in user gets; the services require it. */
export const APP_ROLE = 'ExpenseManagerUser';
