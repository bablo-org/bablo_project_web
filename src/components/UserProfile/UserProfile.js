import { useMemo } from 'react';
import { Container, Grid, Typography, Divider } from '@mui/material';
import { useGetUsers } from '../../queries';
import { auth } from '../../services/firebase';
import TelegramProfile from './TelegramProfile';
import UserProfileLoader from './Skeleton/UserProfileLoader';
import UserCurrency from './UserCurrency';
import UserNameAndAvatar from './UserNameAndAvatar/UserNameAndAvatar';

function UserProfile() {
  const { data: users, isFetching: usersLoading } = useGetUsers();
  const currentUserId = auth.currentUser.uid;
  const currentUser = useMemo(
    () => users.find((u) => u.id === currentUserId),
    [users, currentUserId],
  );

  const showSkeleton = useMemo(
    () => usersLoading || !currentUser,
    [usersLoading, currentUser],
  );

  return (
    <Container maxWidth='md'>
      <Grid container spacing={2} direction='column'>
        <UserNameAndAvatar
          currentUser={currentUser}
          showSkeleton={showSkeleton}
        />
        <Grid item xs={12}>
          <Typography
            variant='h6'
            sx={{ marginTop: '15px', textAlign: 'left' }}
            gutterBottom
          >
            Telergam
          </Typography>
          <Divider />
          {showSkeleton ? (
            <UserProfileLoader />
          ) : (
            <TelegramProfile
              enableTgNotifications={currentUser.enableTgNotifications}
              telegramUser={currentUser.telegramUser}
              UsersLoading={usersLoading}
            />
          )}
        </Grid>
        <Grid item xs={12}>
          <Typography
            variant='h6'
            sx={{ marginTop: '15px', textAlign: 'left' }}
            gutterBottom
          >
            Избранные валюты
          </Typography>
          <Divider />
          <UserCurrency currentUser={currentUser} />
        </Grid>
      </Grid>
      <Grid item xs={12} sx={{ paddingBottom: '50px' }} />
    </Container>
  );
}

export default UserProfile;
