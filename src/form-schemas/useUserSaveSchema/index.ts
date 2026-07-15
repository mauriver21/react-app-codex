import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

export const useUserSaveSchema = () => {
  const { t } = useTranslation();

  return useMemo(
    () =>
      z.object({
        name: z.string().trim().min(1, t('validation.required')),
        email: z.string().trim().min(1, t('validation.required')).email(t('validation.email')),
        roleId: z.enum(['admin', 'editor', 'viewer']),
        status: z.enum(['active', 'inactive']),
      }),
    [t],
  );
};

export type UserSaveFormValues = z.infer<ReturnType<typeof useUserSaveSchema>>;
