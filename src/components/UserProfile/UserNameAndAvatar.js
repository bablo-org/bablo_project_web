import { useState, useRef, useEffect, useMemo } from 'react';
import {
  TextField,
  FormControl,
  Stack,
  Button,
  Grid,
  Typography,
  Divider,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { Check as CheckIcon, Clear as ClearIcon } from '@mui/icons-material';
import { useUpdateUser, useUpdateUserAvatar } from '../../queries';
import { getDownloadURL, storage, ref } from '../../services/firebase';
import classes from './UserProfile.module.css';
import { validationProps } from '../../utils/validationForm';
import UserProfileAvatar from './UserProfileAvatar';
import AvatarSkeleton from './Skeleton/AvatarSkeleton';

function UserNameAndAvatar({ currentUser, setSnackbarType, showSkeleton }) {
  const { mutateAsync: putUser } = useUpdateUser();
  const { mutateAsync: postUserAvatar } = useUpdateUserAvatar();
  const [showAvatarSkeleton, setShowAvatarSkeleton] = useState(showSkeleton);
  const [imageError, setImageError] = useState(false);
  const [encodedImageName, setEncodedImageName] = useState();
  const [encodedImageCode, setEncodedImageCode] = useState();
  const [updatedUser, setUpdatedUser] = useState({});
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState();
  const [isAvatarDeleted, setIsAvatarDeleted] = useState(false);
  const [loadingUserInfo, setLoadingUserInfo] = useState(false);
  const inputFileValue = useRef();
  const { avatar } = validationProps;

  const clearForm = () => {
    setName('');
    setAvatarUrl();
    inputFileValue.current.value = '';
    setUpdatedUser(currentUser);
    setIsAvatarDeleted(false);
  };

  const deleteAvatar = () => {
    setAvatarUrl('');
    setEncodedImageCode();
    setEncodedImageName();
    inputFileValue.current.value = '';
    const deleteUserAvatar = { ...updatedUser };
    deleteUserAvatar.avatar = '';
    setUpdatedUser(deleteUserAvatar);
    setIsAvatarDeleted(true);
  };

  const changeUserName = (e) => {
    const updateUserName = { ...updatedUser };
    if (e.target.value !== '') {
      updateUserName.name = e.target.value;
      setName(e.target.value);
    } else {
      updateUserName.name = currentUser.name;
      setName('');
    }
    setUpdatedUser(updateUserName);
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

      const updateUserAvatar = { ...updatedUser };
      updateUserAvatar.avatar = reader.result;
      setUpdatedUser(updateUserAvatar);
    };
  };

  const changeUserAvatar = (e) => {
    setImageError();
    encodeImageFileAsURL(e);
    setIsAvatarDeleted(false);
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
        setSnackbarType('success');
      }
    } catch {
      setSnackbarType('error');
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

  const isDisabledButton = useMemo(
    () => !name && !avatarUrl && !isAvatarDeleted,
    [name, avatarUrl, isAvatarDeleted],
  );

  useEffect(() => {
    setUpdatedUser(currentUser);
    if (!showSkeleton) {
      setShowAvatarSkeleton(false);
    }
  }, [currentUser]);

  return (
    <Grid item xs={12}>
      <form onSubmit={validateAndSubmit}>
        <Grid container spacing={2} direction='column'>
          <Grid item xs={12}>
            <Typography variant='h6' gutterBottom sx={{ textAlign: 'left' }}>
              Имя и Аватар
            </Typography>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            {showAvatarSkeleton ? (
              <AvatarSkeleton />
            ) : (
              <UserProfileAvatar
                currentUser={updatedUser}
                deleteAvatar={deleteAvatar}
              />
            )}
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth required>
              <TextField
                placeholder={updatedUser?.name || 'Имя пользователя'}
                variant='outlined'
                label='Имя'
                value={name}
                type='text'
                id='name'
                onChange={changeUserName}
                helperText='Введите имя пользователя'
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
                disabled={isDisabledButton}
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
                disabled={isDisabledButton}
              >
                Сохранить
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </Grid>
  );
}

export default UserNameAndAvatar;
