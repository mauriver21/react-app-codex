import type { UserRole } from '@/interfaces/UserRole';
import type { UserStatus } from '@/interfaces/UserStatus';

export interface UserSaveFormData {
  name: string;
  email: string;
  roleId: UserRole;
  status: UserStatus;
  password: string;
  requirePasswordChange: boolean;
}
