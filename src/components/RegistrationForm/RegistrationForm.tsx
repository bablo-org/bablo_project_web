import { useState } from 'react';
import { UserCredential } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import {
  signUpWithEmailAndPassword,
  sendEmailVerificationLink,
} from '../../services/firebase';
import { validationProps } from '../../utils/validationForm';
import { useAppDispatch } from '../../store/hooks';
import { showSnackbarMessage } from '../../store/slices/snackbarMessage';
import { SnackbarSeverity } from '../../models/enums/SnackbarSeverity';
import { RegistrationError } from '../../models/enums/RegistrationError';

function RegistrationForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();

  const createUserWithEmailAndPassword = (): Promise<UserCredential> => {
    const isEmailValid =
      !validationProps.email.testEmail(email) && email.length > 0;
    const isPasswordValid = password.length >= 6;

    if (!isEmailValid) {
      throw new Error(RegistrationError.TYPED_INCORRECT_EMAIL);
    }
    if (!isPasswordValid) {
      throw new Error(RegistrationError.TYPED_INCORRECT_PASSWORD);
    }
    return signUpWithEmailAndPassword(email, password);
  };

  const sendVerificationEmail = async () => {
    try {
      await sendEmailVerificationLink();
    } catch (error) {
      throw new Error(RegistrationError.ERROR_WHILE_SENDING_VERIFICATION_EMAIL);
    }
  };

  const handleRegistration = async () => {
    try {
      await createUserWithEmailAndPassword();
      await sendVerificationEmail();
      navigate('/verify-email');
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
    }
  };

  return (
    <div>
      <input
        type='text'
        value={email}
        placeholder='Email'
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type='password'
        value={password}
        placeholder='Password'
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type='button' onClick={handleRegistration}>
        Sign Up
      </button>
    </div>
  );
}

export default RegistrationForm;
