import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Body1 } from '@/components/Body1';
import { Box } from '@/components/Box';
import { Button } from '@/components/Button';
import { H1 } from '@/components/H1';
import { Skeleton } from '@/components/Skeleton';
import { Stack } from '@/components/Stack';
import { USER_QUERY_KEY, useUserModel } from '@/models/useUserModel';
import type { RootState } from '@/store';

const UserTableSkeleton = ({ label }: { label: string }) => (
  <TableContainer component={Paper} variant="outlined" aria-label={label}>
    <Table>
      <TableHead>
        <TableRow>
          {Array.from({ length: 5 }, (_, index) => (
            <TableCell key={index}>
              <Skeleton width={index === 4 ? 72 : 96} />
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {Array.from({ length: 5 }, (_, row) => (
          <TableRow key={row}>
            {Array.from({ length: 5 }, (_, column) => (
              <TableCell key={column} align={column === 4 ? 'right' : 'left'}>
                <Skeleton width={column === 4 ? 112 : `${72 + column * 6}%`} />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export const UsersPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const model = useUserModel();
  const users = useSelector((state: RootState) => model.selectAllEntities(state));
  const [error, setError] = useState<string>();

  useEffect(() => {
    void model
      .listWithResponse({
        queryKey: USER_QUERY_KEY,
        paginationParams: { _page: 1, _size: 50 },
      })
      .catch(() => setError(t('users.loadError')));
    // The initial query runs once; the model owns later cache updates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removeUser = async (id: string, name: string) => {
    if (!window.confirm(t('users.deleteConfirm', { name }))) return;
    setError(undefined);
    try {
      await model.removeWithResponse(id);
    } catch {
      setError(t('users.deleteError'));
    }
  };

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ justifyContent: 'space-between', gap: 2 }}>
        <Box>
          <H1>{t('users.title')}</H1>
          <Body1 color="text.secondary" sx={{ mt: 0.75 }}>
            {t('users.subtitle')}
          </Body1>
        </Box>
        <Button variant="contained" onClick={() => navigate('/users/create')} sx={{ alignSelf: 'start' }}>
          {t('actions.create')}
        </Button>
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}

      {model.listState.isLoading && users.length === 0 ? (
        <UserTableSkeleton label={t('users.loading')} />
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('fields.name')}</TableCell>
                <TableCell>{t('fields.email')}</TableCell>
                <TableCell>{t('fields.role')}</TableCell>
                <TableCell>{t('fields.status')}</TableCell>
                <TableCell align="right">{t('fields.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell sx={{ fontWeight: 650 }}>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{t(`glossary:roles.${user.roleId}`)}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      color={user.status === 'active' ? 'success' : 'default'}
                      label={t(`glossary:statuses.${user.status}`)}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Button size="small" onClick={() => navigate(`/users/${user.id}`)}>
                      {t('actions.edit')}
                    </Button>
                    <Button size="small" color="error" onClick={() => void removeUser(user.id, user.name)}>
                      {t('actions.delete')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 7, color: 'text.secondary' }}>
                    {t('users.empty')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Stack>
  );
};
