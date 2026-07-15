import { Skeleton as MuiSkeleton, type SkeletonProps as MuiSkeletonProps } from '@mui/material';
import type { PropsWithChildren } from 'react';

export interface SkeletonProps extends MuiSkeletonProps {
  loading?: boolean;
  fitContent?: boolean;
  hideOnSkeleton?: boolean;
}

export const Skeleton = ({
  loading,
  children,
  fitContent,
  hideOnSkeleton = false,
  sx,
  ...rest
}: PropsWithChildren<SkeletonProps>) => {
  if (!loading) return <>{children}</>;
  if (hideOnSkeleton) return null;

  return (
    <MuiSkeleton
      {...rest}
      sx={{ ...(fitContent ? { maxWidth: '100%', transform: 'none' } : {}), ...sx }}
    />
  );
};
