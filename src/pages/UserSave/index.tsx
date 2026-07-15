import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, FormControl, InputLabel, MenuItem, Paper, Select } from '@mui/material';
import { Controller as FormController, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/Button';
import { H1 } from '@/components/H1';
import { Stack } from '@/components/Stack';
import { TextField } from '@/components/TextField';
import {
  useUserSaveSchema,
  type UserSaveFormValues,
} from '@/form-schemas/useUserSaveSchema';
import { USER_ROLES, USER_STATUSES, type User } from '@/interfaces/User';
import { useUserModel } from '@/models/useUserModel';
import type { RootState } from '@/store';

const emptyValues: UserSaveFormValues = {
  name: '',
  email: '',
  roleId: 'viewer',
  status: 'active',
};

const toFormValues = (user: User): UserSaveFormValues => ({
  name: user.name,
  email: user.email,
  roleId: user.roleId,
  status: user.status,
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
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserSaveFormValues>({
    resolver: zodResolver(schema),
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

  const submit = async (values: UserSaveFormValues) => {
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
      navigate('/users');
    } catch {
      setError(t('users.saveError'));
    }
  };

  return (
    <Stack spacing={3} sx={{ maxWidth: 680, mx: 'auto' }}>
      <H1>{t(isEdit ? 'users.editTitle' : 'users.createTitle')}</H1>
      {error && <Alert severity="error">{error}</Alert>}
      <Paper
        component="form"
        onSubmit={handleSubmit(submit)}
        variant="outlined"
        sx={{ p: { xs: 3, sm: 4 } }}
      >
        <Stack spacing={3}>
          <TextField
            label={t('fields.name')}
            error={Boolean(errors.name)}
            helperText={errors.name?.message}
            autoFocus
            {...register('name')}
          />
          <TextField
            label={t('fields.email')}
            type="email"
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
            {...register('email')}
          />
          <FormController
            name="roleId"
            control={control}
            render={({ field }) => (
              <FormControl>
                <InputLabel id="role-label">{t('fields.role')}</InputLabel>
                <Select {...field} labelId="role-label" label={t('fields.role')}>
                  {USER_ROLES.map((role) => (
                    <MenuItem key={role} value={role}>
                      {t(`glossary:roles.${role}`)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
          <FormController
            name="status"
            control={control}
            render={({ field }) => (
              <FormControl>
                <InputLabel id="status-label">{t('fields.status')}</InputLabel>
                <Select {...field} labelId="status-label" label={t('fields.status')}>
                  {USER_STATUSES.map((status) => (
                    <MenuItem key={status} value={status}>
                      {t(`glossary:statuses.${status}`)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
          <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'flex-end' }}>
            <Button onClick={() => navigate('/users')}>{t('actions.cancel')}</Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {t('actions.save')}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
};
