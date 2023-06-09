/* eslint-disable import/no-duplicates */
import { useEffect, useState, useMemo, FormEvent } from 'react';
import {
  TextField,
  FormControl,
  Stack,
  Button,
  Grid,
  Typography,
  Switch,
  Divider,
  Collapse,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Check as CheckIcon,
  Telegram as TelegramIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import classes from './UserProfile.module.css';
import { validationProps } from '../../utils/validationForm';
import { useUpdateTgUserName, useUpdateUserSettings } from '../../queries';
import TransitionsModal from '../modal/modal';
import { showSnackbarMessage } from '../../store/slices/snackbarMessage';
import { SnackbarSeverity } from '../../models/enums/SnackbarSeverity';
import TelegramSkeleton from './Skeleton/TelegramSkeleton';
import User from '../../models/User';
import { profileActions } from '../../store/slices/profileForm';

interface Props {
  currentUser: User;
}

function TelegramProfile({ currentUser }: Props) {
  const { mutateAsync: putTgUserName, isLoading: loadingTgUsername } =
    useUpdateTgUserName();
  const { mutateAsync: putUserSettings, isLoading: loadingUserSettings } =
    useUpdateUserSettings();
  const [isTgError, setIsTgError] = useState(false);
  const { tgName } = validationProps;
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [isNotificationOn, setIsNotificationOn] = useState(true);
  const dispatch = useAppDispatch();
  const showSkeleton = useMemo(() => !currentUser, [currentUser]);
  const tgUserName = useAppSelector((state) => state.profileForm.tgUserName);
  const tgCollapse = useAppSelector(
    (state) => state.profileForm.showTgCollapse,
  );
  const user = useMemo(() => {
    if (currentUser) return currentUser;
    return undefined;
  }, [currentUser]);

  const updateTg = async (Name: string) => {
    try {
      await putTgUserName(Name);
      dispatch(
        showSnackbarMessage({
          severity: SnackbarSeverity.SUCCESS,
          message: 'Изменения успешно сохранены',
        }),
      );
    } catch (e: any) {
      if (e?.message === '500') {
        setIsTgError(true);
      } else {
        dispatch(
          showSnackbarMessage({
            severity: SnackbarSeverity.ERROR,
            message:
              'Что-то пошло не так... Попробуйте перезагрузить страницу.',
          }),
        );
      }
    }
  };

  const updateTgUserName = (e: FormEvent) => {
    e.preventDefault();
    if (tgUserName.includes('@')) {
      updateTg(tgUserName.slice(1));
    } else {
      updateTg(tgUserName);
    }
  };

  const updateUserSettings = async () => {
    try {
      const updatedSettings = {
        enableTelegramNotifications: !isNotificationOn,
      };
      await putUserSettings(updatedSettings);
      dispatch(
        showSnackbarMessage({
          severity: SnackbarSeverity.SUCCESS,
          message: 'Изменения успешно сохранены',
        }),
      );
    } catch {
      dispatch(
        showSnackbarMessage({
          severity: SnackbarSeverity.ERROR,
          message: 'Что-то пошло не так... Попробуйте перезагрузить страницу.',
        }),
      );
    } finally {
      setConfirmModalOpen(false);
    }
  };

  const toggleNotifications = () => {
    if (isNotificationOn) {
      setConfirmModalOpen(true);
    } else {
      updateUserSettings();
    }
  };

  const choseTgNameTextHelper = () => {
    if (isTgError) {
      return tgName.errorTitle;
    }
    return tgName.title;
  };

  useEffect(() => {
    if (user?.privateData?.settings) {
      setIsNotificationOn(
        user?.privateData?.settings?.enableTelegramNotifications!,
      );
    }
  }, [user?.privateData?.settings]);

  return (
    <form onSubmit={updateTgUserName}>
      {showSkeleton ? (
        <TelegramSkeleton />
      ) : (
        <Grid
          container
          spacing={2}
          direction='column'
          sx={{ textAlign: 'left', marginTop: '5px' }}
        >
          <TransitionsModal
            isOpen={confirmModalOpen}
            title='Выключить уведомления?'
            handleClose={() => {
              setConfirmModalOpen(false);
            }}
            body={
              <Stack
                direction='row'
                spacing={2}
                sx={{ alignItems: 'center', marginTop: '10px' }}
              >
                <LoadingButton
                  loading={loadingUserSettings}
                  variant='contained'
                  color='success'
                  type='submit'
                  endIcon={<CheckIcon />}
                  onClick={() => updateUserSettings()}
                >
                  Да
                </LoadingButton>
                <Button
                  variant='outlined'
                  color='error'
                  onClick={() => {
                    setConfirmModalOpen(false);
                  }}
                  endIcon={<ClearIcon />}
                >
                  Нет
                </Button>
              </Stack>
            }
            icon={undefined}
          />
          {user?.privateData?.telegramUser && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant='body1'
                  sx={{ width: '200px', fontWeight: 'bold' }}
                >
                  {`@${user?.privateData?.telegramUser}`}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Stack
                  direction='row'
                  spacing={2}
                  sx={{ alignItems: 'center' }}
                  divider={<Divider orientation='vertical' flexItem />}
                >
                  <Typography variant='body1' sx={{ width: '200px' }}>
                    Уведомления
                  </Typography>
                  <Switch
                    checked={isNotificationOn}
                    onChange={toggleNotifications}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                </Stack>
              </Grid>
            </>
          )}
          <Grid item xs={12}>
            <Stack
              direction='row'
              spacing={2}
              sx={{ alignItems: 'center' }}
              divider={<Divider orientation='vertical' flexItem />}
            >
              <Typography variant='body1' sx={{ width: '200px' }}>
                Привязать {user?.privateData?.telegramUser && 'другой'} аккаунт
              </Typography>
              <Button
                onClick={() => {
                  dispatch(profileActions.toggleTgCollapse());
                }}
              >
                <TelegramIcon />
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Collapse in={tgCollapse}>
              <Grid
                container
                spacing={2}
                direction='column'
                sx={{ textAlign: 'left', marginTop: '5px' }}
              >
                <Grid item xs={12}>
                  <Typography
                    variant='body1'
                    gutterBottom
                    sx={{ textAlign: 'left' }}
                  >
                    Для привязки аккаунта, введите Имя пользователя tg и
                    напишите любое сообщение нашему чат боту.
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <TextField
                      variant='outlined'
                      label='Имя пользователя'
                      value={tgUserName}
                      type='text'
                      onChange={(e) => {
                        setIsTgError(false);
                        dispatch(profileActions.setTgName(e.target.value));
                      }}
                      id='enteredTgName'
                      required
                      helperText={choseTgNameTextHelper()}
                      className={tgUserName && classes.valid}
                      error={isTgError}
                      onFocus={() => {
                        dispatch(
                          profileActions.setTgName(
                            `${tgUserName?.length > 0 ? tgUserName : '@'}`,
                          ),
                        );
                      }}
                      inputProps={{
                        inputMode: 'text',
                        pattern: tgName.inputPropsPattern,
                        title: tgName.errorPatternTitle,
                      }}
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
                    >
                      Сохранить
                    </LoadingButton>
                  </Stack>
                </Grid>
              </Grid>
            </Collapse>
          </Grid>
        </Grid>
      )}
    </form>
  );
}
export default TelegramProfile;
