import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Alert } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Body1 } from '@/components/Body1';
import { Body2 } from '@/components/Body2';
import { Box } from '@/components/Box';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Checkbox } from '@/components/Checkbox';
import { H1 } from '@/components/H1';
import { H2 } from '@/components/H2';
import { PasswordField } from '@/components/PasswordField';
import { RadioGroup } from '@/components/RadioGroup';
import { Select } from '@/components/Select';
import { Stack } from '@/components/Stack';
import { TextField } from '@/components/TextField';
import { FORM_SHOWCASE_CONTACT_METHODS, FORM_SHOWCASE_ROLES } from '@/constants/formShowcase';
import { useFormShowcaseSchema } from '@/form-schemas/useFormShowcaseSchema';
import type { FormShowcaseData } from '@/interfaces/FormShowcaseData';

const emptyValues: FormShowcaseData = {
  fullName: '',
  email: '',
  password: '',
  role: '',
  preferredContact: '',
  acceptTerms: false,
};

const filledValues: FormShowcaseData = {
  fullName: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  password: 'AccessibleDemo123',
  role: 'engineering',
  preferredContact: 'email',
  acceptTerms: true,
};

export const FormShowcasePage = () => {
  const { t } = useTranslation();
  const schema = useFormShowcaseSchema();
  const [feedback, setFeedback] = useState<string>();
  const [submittedValues, setSubmittedValues] = useState<FormShowcaseData>();
  const { control, handleSubmit, reset, trigger } = useForm<FormShowcaseData>({
    resolver: yupResolver(schema),
    defaultValues: emptyValues,
  });

  const fillForm = () => {
    reset(filledValues);
    setSubmittedValues(undefined);
    setFeedback(t('formShowcase.feedback.filled'));
  };

  const clearForm = () => {
    reset(emptyValues);
    setSubmittedValues(undefined);
    setFeedback(t('formShowcase.feedback.cleared'));
  };

  const validateForm = async () => {
    const isValid = await trigger(undefined, { shouldFocus: true });
    setFeedback(t(isValid ? 'formShowcase.feedback.valid' : 'formShowcase.feedback.invalid'));
  };

  const submit = (values: FormShowcaseData) => {
    setSubmittedValues(values);
    setFeedback(t('formShowcase.feedback.submitted'));
  };

  const submittedPreview = submittedValues
    ? {
        ...submittedValues,
        password: '•'.repeat(submittedValues.password.length),
      }
    : undefined;

  return (
    <Stack spacing={3} sx={{ maxWidth: 760, mx: 'auto' }}>
      <Box>
        <H1>{t('formShowcase.title')}</H1>
        <Body1 color="text.secondary" sx={{ mt: 0.75 }}>
          {t('formShowcase.subtitle')}
        </Body1>
      </Box>

      <form noValidate onSubmit={handleSubmit(submit)}>
        <Card variant="outlined" sx={{ p: { xs: 3, sm: 4 } }}>
          <Stack spacing={3}>
            <TextField<FormShowcaseData>
              name="fullName"
              control={control}
              label={t('fields.fullName')}
              autoComplete="name"
              required
              autoFocus
            />
            <TextField<FormShowcaseData>
              name="email"
              control={control}
              label={t('fields.email')}
              type="email"
              autoComplete="email"
              helperText={t('formShowcase.emailHelp')}
              required
            />
            <PasswordField<FormShowcaseData>
              name="password"
              control={control}
              label={t('fields.password')}
              autoComplete="new-password"
              showPasswordLabel={t('actions.showPassword')}
              hidePasswordLabel={t('actions.hidePassword')}
              required
            />
            <Select<FormShowcaseData>
              name="role"
              control={control}
              label={t('fields.teamRole')}
              options={FORM_SHOWCASE_ROLES.map((role) => ({
                value: role,
                label: t(`glossary:showcaseRoles.${role}`),
              }))}
              required
            />
            <RadioGroup<FormShowcaseData>
              name="preferredContact"
              control={control}
              label={t('fields.preferredContact')}
              options={FORM_SHOWCASE_CONTACT_METHODS.map((method) => ({
                value: method,
                label: t(`glossary:contactMethods.${method}`),
              }))}
              required
              row
            />
            <Checkbox<FormShowcaseData> name="acceptTerms" control={control} label={t('fields.acceptTerms')} required />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ justifyContent: 'flex-end' }}>
              <Button type="button" onClick={fillForm}>
                {t('actions.fillExample')}
              </Button>
              <Button type="button" onClick={clearForm}>
                {t('actions.clear')}
              </Button>
              <Button type="button" variant="outlined" onClick={() => void validateForm()}>
                {t('actions.validate')}
              </Button>
              <Button type="submit" variant="contained">
                {t('actions.submitForm')}
              </Button>
            </Stack>
          </Stack>
        </Card>
      </form>

      <Box aria-live="polite">
        {feedback && <Alert severity={submittedValues ? 'success' : 'info'}>{feedback}</Alert>}
      </Box>

      {submittedPreview && (
        <Card variant="outlined" sx={{ p: { xs: 3, sm: 4 } }}>
          <H2 sx={{ fontSize: '1.35rem', mb: 1 }}>{t('formShowcase.submittedValues')}</H2>
          <Body2 color="text.secondary" sx={{ mb: 2 }}>
            {t('formShowcase.passwordMasked')}
          </Body2>
          <Box component="pre" sx={{ m: 0, p: 2, overflow: 'auto', borderRadius: 1, bgcolor: 'action.hover' }}>
            {JSON.stringify(submittedPreview, null, 2)}
          </Box>
        </Card>
      )}
    </Stack>
  );
};
