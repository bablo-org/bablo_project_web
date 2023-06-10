import { useState } from 'react';
import LoginForm from '../components/LoginForm/LoginForm';
import RegistrationForm from '../components/RegistrationForm/RegistrationForm';

function LoginPage() {
  const [isNewUser, setIsNewUser] = useState(false);

  return (
    <>
      {isNewUser ? <RegistrationForm /> : <LoginForm />}
      <button type='button' onClick={() => setIsNewUser(!isNewUser)}>
        {isNewUser ? 'Back to Login' : 'Create new account'}
      </button>
    </>
  );
}

export default LoginPage;
