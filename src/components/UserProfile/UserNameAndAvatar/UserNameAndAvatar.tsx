import { useState, useRef, useEffect, useMemo, FormEvent } from 'react';
import {
  TextField,
  Stack,
  Button,
  Grid,
  Typography,
  Divider,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { Check as CheckIcon, Clear as ClearIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { useUpdateUser, useUpdateUserAvatar } from '../../../queries';
import { getDownloadURL, storage, ref } from '../../../services/firebase';
import classes from '../UserProfile.module.css';
import { validationProps } from '../../../utils/validationForm';
import UserProfileAvatar from './UserProfileAvatar';
import AvatarSkeleton from '../Skeleton/AvatarSkeleton';
import { showSnackbarMessage } from '../../../store/slices/snackbarMessage';
import { SnackbarSeverity } from '../../../models/enums/SnackbarSeverity';
import ResponsibleContent from './ResponsibleContent';
import User from '../../../models/User';
import { profileActions } from '../../../store/slices/profileForm';
import BorderBox from '../../UI/BorderBox';

interface Props {
  currentUser: User;
  showSkeleton: boolean;
}

function UserNameAndAvatar({ currentUser, showSkeleton }: Props) {
  const { mutateAsync: putUser } = useUpdateUser();
  const { mutateAsync: postUserAvatar } = useUpdateUserAvatar();
  const [showAvatarSkeleton, setShowAvatarSkeleton] = useState(showSkeleton);
  const [imageError, setImageError] = useState<string | void>();
  const [encodedImageName, setEncodedImageName] = useState<string>('');
  const [encodedImageCode, setEncodedImageCode] = useState<string | void>();
  const [updatedUser, setUpdatedUser] = useState<Partial<User>>({});
  const [avatarUrl, setAvatarUrl] = useState<string | void>();
  const [isAvatarDeleted, setIsAvatarDeleted] = useState(false);
  const [loadingUserInfo, setLoadingUserInfo] = useState(false);
  const inputFileValue = useRef<HTMLTextAreaElement>();
  const dispatch = useAppDispatch();
  const { avatar } = validationProps;
  const name = useAppSelector((state) => state.profileForm.userName);
  const clearForm = () => {
    dispatch(profileActions.setUserName(''));
    setAvatarUrl();
    inputFileValue.current!.value = '';
    setUpdatedUser(currentUser);
    setIsAvatarDeleted(false);
  };

  const deleteAvatar: () => void = () => {
    setAvatarUrl('');
    setEncodedImageCode();
    setEncodedImageName('');
    inputFileValue.current!.value = '';
    const deleteUserAvatar = { ...updatedUser };
    deleteUserAvatar.avatar = '';
    setUpdatedUser(deleteUserAvatar);
    setIsAvatarDeleted(true);
  };

  const changeUserName = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const updateUserName = { ...updatedUser };
    if (e.target.value !== '') {
      updateUserName.name = e.target.value;
      dispatch(profileActions.setUserName(e.target.value));
    } else {
      updateUserName.name = currentUser.name;
      dispatch(profileActions.setUserName(''));
    }
    setUpdatedUser(updateUserName);
  };

  const trasformString = (string: string) => {
    const codeValue: string = string.split('base64,')[1];
    setEncodedImageCode(codeValue);
  };

  const encodeImageFileAsURL = (
    element: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setAvatarUrl();
    const file = (element.target as HTMLInputElement).files![0];
    const fileSize = (element.target as HTMLInputElement).files![0].size;
    const fileType = (element.target as HTMLInputElement).files![0].type.split(
      '/',
    )[1];

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
      setEncodedImageName(
        encodeURIComponent((element.target as HTMLInputElement).files![0].name),
      );
      if (typeof reader.result !== 'string') {
        console.warn(
          'error while encoding image file as url in UserNameAndAvatar.tsx fn: encodeImageFileAsURL',
        );
        return;
      }
      trasformString(reader.result);
      setAvatarUrl(reader.result);

      const updateUserAvatar = { ...updatedUser };
      updateUserAvatar.avatar = reader.result?.toString();
      setUpdatedUser(updateUserAvatar);
    };
  };

  const changeUserAvatar = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setImageError();
    encodeImageFileAsURL(e);
    setIsAvatarDeleted(false);
  };

  const updateUser = async () => {
    try {
      setLoadingUserInfo(true);
      const userUpdates: Partial<User> = {};
      if (encodedImageCode) {
        const response = await postUserAvatar({
          encodedImage: encodedImageCode,
          fileName: encodedImageName,
        });
        if (!storage) return;
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
        dispatch(
          showSnackbarMessage({
            severity: SnackbarSeverity.SUCCESS,
            message: 'Изменения успешно сохранены',
          }),
        );
      }
    } catch {
      dispatch(
        showSnackbarMessage({
          severity: SnackbarSeverity.ERROR,
          message: 'Что-то пошло не так... Попробуйте перезагрузить страницу.',
        }),
      );
    } finally {
      setLoadingUserInfo(false);
      clearForm();
    }
  };

  const validateAndSubmit = (e: FormEvent) => {
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

  const inputName = (
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
  );
  const inputAvatar = (
    <TextField
      variant='outlined'
      label={undefined}
      type='file'
      id='avatar'
      onChange={changeUserAvatar}
      helperText={imageError || avatar.title}
      error={!!imageError}
      inputProps={{ ref: inputFileValue }}
      className={(avatarUrl as string) && classes.valid}
    />
  );
  const avatarBlock = showAvatarSkeleton ? (
    <AvatarSkeleton />
  ) : (
    <UserProfileAvatar
      currentUser={updatedUser as User}
      deleteAvatar={deleteAvatar}
    />
  );
  return (
    <BorderBox marginProp={2} borderRadius={2}>
      <Grid item xs={12} sx={{ m: 4 }}>
        <form onSubmit={validateAndSubmit}>
          <Grid container spacing={2} direction='column'>
            <Grid item xs={12}>
              <Typography variant='h6' gutterBottom sx={{ textAlign: 'left' }}>
                Имя и Аватар
              </Typography>
              <Divider />
            </Grid>
            <ResponsibleContent
              avatarBlock={avatarBlock}
              inputAvatar={inputAvatar}
              inputName={inputName}
            />
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
    </BorderBox>
  );
}

export default UserNameAndAvatar;
