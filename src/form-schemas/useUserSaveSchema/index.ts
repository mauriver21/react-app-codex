import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

export const useUserSaveSchema = () => {
  const { t } = useTranslation();

  return useMemo(
    () =>
      yup.object({
        name: yup.string().trim().required(t('validation.required')),
        email: yup.string().trim().required(t('validation.required')).email(t('validation.email')),
        roleId: yup
          .mixed<'admin' | 'editor' | 'viewer' | ''>()
          .oneOf(['admin', 'editor', 'viewer', ''])
          .required(t('validation.required')),
        status: yup
          .mixed<'active' | 'inactive' | ''>()
          .oneOf(['active', 'inactive', ''])
          .required(t('validation.required')),
        password: yup.string().default(''),
        requirePasswordChange: yup.boolean().default(false),
      }),
    [t]
  );
};

export type UserSaveFormValues = yup.InferType<ReturnType<typeof useUserSaveSchema>>;
