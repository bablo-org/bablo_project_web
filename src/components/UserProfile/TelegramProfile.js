import { useEffect, useState } from 'react';
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
import classes from './UserProfile.module.css';
import { validationProps } from '../../utils/validationForm';
import { useUpdateTgUserName, useUpdateUserSettings } from '../../queries';
import TransitionsModal from '../modal/modal';

function TelegramProfile({
  setOpenSuccessModal,
  setOpenErrorModal,
  enableTgNotifications,
  telegramUser,
}) {
  const { mutateAsync: putTgUserName, isLoading: loadingTgUsername } =
    useUpdateTgUserName();
  const { mutateAsync: putUserSettings, isLoading: loadingUserSettings } =
    useUpdateUserSettings();
  const [enteredTgName, setEnteredTgName] = useState('');
  const [isTgError, setIsTgError] = useState(false);
  const { tgName } = validationProps;
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [isNotificationOn, setIsNotificationOn] = useState(true);
  const [tgCollapseOff, setTgCollapseOff] = useState(false);

  const updateTg = async (Name) => {
    try {
      await putTgUserName(Name);
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
    if (enteredTgName.includes('@')) {
      updateTg(enteredTgName.slice(1));
    } else {
      updateTg(enteredTgName);
    }
  };

  const updateUserSettings = async () => {
    try {
      const settings = { enableTelegramNotifications: !isNotificationOn };
      await putUserSettings(settings);
      setOpenSuccessModal(true);
    } catch {
      setOpenErrorModal(true);
    } finally {
      setConfirmModalOpen(false);
    }
  };

  const toogleNotifications = () => {
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
    if (enteredTgName) {
      return undefined;
    }
    return tgName.title;
  };

  useEffect(() => {
    setIsNotificationOn(enableTgNotifications);
  }, [enableTgNotifications]);

  return (
    <form onSubmit={updateTgUserName}>
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
        />
        {telegramUser && (
          <>
            <Grid item xs={12}>
              <Typography
                variant='body1'
                sx={{ width: '200px', fontWeight: 'bold' }}
              >
                {`@${telegramUser}`}
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
                  onChange={toogleNotifications}
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
              Привязать {telegramUser && 'другой'} аккаунт
            </Typography>
            <Button
              onClick={() => {
                setTgCollapseOff(!tgCollapseOff);
              }}
            >
              <TelegramIcon />
            </Button>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Collapse in={tgCollapseOff}>
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
                    helperText={choseTgNameTextHelper()}
                    className={enteredTgName && classes.valid}
                    error={isTgError}
                    onFocus={() => setEnteredTgName('@')}
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
    </form>
  );
}
export default TelegramProfile;