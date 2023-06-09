import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { Box, FormControl, Grid, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import ReplayIcon from '@mui/icons-material/Replay';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import { RegistrationError } from '../models/enums/RegistrationError';
import { SnackbarSeverity } from '../models/enums/SnackbarSeverity';
import {
  FirebaseEmailAction,
  sendEmailVerificationLink,
  verifyEmail,
  logout,
  auth,
  signInWithEmailAndPassword,
} from '../services/firebase';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { showSnackbarMessage } from '../store/slices/snackbarMessage';
import { PATHES } from '.';
import { verifyEmail as verifyEmailAction } from '../store/slices/auth';
import { useRegisterUser } from '../queries/users';
import BorderBox from '../components/UI/BorderBox';
import Logo from '../BabloLogo.png';
import { validationProps } from '../utils/validationForm';
import classes from '../components/LoginForm/LoginForm.module.css';

function EmailConfirmation() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { mutateAsync: registerUser } = useRegisterUser();
  const [searchParams] = useSearchParams();
  const [loading, setIsLoading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [enteredEmail, setEnteredEmail] = useState<string>('');
  const [enteredPassword, setEnteredPassword] = useState<string>('');

  const { email } = validationProps;
  const isEmailError = useMemo(
    () => !!(enteredEmail && email.testEmail(enteredEmail)),
    [enteredEmail],
  );

  const modeQueryParam = searchParams.get('mode');
  const oobCodeQueryParam = searchParams.get('oobCode');

  const resendLinkHandler = async () => {
    try {
      setIsLoading(true);
      await sendEmailVerificationLink();
      dispatch(
        showSnackbarMessage({
          message: 'Ссылка отправлена на ваш emeil',
          severity: SnackbarSeverity.SUCCESS,
        }),
      );
    } catch (error: any) {
      dispatch(
        showSnackbarMessage({
          message:
            error?.code ||
            error?.message ||
            RegistrationError.INTERNAL_AUTH_ERROR,
          severity: SnackbarSeverity.ERROR,
        }),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const logoutHandler = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      navigate(PATHES.LOGIN);
    } catch (err: any) {
      dispatch(
        showSnackbarMessage({
          message:
            err?.code || err?.message || RegistrationError.INTERNAL_AUTH_ERROR,
          severity: SnackbarSeverity.ERROR,
        }),
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  const registerUserHandler = async () => {
    try {
      await registerUser();
    } catch (err: any) {
      if (err.message === '500') {
        console.log('User already exists');
      } else {
        throw err;
      }
    }
  };

  const choseEmailTextHelper = () => {
    if (enteredEmail) {
      return undefined;
    }
    if (isEmailError) {
      return email.errorTitle;
    }
    return email.title;
  };

  const finishRegistrationHandler = async () => {
    try {
      if (auth === null) return;
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, enteredEmail, enteredPassword);
      await registerUserHandler();
      await verifyEmail(oobCodeQueryParam!);
      dispatch(
        showSnackbarMessage({
          message: 'Email verified',
          severity: SnackbarSeverity.SUCCESS,
        }),
      );
      dispatch(verifyEmailAction());
      navigate(PATHES.ADD_TRANSACTION);
    } catch (err: any) {
      // will be dispatched on dev every time as useEffect called twice in strict mode
      console.log(err);
      dispatch(
        showSnackbarMessage({
          message: err?.code || err?.message || 'Email verification error',
          severity: SnackbarSeverity.ERROR,
        }),
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.emailVerified) {
      navigate(PATHES.ADD_TRANSACTION);
    }
  }, [user]);

  return (
    <Grid container justifyContent='center'>
      <Grid item xs={10} md={6}>
        <BorderBox
          borderRadius={2}
          marginProp={2}
          style={{
            padding: 4,
            margin: 4,
          }}
        >
          <>
            <Box
              sx={{
                backgroundImage: `url(${Logo})`,
                backgroundSize: 'contain',
                width: { xs: 250, md: 250 },
                height: { xs: 250, md: 250 },
                margin: 'auto',
              }}
            />
            {modeQueryParam === FirebaseEmailAction.VERIFY_EMAIL &&
            oobCodeQueryParam ? (
              <>
                <Typography variant='h5'>
                  Для завершения регистрации введите email и пароль
                </Typography>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <TextField
                      label='Почта'
                      type='email'
                      id='email'
                      value={enteredEmail}
                      onChange={(e) => setEnteredEmail(e.target.value)}
                      required
                      InputLabelProps={{ shrink: true }}
                      className={enteredEmail && classes.valid}
                      inputProps={{
                        inputMode: 'email',
                        pattern: email.inputPropsPattern,
                        title: email.errorTitle,
                      }}
                      helperText={choseEmailTextHelper()}
                      error={isEmailError}
                      sx={{
                        marginTop: 2,
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <TextField
                      label='Пароль'
                      type='password'
                      id='password'
                      value={enteredPassword}
                      onChange={(e) => setEnteredPassword(e.target.value)}
                      required
                      InputLabelProps={{ shrink: true }}
                      className={enteredPassword && classes.valid}
                      sx={{
                        marginTop: 2,
                      }}
                    />
                  </FormControl>
                  <LoadingButton
                    loading={loading}
                    variant='contained'
                    color='success'
                    onClick={finishRegistrationHandler}
                    endIcon={<LoginIcon />}
                    size='large'
                    sx={{ marginTop: 2, marginRight: 2 }}
                  >
                    Войти
                  </LoadingButton>
                </Grid>
              </>
            ) : (
              <>
                <Typography variant='h5'>Подтверждение email</Typography>
                <Typography variant='body1' marginTop={2}>
                  Проверьте ваш email, для подтверждения необходимо перейти по
                  ссылке
                </Typography>
                <Typography variant='body1' marginTop={2}>
                  Если не видите письмо, проверьте &quot;Спам&quot;
                </Typography>
                <Typography variant='body1'>
                  Или попробуйте отправить ссылку снова
                </Typography>
                <LoadingButton
                  loading={loading}
                  variant='contained'
                  color='success'
                  onClick={resendLinkHandler}
                  endIcon={<ReplayIcon />}
                  size='large'
                  sx={{ marginTop: 2, marginRight: 2 }}
                >
                  Отправить снова
                </LoadingButton>
                <LoadingButton
                  loading={isLoggingOut}
                  variant='contained'
                  color='primary'
                  onClick={logoutHandler}
                  endIcon={<LogoutIcon />}
                  size='large'
                  sx={{ marginTop: 2 }}
                >
                  Другой email
                </LoadingButton>
              </>
            )}
          </>
        </BorderBox>
      </Grid>
    </Grid>
  );
}

export default EmailConfirmation;
