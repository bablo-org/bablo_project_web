import { useMemo } from 'react';
import { Container, Grid, Typography, Divider } from '@mui/material';
import { useGetUsers } from '../../queries';
import { auth } from '../../services/firebase';
import TelegramProfile from './TelegramProfile';
import UserCurrency from './UserCurrency';
import UserNameAndAvatar from './UserNameAndAvatar/UserNameAndAvatar';
import BorderBox from '../UI/BorderBox';

function UserProfile() {
  const { data: users, isFetching: usersLoading } = useGetUsers();
  const currentUserId = auth?.currentUser?.uid;
  const currentUser = useMemo(
    () => users?.find((u) => u.id === currentUserId),
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
          currentUser={currentUser!}
          showSkeleton={showSkeleton}
        />
        <BorderBox marginProp={2} borderRadius={2}>
          <Grid item xs={12} sx={{ m: 4 }}>
            <Typography
              variant='h6'
              sx={{ marginTop: '15px', textAlign: 'left' }}
              gutterBottom
            >
              Telergam
            </Typography>
            <Divider />
            <TelegramProfile currentUser={currentUser!} />
          </Grid>
        </BorderBox>
        <BorderBox marginProp={2} borderRadius={2}>
          <Grid item xs={12} sx={{ m: 4 }}>
            <Typography
              variant='h6'
              sx={{ marginTop: '15px', textAlign: 'left' }}
              gutterBottom
            >
              Избранные валюты
            </Typography>
            <Divider />
            <UserCurrency currentUser={currentUser!} />
          </Grid>
        </BorderBox>
      </Grid>
      <Grid item xs={12} sx={{ paddingBottom: '50px' }} />
    </Container>
  );
}

export default UserProfile;
