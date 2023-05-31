import { Badge, Skeleton } from '@mui/material';

function AvatarSkeleton() {
  return (
    <Badge>
      <Skeleton
        variant='rectangular'
        sx={{
          boxShadow: '3px 3px 15px rgba(0, 0, 0, 0.5)',
          width: { xs: 50, sm: 70, md: 100 },
          height: { xs: 50, sm: 70, md: 100 },
        }}
      />
    </Badge>
  );
}

export default AvatarSkeleton;
