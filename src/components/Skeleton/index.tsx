import { Skeleton as MuiSkeleton, type SkeletonProps } from '@mui/material';

export const Skeleton = (props: SkeletonProps) => <MuiSkeleton animation="wave" {...props} />;
