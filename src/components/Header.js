import classes from './Header.module.css';
import { auth, signOut } from '../services/firebase';

const Header = ({onLogout}) => {
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
              onLogout();
            })
          }
        >
          Log out
        </button>
    </header>
  );
};

export default Header;
