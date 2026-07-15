import { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Alert } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Checkbox } from '@/components/Checkbox';
import { H1 } from '@/components/H1';
import { PasswordField } from '@/components/PasswordField';
import { Select } from '@/components/Select';
import { Stack } from '@/components/Stack';
import { TextField } from '@/components/TextField';
import { USER_ROLES, USER_STATUSES } from '@/constants/enums';
import { USERS_ROUTE } from '@/constants/routes';
import { useUserSaveSchema } from '@/form-schemas/useUserSaveSchema';
import type { RootState } from '@/interfaces/RootState';
import type { User } from '@/interfaces/User';
import type { UserSaveFormData } from '@/interfaces/UserSaveFormData';
import { useUserModel } from '@/models/useUserModel';

const emptyValues: UserSaveFormData = {
  name: '',
  email: '',
  roleId: '',
  status: '',
  password: '',
  requirePasswordChange: false,
};

const toFormValues = (user: User): UserSaveFormData => ({
  name: user.name,
  email: user.email,
  roleId: user.roleId,
  status: user.status,
  password: '',
  requirePasswordChange: false,
});

export const UserSavePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const schema = useUserSaveSchema();
  const model = useUserModel();
  const entity = useSelector((state: RootState) => model.selectEntity(state, id));
  const currentUser = entity.data as User | undefined;
  const [error, setError] = useState<string>();
  const isEdit = Boolean(id);
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<UserSaveFormData>({
    resolver: yupResolver(schema),
    defaultValues: currentUser ? toFormValues(currentUser) : emptyValues,
  });

  useEffect(() => {
    if (id && !currentUser) {
      void model
        .readWithResponse(id)
        .then(({ data }) => reset(toFormValues(data)))
        .catch(() => setError(t('users.loadError')));
    }
    // A route id identifies the one initial record load for this mounted form.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const submit = async (values: UserSaveFormData) => {
    setError(undefined);
    const now = new Date().toISOString();
    const user: User = {
      id: currentUser?.id ?? crypto.randomUUID(),
      ...values,
      createdAt: currentUser?.createdAt ?? now,
      updatedAt: now,
    };

    try {
      if (isEdit && id) await model.updateWithResponse(id, user);
      else await model.createWithResponse(user);
      navigate(USERS_ROUTE);
    } catch {
      setError(t('users.saveError'));
    }
  };

  return (
    <Stack spacing={3} sx={{ maxWidth: 680, mx: 'auto' }}>
      <H1>{t(isEdit ? 'users.editTitle' : 'users.createTitle')}</H1>
      {error && <Alert severity="error">{error}</Alert>}
      <Card component="form" onSubmit={handleSubmit(submit)} variant="outlined" sx={{ p: { xs: 3, sm: 4 } }}>
        <Stack spacing={3}>
          <TextField<UserSaveFormData> name="name" control={control} label={t('fields.name')} autoFocus />
          <TextField<UserSaveFormData> name="email" control={control} label={t('fields.email')} type="email" />
          <Select<UserSaveFormData>
            name="roleId"
            control={control}
            label={t('fields.role')}
            options={USER_ROLES.map((role) => ({
              value: role,
              label: t(`glossary:roles.${role}`),
            }))}
          />
          <Select<UserSaveFormData>
            name="status"
            control={control}
            label={t('fields.status')}
            options={USER_STATUSES.map((status) => ({
              value: status,
              label: t(`glossary:statuses.${status}`),
            }))}
          />
          <PasswordField<UserSaveFormData>
            name="password"
            control={control}
            label={t('fields.password')}
            showPasswordLabel={t('actions.showPassword')}
            hidePasswordLabel={t('actions.hidePassword')}
          />
          <Checkbox<UserSaveFormData>
            name="requirePasswordChange"
            control={control}
            label={t('fields.requirePasswordChange')}
          />
          <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'flex-end' }}>
            <Button onClick={() => navigate(USERS_ROUTE)}>{t('actions.cancel')}</Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {t('actions.save')}
            </Button>
          </Stack>
        </Stack>
      </Card>
    </Stack>
  );
};
