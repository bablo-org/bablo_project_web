import classes from './Header.module.css';
import { auth, signOut } from '../../services/firebase';
import { useContext } from 'react';
import { AuthContext } from '../../context/Auth';

const Header = () => {
  const authContext = useContext(AuthContext);
  return (
    <header className={classes.header}>
      <div className={classes.navDiv}>
        <button>Добавить залупу</button>
        <button>Вспомнить былое</button>
        <button>Итоги</button>
      </div>
      <button
          className={classes.logOutButton}
          onClick={() =>
            signOut(auth).then(() => {
              localStorage.removeItem('isAuth');
              authContext.setIsAuth(false);
              authContext.setUser(null);
            })
          }
        >
          Log out
        </button>
    </header>
  );
};

export default Header;
