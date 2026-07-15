import type { ComponentType } from 'react';
import { Skeleton, type SkeletonProps } from '@/components/Skeleton';
import { useSkeletonContext } from '@/components/SkeletonLoader';

export interface WithSkeletonProps {
  skeletonText?: string;
  hideOnSkeleton?: boolean;
}

export const withSkeleton = <T extends object>(
  Component: ComponentType<T>,
  defaultProps?: Partial<SkeletonProps>,
) => {
  const WithSkeletonComponent = (props: T & WithSkeletonProps) => {
    const skeletonContext = useSkeletonContext();
    const { hideOnSkeleton, skeletonText, ...componentProps } = props;

    return (
      <Skeleton
        {...skeletonContext?.skeletonProps}
        {...defaultProps}
        aria-label={skeletonText}
        hideOnSkeleton={hideOnSkeleton}
        loading={skeletonContext?.loading}
      >
        <Component {...(componentProps as T)} />
      </Skeleton>
    );
  };

  return WithSkeletonComponent;
};
