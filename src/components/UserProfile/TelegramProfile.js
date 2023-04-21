import { useState } from 'react';
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
  const { mutateAsync: putTgUsername, isLoading: loadingTgUsername } =
    useUpdateTgUserName();
  const { mutateAsync: putUserSettings, isLoading: loadingUserSettings } =
    useUpdateUserSettings();
  const [enteredTgName, setEnteredTgName] = useState('');
  const [isTgError, setIsTgError] = useState(false);
  const { tgName } = validationProps;
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [isNotificationOn, setIsNotificationOn] = useState(
    enableTgNotifications,
  );
  const [tgCollapseOff, setTgCollapseOff] = useState(false);

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

  const updateUserSettings = async () => {
    try {
      const settings = { enableTelegramNotifications: !isNotificationOn };
      await putUserSettings(settings);
      setIsNotificationOn(!isNotificationOn);
      setOpenSuccessModal(true);
    } catch {
      setOpenErrorModal(true);
    } finally {
      setConfirmModalOpen(false);
    }
  };

  return (
    <form onSubmit={updateTgUserName}>
      <Grid
        container
        spacing={2}
        direction='column'
        sx={{ textAlign: 'left', marginTop: '5px' }}
      >
        {confirmModalOpen && (
          <TransitionsModal
            isOpen={confirmModalOpen}
            title={
              isNotificationOn
                ? 'Выключить уведомления?'
                : 'Включить уведомления?'
            }
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
        )}
        {telegramUser && (
          <Grid item xs={12}>
            <Typography
              variant='body1'
              sx={{ width: '200px', fontWeight: 'bold' }}
            >
              {`@${telegramUser}`}
            </Typography>
          </Grid>
        )}
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
              onChange={() => setConfirmModalOpen(true)}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </Stack>
        </Grid>
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
          </Collapse>
        </Grid>
      </Grid>
    </form>
  );
}
export default TelegramProfile;
