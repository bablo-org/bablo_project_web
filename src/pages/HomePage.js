import { Fragment } from 'react';
import Header from '../components/Header';
import UserAvatars from '../components/AvatarsList/UserAvatars';
import classes from '../components/Header.module.css';
const HomePage = ({ onLogout }) => {
  const dummyNames = [`Пахан`, `Арсен`, `Дрюс`, `Тоха-Лепеха`, `Мишустин`];
  const nameList = dummyNames.map((name) => <UserAvatars>{name}</UserAvatars>);

  return (
    <Fragment>
      <Header onLogout={onLogout} />
      <label className={classes.addDebtlabel}>Кто кому дает за щеку?</label>
      <div>
        <div className={classes.avatarsContainer}>{nameList}</div>
        <div className={classes.avatarsContainer}>{nameList}</div>
      </div>
    </Fragment>
  );
};

export default HomePage;
