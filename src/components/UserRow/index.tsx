import type { PropsWithChildren } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/Button';
import { TableCell } from '@/components/TableCell';
import { TableRow } from '@/components/TableRow';
import { useSkeletonContext } from '@/components/SkeletonLoader';
import { getUserEditRoute } from '@/constants/routes';
import { withSkeleton } from '@/hocs/withSkeleton';
import type { RootState } from '@/interfaces/RootState';
import type { User } from '@/interfaces/User';
import { useUserModel } from '@/models/useUserModel';

const CellContentBase = ({ children }: PropsWithChildren) => <>{children}</>;
const CellContent = withSkeleton(CellContentBase, { height: 24, width: '78%' });

export interface UserRowProps {
  userId: string;
  onDelete: (user: User) => void;
}

export const UserRow = ({ userId, onDelete }: UserRowProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const model = useUserModel();
  const skeletonContext = useSkeletonContext();
  const entity = useSelector((state: RootState) => model.selectEntity(state, userId));
  const user = entity.data as User | undefined;

  if (!skeletonContext?.loading && !user) return null;

  return (
    <TableRow hover={!skeletonContext?.loading}>
      <TableCell sx={{ fontWeight: 650 }}>
        <CellContent skeletonText={t('fields.name')}>{user?.name}</CellContent>
      </TableCell>
      <TableCell>
        <CellContent skeletonText={t('fields.email')}>{user?.email}</CellContent>
      </TableCell>
      <TableCell>
        <CellContent skeletonText={t('fields.role')}>
          {user ? t(`glossary:roles.${user.roleId}`) : undefined}
        </CellContent>
      </TableCell>
      <TableCell>
        <CellContent skeletonText={t('fields.status')}>
          {user ? t(`glossary:statuses.${user.status}`) : undefined}
        </CellContent>
      </TableCell>
      <TableCell align="right">
        <CellContent skeletonText={t('fields.actions')}>
          {user && (
            <>
              <Button size="small" onClick={() => navigate(getUserEditRoute(user.id))}>
                {t('actions.edit')}
              </Button>
              <Button size="small" color="error" onClick={() => onDelete(user)}>
                {t('actions.delete')}
              </Button>
            </>
          )}
        </CellContent>
      </TableCell>
    </TableRow>
  );
};
