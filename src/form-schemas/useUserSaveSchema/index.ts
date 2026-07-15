import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { USER_ROLES, USER_STATUSES } from '@/constants/enums';
import type { UserSaveFormData } from '@/interfaces/UserSaveFormData';
import type { UserRole } from '@/interfaces/UserRole';
import type { UserStatus } from '@/interfaces/UserStatus';

export const useUserSaveSchema = (): yup.ObjectSchema<UserSaveFormData> => {
  const { t } = useTranslation();

  return useMemo(
    () =>
      yup.object({
        name: yup.string().trim().required(t('validation.required')),
        email: yup.string().trim().required(t('validation.required')).email(t('validation.email')),
        roleId: yup.mixed<UserRole>().oneOf(USER_ROLES).required(t('validation.required')),
        status: yup.mixed<UserStatus>().oneOf(USER_STATUSES).required(t('validation.required')),
        password: yup.string().default(''),
        requirePasswordChange: yup.boolean().default(false),
      }),
    [t]
  );
};
