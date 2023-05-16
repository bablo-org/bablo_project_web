import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  TextField,
  FormControl,
  FormHelperText,
  Box,
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import LoadingButton from '@mui/lab/LoadingButton';
import { useSelector } from 'react-redux';
import { auth, signInWithEmailAndPassword } from '../../services/firebase';
import { PATHES } from '../../routes';
import classes from './LoginForm.module.css';
import Logo from '../../BabloLogo.png';
import { validationProps } from '../../utils/validationForm';

function InputForm() {
  const navigate = useNavigate();
  const authContext = useSelector((state) => state.auth);
  const [enteredEmail, setEnteredEmail] = useState('');
  const [enteredPassword, setEnteredPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { user } = authContext;
  const errorMessage = useMemo(() => {
    switch (error) {
      case 'auth/invalid-email':
        return 'Email address is not valid';
      case 'auth/user-disabled':
        return 'Email has been disabled';
      case 'auth/user-not-found':
        return 'User not found';
      case 'auth/wrong-password':
        return 'Password is invalid for the given email';
      default:
        return 'Unknown error.';
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

  const onLoginPress = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    signInWithEmailAndPassword(auth, enteredEmail, enteredPassword)
      .catch((err) => setError(err.code))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (user) {
      navigate(PATHES.ADD_TRANSACTION);
    }
  }, [user, navigate]);

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
                <FormHelperText error={!!error}>
                  {error && errorMessage}
                </FormHelperText>
              </Grid>
              <Grid item xs={12}>
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
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </Container>
  );
}

export default InputForm;
