import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { FORM_SHOWCASE_CONTACT_METHODS, FORM_SHOWCASE_ROLES } from '@/constants/formShowcase';
import type { FormShowcaseContactMethod } from '@/interfaces/FormShowcaseContactMethod';
import type { FormShowcaseData } from '@/interfaces/FormShowcaseData';
import type { FormShowcaseRole } from '@/interfaces/FormShowcaseRole';

export const useFormShowcaseSchema = (): yup.ObjectSchema<FormShowcaseData> => {
  const { t } = useTranslation();

  return useMemo(
    () =>
      yup.object({
        fullName: yup
          .string()
          .trim()
          .required(t('validation.required'))
          .min(2, t('validation.minCharacters', { count: 2 })),
        email: yup.string().trim().required(t('validation.required')).email(t('validation.email')),
        password: yup
          .string()
          .required(t('validation.required'))
          .min(8, t('validation.minCharacters', { count: 8 })),
        role: yup
          .mixed<FormShowcaseRole | ''>()
          .oneOf(FORM_SHOWCASE_ROLES, t('validation.required'))
          .required(t('validation.required')),
        preferredContact: yup
          .mixed<FormShowcaseContactMethod | ''>()
          .oneOf(FORM_SHOWCASE_CONTACT_METHODS, t('validation.required'))
          .required(t('validation.required')),
        acceptTerms: yup.boolean().oneOf([true], t('validation.acceptTerms')).required(t('validation.acceptTerms')),
      }),
    [t]
  );
};
