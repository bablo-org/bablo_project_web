import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  TextField,
  FormControl,
  Box,
  Collapse,
  Switch,
  FormControlLabel,
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import LoadingButton from '@mui/lab/LoadingButton';
import { UserCredential } from 'firebase/auth';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  auth,
  sendEmailVerificationLink,
  signInWithEmailAndPassword,
  signUpWithEmailAndPassword,
} from '../../services/firebase';
import { PATHES } from '../../routes';
import classes from './LoginForm.module.css';
import Logo from '../../BabloLogo.png';
import { validationProps } from '../../utils/validationForm';
import { showSnackbarMessage } from '../../store/slices/snackbarMessage';
import { SnackbarSeverity } from '../../models/enums/SnackbarSeverity';
import { RegistrationError } from '../../models/enums/RegistrationError';

function InputForm() {
  const navigate = useNavigate();
  const [enteredEmail, setEnteredEmail] = useState<string>('');
  const [enteredPassword, setEnteredPassword] = useState<string>('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean | string>(false);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const errorMessage = useMemo(() => {
    switch (error) {
      case 'auth/invalid-email':
        return 'Неверный email адрес';
      case 'auth/user-disabled':
        return 'Пользователь заблокирован';
      case 'auth/user-not-found':
        return 'Пользователь не найдет';
      case 'auth/wrong-password':
        return 'Неверный пароль';
      default:
        return 'Ошибка авторизации';
    }
  }, [error]);
  const { email } = validationProps;
  const isEmailError = useMemo(
    () => !!(enteredEmail && email.testEmail(enteredEmail)),
    [enteredEmail],
  );
  const choseEmailTextHelper = () => {
    if (enteredEmail) {
      return undefined;
    }
    if (isEmailError) {
      return email.errorTitle;
    }
    return email.title;
  };

  const onLoginPress = (e: React.FormEvent<HTMLFormElement> | undefined) => {
    e?.preventDefault();
    if (!auth) {
      dispatch(
        showSnackbarMessage({
          severity: SnackbarSeverity.ERROR,
          message: 'Ошибка авторизации',
        }),
      );
      return;
    }
    setLoading(true);
    setError(false);
    signInWithEmailAndPassword(auth, enteredEmail, enteredPassword)
      .catch((err) => {
        setError(err.code);
        // console.error(err.code);
      })
      .finally(() => setLoading(false));
  };

  const createUserWithEmailAndPassword = (): Promise<UserCredential> => {
    const isEmailValid =
      !validationProps.email.testEmail(enteredEmail) && enteredEmail.length > 0;
    const isPasswordValid = enteredPassword.length >= 6;

    if (!isEmailValid) {
      throw new Error(RegistrationError.TYPED_INCORRECT_EMAIL);
    }
    if (!isPasswordValid) {
      throw new Error(RegistrationError.TYPED_INCORRECT_PASSWORD);
    }
    if (enteredPassword !== passwordConfirmation) {
      throw new Error(RegistrationError.PASSWORDS_DO_NOT_MATCH);
    }
    return signUpWithEmailAndPassword(enteredEmail, enteredPassword);
  };

  const sendVerificationEmail = async () => {
    try {
      await sendEmailVerificationLink();
    } catch (err: any) {
      throw new Error(RegistrationError.ERROR_WHILE_SENDING_VERIFICATION_EMAIL);
    }
  };

  const handleRegistration = async () => {
    try {
      if (!auth) {
        throw new Error(RegistrationError.INTERNAL_AUTH_ERROR);
      }
      setLoading(true);
      await createUserWithEmailAndPassword();
      await signInWithEmailAndPassword(auth, enteredEmail, enteredPassword);
      await sendVerificationEmail();
      navigate('/verify-email');
    } catch (err: any) {
      dispatch(
        showSnackbarMessage({
          message:
            err?.code || err?.message || RegistrationError.INTERNAL_AUTH_ERROR,
          severity: SnackbarSeverity.ERROR,
        }),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      if (!user.emailVerified) {
        navigate(PATHES.VERIFY_EMAIL);
        return;
      }
      navigate(PATHES.HOME_PAGE);
    }
  }, [user, navigate]);

  useEffect(() => {
    if (error) {
      dispatch(
        showSnackbarMessage({
          severity: SnackbarSeverity.ERROR,
          message: errorMessage,
        }),
      );
    }
  }, [error]);

  return (
    <Container
      sx={{
        backgroundColor: 'white',
        marginTop: '5%',
      }}
      maxWidth='sm'
    >
      <Box
        sx={{
          backgroundImage: `url(${Logo})`,
          backgroundSize: 'contain',
          width: { xs: 250, md: 250 },
          height: { xs: 250, md: 250 },
          margin: 'auto',
        }}
      />
      <Grid container spacing={2} direction='column'>
        <Grid item xs={12}>
          <form onSubmit={(e) => onLoginPress(e)}>
            <Grid container spacing={2} direction='column'>
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
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Collapse in={isNewUser} sx={{ paddingTop: 1 }}>
                  <FormControl fullWidth>
                    <TextField
                      label='Подтвердите пароль'
                      type='password'
                      id='password-confirmation'
                      value={passwordConfirmation}
                      onChange={(e) => setPasswordConfirmation(e.target.value)}
                      required={!!isNewUser}
                      InputLabelProps={{ shrink: true }}
                      className={enteredPassword && classes.valid}
                    />
                  </FormControl>
                </Collapse>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isNewUser}
                      onChange={() => setIsNewUser((p) => !p)}
                    />
                  }
                  label='Новый пользователь?'
                />
              </Grid>
              <Grid item xs={12}>
                <Collapse in={isNewUser}>
                  <LoadingButton
                    loading={loading}
                    variant='contained'
                    color='primary'
                    endIcon={<LoginIcon />}
                    size='large'
                    onClick={handleRegistration}
                  >
                    Зарегистрироваться
                  </LoadingButton>
                </Collapse>
                <Collapse in={!isNewUser}>
                  <LoadingButton
                    loading={loading}
                    variant='contained'
                    color='success'
                    type='submit'
                    endIcon={<LoginIcon />}
                    size='large'
                  >
                    Войти
                  </LoadingButton>
                </Collapse>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </Container>
  );
}

export default InputForm;
