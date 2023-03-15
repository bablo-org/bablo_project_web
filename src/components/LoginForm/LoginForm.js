import { useMemo, useState } from 'react';
import { auth, signInWithEmailAndPassword } from '../../services/firebase';
import Spinner from '../Spinner/Spinner';
import '../LoginForm/LoginForm.css';

const InputForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const errorMessage = useMemo(() => {
    switch (error) {
      case 'auth/invalid-email': 
        return ('Email address is not valid')
      case 'auth/user-disabled':
        return ('Email has been disabled')
      case 'auth/user-not-found': 
        return ('User not found')
      case 'auth/wrong-password': 
        return ('Password is invalid for the given email')
      default: 
        return ('Unknown error.')
    }
  }, [error]);



  const onLoginPress = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        localStorage.setItem('isAuth', 'true')
      })
      .catch((error) => setError(error.code))
      .finally(() => setLoading(false))
  }

  return (
    <form
      onSubmit={(e) => onLoginPress(e)}
    >
      <div className="form-control">
        <label>Почта</label>
        <input  
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Пароль</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="form-actions">
        {error ? <div className='error-text'>{errorMessage}</div> : null}
        {loading ? <Spinner/> : <button>Войти</button>}
      </div>
    </form>
  );
};

export default InputForm;
