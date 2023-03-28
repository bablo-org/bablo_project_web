import classes from './Header.module.css';
import { auth, signOut } from '../../services/firebase';
import { useContext } from 'react';
import { AuthContext } from '../../context/Auth';
import { useNavigate } from 'react-router-dom';
import { PATHES } from '../../routes';

const Header = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <header className={classes.header}>
      <div className={classes.navDiv}>
        <button onClick={() => navigate(PATHES.ADD_TRANSACTION)}>Добавить транзакцию</button>
        <button onClick={() => navigate(PATHES.HISTORY)}>История</button>
        <button onClick={() => navigate(PATHES.SUMMARY)}>Итоги</button>
        <button onClick={() => navigate(PATHES.PROFILE)}>Профиль</button>
      </div>
      <button
          className={classes.logOutButton}
          onClick={() =>
            signOut(auth).then(() => {
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
