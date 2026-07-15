import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Alert } from '@mui/material';
import { Body1 } from '@/components/Body1';
import { Box } from '@/components/Box';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { H1 } from '@/components/H1';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import { Stack } from '@/components/Stack';
import { Table } from '@/components/Table';
import { TableBody } from '@/components/TableBody';
import { TableCell } from '@/components/TableCell';
import { TableContainer } from '@/components/TableContainer';
import { TableHead } from '@/components/TableHead';
import { TableRow } from '@/components/TableRow';
import { UserRow } from '@/components/UserRow';
import { USER_QUERY_KEY } from '@/constants/enums';
import { USER_CREATE_ROUTE } from '@/constants/routes';
import type { RootState } from '@/interfaces/RootState';
import type { User } from '@/interfaces/User';
import { useUserModel } from '@/models/useUserModel';

export const UsersPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const model = useUserModel();
  const users = useSelector((state: RootState) => model.selectAllEntities(state));
  const [error, setError] = useState<string>();
  const initialLoading = model.listState.isLoading && users.length === 0;
  const rowIds = initialLoading
    ? Array.from({ length: 5 }, (_, index) => `skeleton-${index}`)
    : users.map((user) => String(user.id));

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

  const removeUser = async (user: User) => {
    if (!window.confirm(t('users.deleteConfirm', { name: user.name }))) return;
    setError(undefined);
    try {
      await model.removeWithResponse(user.id);
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
        <Button variant="contained" onClick={() => navigate(USER_CREATE_ROUTE)} sx={{ alignSelf: 'start' }}>
          {t('actions.create')}
        </Button>
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}

      <Card variant="outlined">
        <SkeletonLoader loading={initialLoading} skeletonProps={{ animation: 'wave' }}>
          <TableContainer aria-label={initialLoading ? t('users.loading') : undefined}>
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
                {rowIds.map((userId) => (
                  <UserRow key={userId} userId={userId} onDelete={(user) => void removeUser(user)} />
                ))}
                {!initialLoading && users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 7, color: 'text.secondary' }}>
                      {t('users.empty')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </SkeletonLoader>
      </Card>
    </Stack>
  );
};
