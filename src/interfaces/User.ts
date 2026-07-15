export const USER_STATUSES = ['active', 'inactive'] as const;
export const USER_ROLES = ['admin', 'editor', 'viewer'] as const;

export type UserStatus = (typeof USER_STATUSES)[number];
export type UserRole = (typeof USER_ROLES)[number];

export interface User {
  id: string;
  name: string;
  email: string;
  roleId: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export type UserFormValues = Pick<User, 'name' | 'email' | 'roleId' | 'status'>;
