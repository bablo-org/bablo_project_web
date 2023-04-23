import { useState, useRef, useEffect, useMemo } from 'react';
import {
  TextField,
  FormControl,
  Container,
  Stack,
  Button,
  Grid,
  Typography,
  Divider,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Check as CheckIcon,
  Clear as ClearIcon,
  FactCheck as FactCheckIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { useUpdateUser, useUpdateUserAvatar, useGetUsers } from '../../queries';
import { getDownloadURL, storage, ref, auth } from '../../services/firebase';
import classes from './UserProfile.module.css';
import { validationProps } from '../../utils/validationForm';
import TransitionsModal from '../modal/modal';
import TelegramProfile from './TelegramProfile';
import UserProfileAvatar from './UserProfileAvatar';
import AvatarSkeleton from './Skeleton/AvatarSkeleton';
import TelegramSkeleton from './Skeleton/TelegramSkeleton';

function UserProfile() {
  const { mutateAsync: putUser } = useUpdateUser();
  const { mutateAsync: postUserAvatar } = useUpdateUserAvatar();
  const [imageError, setImageError] = useState(false);
  const [encodedImageName, setEncodedImageName] = useState();
  const [encodedImageCode, setEncodedImageCode] = useState();
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState();
  const [currentUser, setCurrentUser] = useState();
  const [loadingUserInfo, setLoadingUserInfo] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const inputFileValue = useRef();

  const { avatar } = validationProps;
  const { data: users, isFetching: usersLoading } = useGetUsers();
  const currentUserId = auth.currentUser.uid;
  const user = useMemo(
    () => users.find((u) => u.id === currentUserId),
    [users, currentUserId],
  );

  const clearForm = () => {
    setName('');
    setAvatarUrl();
    inputFileValue.current.value = '';
    setCurrentUser(user);
  };

  const deleteAvatar = () => {
    setAvatarUrl('');
    setEncodedImageCode();
    setEncodedImageName();
    inputFileValue.current.value = '';
    const deleteUserAvatar = { ...currentUser };
    deleteUserAvatar.avatar = '';
    setCurrentUser(deleteUserAvatar);
  };

  const changeUserName = (e) => {
    const updateUserName = { ...currentUser };
    updateUserName.name = e.target.value;
    setName(e.target.value);
    setCurrentUser(updateUserName);
  };

  const trasformString = (string) => {
    const codeValue = string.split('base64,')[1];
    setEncodedImageCode(codeValue);
  };

  const encodeImageFileAsURL = (element) => {
    setAvatarUrl();
    const file = element.target.files[0];
    const fileSize = element.target.files[0].size;
    const fileType = element.target.files[0].type.split('/')[1];

    if (fileSize > 1024001) {
      setImageError(avatar.errorSizeTitle);
      return;
    }

    if (!['jpeg', 'bmp', 'png', 'gif'].includes(fileType)) {
      setImageError(avatar.errorTypeTitle);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setEncodedImageName(encodeURIComponent(element.target.files[0].name));
      trasformString(reader.result);
      setAvatarUrl(reader.result);

      const updateUserAvatar = { ...currentUser };
      updateUserAvatar.avatar = reader.result;
      setCurrentUser(updateUserAvatar);
    };
  };

  const changeUserAvatar = (e) => {
    setImageError();
    encodeImageFileAsURL(e);
  };

  const updateUser = async () => {
    try {
      setLoadingUserInfo(true);
      const userUpdates = {};
      if (encodedImageCode) {
        const response = await postUserAvatar({
          encodedImage: encodedImageCode,
          fileName: encodedImageName,
        });
        const avatarDownloadURL = await getDownloadURL(
          ref(storage, response.path),
        );
        userUpdates.avatar = avatarDownloadURL;
      } else if (avatarUrl === '') {
        userUpdates.avatar = '';
      }
      if (name) {
        userUpdates.name = name;
      }
      if (userUpdates) {
        await putUser(userUpdates);
        setOpenSuccessModal(true);
      }
    } catch {
      setOpenErrorModal(true);
    } finally {
      setLoadingUserInfo(false);
      clearForm();
    }
  };

  const validateAndSubmit = (e) => {
    e.preventDefault();
    if (!name && !encodedImageName && avatarUrl !== '') {
      return;
    }
    if (imageError) {
      return;
    }
    updateUser();
  };

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
                setOpenSuccessModal(false);
              }}
            >
              Ок
            </Button>
          </Stack>
        }
      />
      <Grid container spacing={2} direction='column'>
        <Grid item xs={12}>
          <form onSubmit={validateAndSubmit}>
            <Grid container spacing={2} direction='column'>
              <Grid item xs={12}>
                <Typography
                  variant='h6'
                  gutterBottom
                  sx={{ textAlign: 'left' }}
                >
                  Имя и Аватар
                </Typography>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                {showSkeleton ? (
                  <AvatarSkeleton />
                ) : (
                  <UserProfileAvatar
                    currentUser={currentUser}
                    deleteAvatar={deleteAvatar}
                  />
                )}
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <TextField
                    placeholder={currentUser?.name || 'Имя пользователя'}
                    variant='outlined'
                    label='Имя'
                    value={name}
                    type='text'
                    id='name'
                    onChange={changeUserName}
                    helperText={!name && 'Введите имя пользователя'}
                    className={name && classes.valid}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <TextField
                    variant='outlined'
                    label={avatarUrl && 'Аватар'}
                    type='file'
                    id='avatar'
                    onChange={changeUserAvatar}
                    helperText={imageError || avatar.title}
                    error={imageError}
                    inputProps={{ ref: inputFileValue }}
                    className={avatarUrl && classes.valid}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Stack direction='row' spacing={2}>
                  <Button
                    variant='outlined'
                    color='error'
                    onClick={clearForm}
                    endIcon={<ClearIcon />}
                  >
                    Очистить
                  </Button>
                  <LoadingButton
                    loading={loadingUserInfo}
                    variant='contained'
                    color='success'
                    type='submit'
                    endIcon={<CheckIcon />}
                    onSubmit={validateAndSubmit}
                  >
                    Сохранить
                  </LoadingButton>
                </Stack>
              </Grid>
            </Grid>
          </form>
        </Grid>
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
            <TelegramSkeleton />
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
      </Grid>
    </Container>
  );
}

export default UserProfile;
