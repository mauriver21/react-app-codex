import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { USER_ROLES, USER_STATUSES, type User, type UserFormValues } from '@/interfaces/User';
import { useUserModel } from '@/models/useUserModel';
import type { RootState } from '@/store';

const emptyValues: UserFormValues = { name: '', email: '', roleId: 'viewer', status: 'active' };

export function UserSavePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const model = useUserModel();
  const entity = useSelector((state: RootState) => model.selectEntity(state, id));
  const currentUser = entity.data as User | undefined;
  const [values, setValues] = useState<UserFormValues>(() =>
    currentUser
      ? {
          name: currentUser.name,
          email: currentUser.email,
          roleId: currentUser.roleId,
          status: currentUser.status,
        }
      : emptyValues,
  );
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string>();
  const isEdit = Boolean(id);

  useEffect(() => {
    if (id && !currentUser) {
      void model
        .readWithResponse(id)
        .then(({ data }) => {
          setValues({ name: data.name, email: data.email, roleId: data.roleId, status: data.status });
        })
        .catch(() => setError(t('users.loadError')));
    }
    // A route id identifies the one initial record load for this mounted form.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const validation = useMemo(
    () => ({
      name: submitted && !values.name.trim() ? t('validation.required') : '',
      email:
        submitted && !values.email.trim()
          ? t('validation.required')
          : submitted && !/^\S+@\S+\.\S+$/.test(values.email)
            ? t('validation.email')
            : '',
    }),
    [submitted, t, values.email, values.name],
  );

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    setError(undefined);
    if (!values.name.trim() || !/^\S+@\S+\.\S+$/.test(values.email)) return;

    const now = new Date().toISOString();
    const user: User = {
      id: currentUser?.id ?? crypto.randomUUID(),
      ...values,
      name: values.name.trim(),
      email: values.email.trim(),
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
      <Typography variant="h1">{t(isEdit ? 'users.editTitle' : 'users.createTitle')}</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Paper component="form" onSubmit={(event) => void submit(event)} variant="outlined" sx={{ p: { xs: 3, sm: 4 } }}>
        <Stack spacing={3}>
          <TextField
            label={t('fields.name')}
            value={values.name}
            onChange={(event) => setValues({ ...values, name: event.target.value })}
            error={Boolean(validation.name)}
            helperText={validation.name}
            autoFocus
          />
          <TextField
            label={t('fields.email')}
            type="email"
            value={values.email}
            onChange={(event) => setValues({ ...values, email: event.target.value })}
            error={Boolean(validation.email)}
            helperText={validation.email}
          />
          <FormControl>
            <InputLabel id="role-label">{t('fields.role')}</InputLabel>
            <Select
              labelId="role-label"
              label={t('fields.role')}
              value={values.roleId}
              onChange={(event) => setValues({ ...values, roleId: event.target.value as User['roleId'] })}
            >
              {USER_ROLES.map((role) => <MenuItem key={role} value={role}>{t(`glossary:roles.${role}`)}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl>
            <InputLabel id="status-label">{t('fields.status')}</InputLabel>
            <Select
              labelId="status-label"
              label={t('fields.status')}
              value={values.status}
              onChange={(event) => setValues({ ...values, status: event.target.value as User['status'] })}
            >
              {USER_STATUSES.map((status) => <MenuItem key={status} value={status}>{t(`glossary:statuses.${status}`)}</MenuItem>)}
            </Select>
          </FormControl>
          <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'flex-end' }}>
            <Button onClick={() => navigate('/users')}>{t('actions.cancel')}</Button>
            <Button type="submit" variant="contained" disabled={model.createState.isLoading || model.updateState.isLoading}>
              {t('actions.save')}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
}
