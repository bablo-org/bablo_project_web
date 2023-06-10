import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { RegistrationError } from '../models/enums/RegistrationError';
import { SnackbarSeverity } from '../models/enums/SnackbarSeverity';
import {
  FirebaseEmailAction,
  sendEmailVerificationLink,
  verifyEmail,
} from '../services/firebase';
import { useAppDispatch } from '../store/hooks';
import { showSnackbarMessage } from '../store/slices/snackbarMessage';
import { PATHES } from '.';
import { verifyEmail as verifyEmailAction } from '../store/slices/auth';
import { useRegisterUser } from '../queries/users';

function EmailConfirmation() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { mutateAsync: registerUser } = useRegisterUser();
  const [searchParams] = useSearchParams();

  const resendLinkHandler = async () => {
    try {
      await sendEmailVerificationLink();
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
      console.warn(error);
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
    <>
      <div>Check your email for verification link</div>
      <div>If you cannot find the email pease check spam folder</div>
      <div>Or you can try to resend the verification email</div>
      <button type='button' onClick={resendLinkHandler}>
        Resend link
      </button>
    </>
  );
}

export default EmailConfirmation;
