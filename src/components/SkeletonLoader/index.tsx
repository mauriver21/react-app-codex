/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, type ReactNode } from 'react';
import type { SkeletonProps } from '@/components/Skeleton';

export interface SkeletonLoaderProps {
  loading?: boolean;
  skeletonProps?: Omit<SkeletonProps, 'children' | 'loading'>;
  children?: ReactNode;
}

export const SkeletonContext = createContext<
  Pick<SkeletonLoaderProps, 'loading' | 'skeletonProps'> | undefined
>(undefined);

export const useSkeletonContext = () => useContext(SkeletonContext);

export const SkeletonLoader = ({ children, loading, skeletonProps }: SkeletonLoaderProps) => (
  <SkeletonContext.Provider value={{ skeletonProps, loading }}>
    {children}
  </SkeletonContext.Provider>
);
