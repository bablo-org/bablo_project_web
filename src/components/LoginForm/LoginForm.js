import { useState } from 'react';
import { auth, signInWithEmailAndPassword } from '../../services/firebase';
import '../LoginForm/LoginForm.css';

const InputForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onLoginPress = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
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
        <button>Войти</button>
      </div>
    </form>
  );
};

export default InputForm;
