import { useState, useRef, useEffect } from 'react';
import {
  TextField,
  FormControl,
  Container,
  Stack,
  Button,
  Grid,
  Typography,
  Badge,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Check as CheckIcon,
  Clear as ClearIcon,
  DisabledByDefault as DisabledByDefaultIcon,
  Telegram as TelegramIcon,
  FactCheck as FactCheckIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import {
  useUpdateUser,
  useUpdateUserAvatar,
  useGetUsers,
  useUpdateTgUserName,
} from '../../queries';
import { getDownloadURL, storage, ref, auth } from '../../services/firebase';
import classes from './UserProfile.module.css';
import { validationProps } from '../../utils/validationForm';
import UserAvatar from '../UserAvatar/UserAvatar';
import TransitionsModal from '../modal/modal';

function UserProfile() {
  const { mutateAsync: putUser } = useUpdateUser();
  const { mutateAsync: postUserAvatar } = useUpdateUserAvatar();
  const { mutateAsync: putTgUsername, isLoading: loadingTgUsername } =
    useUpdateTgUserName();
  const [imageError, setImageError] = useState(false);
  const [encodedImageName, setEncodedImageName] = useState();
  const [encodedImageCode, setEncodedImageCode] = useState();
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState();
  const [currentUser, setCurrentUser] = useState();
  const [loadingUserInfo, setLoadingUserInfo] = useState(false);
  const [enteredTgName, setEnteredTgName] = useState('');
  const [isTgError, setIsTgError] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const inputFileValue = useRef();

  const { avatar, tgName } = validationProps;
  const { data: users } = useGetUsers();
  const currentUserId = auth.currentUser.uid;
  const User = users.find((user) => user.id === currentUserId);

  const clearForm = () => {
    setName('');
    setAvatarUrl();
    inputFileValue.current.value = '';
    setCurrentUser(User);
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

  const updateTg = async () => {
    try {
      await putTgUsername(enteredTgName);
      setOpenSuccessModal(true);
    } catch (e) {
      if (e.message === '500') {
        setIsTgError(true);
      } else {
        setOpenErrorModal(true);
      }
    }
  };

  const updateTgUserName = (e) => {
    e.preventDefault();
    if (enteredTgName) {
      updateTg();
    }
  };

  useEffect(() => {
    setCurrentUser(User);
  }, [users]);

  return (
    <Container maxWidth='md'>
      {openSuccessModal && (
        <TransitionsModal
          isOpen={openSuccessModal}
          title='Изменения успешно сохранены'
          handleClose={() => {
            setOpenSuccessModal(false);
          }}
          icon={<FactCheckIcon color='success' />}
        />
      )}
      {openErrorModal && (
        <TransitionsModal
          isOpen={openErrorModal}
          title='Что-то пошло не так...'
          body='попробуйте презагрузить страницу'
          handleClose={() => {
            setOpenErrorModal(false);
          }}
          icon={<ErrorIcon color='error' />}
        />
      )}
      <Grid container spacing={2} direction='column'>
        <Grid item xs={12}>
          <form onSubmit={validateAndSubmit}>
            <Grid container spacing={2} direction='column'>
              <Grid item xs={12}>
                <Typography variant='h5' gutterBottom>
                  Изменение данных пользователя
                </Typography>
              </Grid>
              <Grid item xs={12}>
                {currentUser && (
                  <Badge
                    invisible={!currentUser.avatar}
                    onClick={deleteAvatar}
                    badgeContent={
                      <DisabledByDefaultIcon
                        color='error'
                        sx={{
                          cursor: 'pointer',
                          fontSize: '24px',
                          '@media (max-width: 600px)': {
                            fontSize: 'small',
                          },
                        }}
                      />
                    }
                  >
                    <UserAvatar
                      key={currentUser.id}
                      name={currentUser.name}
                      id={currentUser.id}
                      avatarUrl={currentUser.avatar}
                    />
                  </Badge>
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
          <form onSubmit={updateTgUserName}>
            <Grid container spacing={2} direction='column'>
              <Grid item xs={12} sx={{ marginTop: '15px' }}>
                <Typography variant='h5'>Привязать Telergamm</Typography>
              </Grid>
              <Grid item xs={12} sx={{ marginTop: '15px' }}>
                <Typography
                  variant='body1'
                  gutterBottom
                  sx={{ textAlign: 'left' }}
                >
                  Для привязки аккаунта, введите Имя пользователя tg и напишите
                  любое сообщение нашему чат боту.
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <TextField
                    variant='outlined'
                    label='Имя пользователя'
                    value={enteredTgName}
                    type='text'
                    onChange={(e) => {
                      setIsTgError(false);
                      setEnteredTgName(e.target.value);
                    }}
                    id='enteredTgName'
                    required
                    helperText={
                      (!enteredTgName && tgName.title) ||
                      (isTgError && tgName.errorTitle)
                    }
                    className={enteredTgName && classes.valid}
                    error={isTgError}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Stack
                  direction='row'
                  spacing={2}
                  sx={{ alignItems: 'center' }}
                >
                  <Button
                    variant='outlined'
                    onClick={() => {
                      window.open('https://t.me/bablo_project_bot', '_blank');
                    }}
                    endIcon={<TelegramIcon />}
                  >
                    Telegram - bot
                  </Button>
                  <LoadingButton
                    loading={loadingTgUsername}
                    variant='contained'
                    color='success'
                    type='submit'
                    endIcon={<CheckIcon />}
                    onSubmit={updateTgUserName}
                  >
                    Сохранить
                  </LoadingButton>
                </Stack>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </Container>
  );
}

export default UserProfile;
