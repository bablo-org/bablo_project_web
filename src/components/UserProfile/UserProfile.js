import { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Stack,
  Button,
  Grid,
  Typography,
  Divider,
} from '@mui/material';
import {
  FactCheck as FactCheckIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { useGetUsers } from '../../queries';
import { auth } from '../../services/firebase';
import TransitionsModal from '../modal/modal';
import TelegramProfile from './TelegramProfile';
import UserProfileLoader from './Skeleton/UserProfileLoader';
import UserCurrancy from './UserCurrancy';
import UserNameAndAvatar from './UserNameAndAvatar';

function UserProfile() {
  const [currentUser, setCurrentUser] = useState();
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [openErrorModal, setOpenErrorModal] = useState(false);

  const { data: users, isFetching: usersLoading } = useGetUsers();
  const currentUserId = auth.currentUser.uid;
  const user = useMemo(
    () => users.find((u) => u.id === currentUserId),
    [users, currentUserId],
  );

  const showSkeleton = useMemo(
    () => usersLoading || !currentUser,
    [usersLoading, currentUser],
  );

  useEffect(() => {
    setCurrentUser(user);
  }, [users]);

  return (
    <Container maxWidth='md'>
      <TransitionsModal
        isOpen={openSuccessModal}
        title='Изменения успешно сохранены'
        handleClose={() => {
          setOpenSuccessModal(false);
        }}
        icon={<FactCheckIcon color='success' />}
        body={
          <Stack
            direction='row'
            spacing={2}
            sx={{ alignItems: 'center', marginTop: '10px' }}
          >
            <Button
              variant='outlined'
              onClick={() => {
                setOpenSuccessModal(false);
              }}
            >
              Ок
            </Button>
          </Stack>
        }
      />
      <TransitionsModal
        isOpen={openErrorModal}
        title='Что-то пошло не так...'
        handleClose={() => {
          setOpenErrorModal(false);
        }}
        icon={<ErrorIcon color='error' />}
        body={
          <Stack
            direction='row'
            spacing={2}
            sx={{ alignItems: 'center', marginTop: '10px' }}
          >
            <Button
              variant='outlined'
              onClick={() => {
                setOpenErrorModal(false);
              }}
            >
              Ок
            </Button>
          </Stack>
        }
      />
      <Grid container spacing={2} direction='column'>
        <UserNameAndAvatar
          user={user}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          setOpenSuccessModal={setOpenSuccessModal}
          setOpenErrorModal={setOpenErrorModal}
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
              setOpenSuccessModal={setOpenSuccessModal}
              setOpenErrorModal={setOpenErrorModal}
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
          {showSkeleton ? (
            <UserProfileLoader />
          ) : (
            <UserCurrancy
              currentUser={currentUser}
              setOpenSuccessModal={setOpenSuccessModal}
              setOpenErrorModal={setOpenErrorModal}
            />
          )}
        </Grid>
      </Grid>
      <Grid item xs={12} sx={{ paddingBottom: '50px' }} />
    </Container>
  );
}

export default UserProfile;
