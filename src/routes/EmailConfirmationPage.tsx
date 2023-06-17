import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import ReplayIcon from '@mui/icons-material/Replay';
import LogoutIcon from '@mui/icons-material/Logout';
import { RegistrationError } from '../models/enums/RegistrationError';
import { SnackbarSeverity } from '../models/enums/SnackbarSeverity';
import {
  FirebaseEmailAction,
  sendEmailVerificationLink,
  verifyEmail,
  logout,
} from '../services/firebase';
import { useAppDispatch } from '../store/hooks';
import { showSnackbarMessage } from '../store/slices/snackbarMessage';
import { PATHES } from '.';
import { verifyEmail as verifyEmailAction } from '../store/slices/auth';
import { useRegisterUser } from '../queries/users';
import BorderBox from '../components/UI/BorderBox';
import Logo from '../BabloLogo.png';

function EmailConfirmation() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { mutateAsync: registerUser } = useRegisterUser();
  const [searchParams] = useSearchParams();
  const [loading, setIsLoading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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

  const veryfyEmailHandler = async (oobCode: string) => {
    try {
      await registerUserHandler();
      await verifyEmail(oobCode);
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
      dispatch(
        showSnackbarMessage({
          message: 'Email verification error',
          severity: SnackbarSeverity.ERROR,
        }),
      );
    }
  };

  useEffect(() => {
    const mode = searchParams.get('mode');
    const oobCode = searchParams.get('oobCode');
    if (mode === FirebaseEmailAction.VERIFY_EMAIL && oobCode) {
      veryfyEmailHandler(oobCode);
    }
  }, []);

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
        </BorderBox>
      </Grid>
    </Grid>
  );
}

export default EmailConfirmation;
