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
  auth,
  signOut,
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
          message: 'Ссылка отправлена на твой emeil',
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
    if (auth === null) {
      navigate(PATHES.LOGIN);
      return;
    }
    try {
      setIsLoggingOut(true);
      await signOut(auth);
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

  const veryfyEmailHandler = async (oobCode: string) => {
    try {
      await registerUser();
      await verifyEmail(oobCode);
      dispatch(
        showSnackbarMessage({
          message: 'Email verified',
          severity: SnackbarSeverity.SUCCESS,
        }),
      );
      dispatch(verifyEmailAction());
      navigate(PATHES.ADD_TRANSACTION);
    } catch (error: any) {
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
              Проверь свой email, для подтверждения необходимо перейти по ссылке
              из письма
            </Typography>
            <Typography variant='body1' marginTop={2}>
              Если письмо не пришло, проверь папку спама
            </Typography>
            <Typography variant='body1'>
              Или попробуй отправить ссылку снова
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
