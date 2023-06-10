import { Stack, Skeleton, Box } from '@mui/material';
import UserAvatar from '../UserAvatar/UserAvatar';
import User from '../../models/User';

interface AvatarListProps {
  users: User[] | undefined;
  loading: boolean;
  error: boolean;
  selectedUserIds: string[];
  disabledUserIds: string[];
  toggleSelectedId: (id: string) => void;
}

function AvatarsList({
  users,
  loading,
  error,
  selectedUserIds,
  disabledUserIds,
  toggleSelectedId,
}: AvatarListProps) {
  const renderAvatar = (user: User) => {
    return (
      <UserAvatar
        xs={50}
        sm={70}
        md={100}
        key={user.id}
        name={user.name}
        id={user.id}
        toggleSelectedId={toggleSelectedId}
        isActive={selectedUserIds.includes(user.id)}
        isDisabled={disabledUserIds.includes(user.id)}
        avatarUrl={user.avatar}
      />
    );
  };

  return (
    <Stack direction='row' justifyContent='center'>
      {loading
        ? Array.from(Array(5)).map((_, i) => {
            const key = i;
            return (
              <Box key={key}>
                <Skeleton
                  variant='rounded'
                  sx={{
                    width: { xs: 50, sm: 70, md: 100 },
                    height: { xs: 50, sm: 70, md: 100 },
                    marginLeft: { xs: 0.8, sm: 1.3, md: 4 },
                    marginRight: { xs: 0.8, sm: 1.3, md: 4 },
                  }}
                  animation='wave'
                />
              </Box>
            );
          })
        : users?.map((user) => renderAvatar(user))}
      {error && <div>Дрюс что-то сломал.</div>}
    </Stack>
  );
}

export default AvatarsList;
