import { Fragment } from 'react';
import Header from '../components/Header';
import UserSquare from '../components/UserSquare';
import classes from '../components/Header.module.css';
const HomePage = ({ onLogout }) => {
  const dummyNames = [`Пахан`, `Арсен`, `Дрюс`, `Тоха-Лепеха`, `Мишустин`];
  const nameList = dummyNames.map((name) => <UserSquare>{name}</UserSquare>);

  return (
    <Fragment>
      <Header onLogout={onLogout} />
      <label className={classes.label}>Кто кому дает за щеку?</label>
      <div>
        <div className={classes.firsDiv}>{nameList}</div>
        <div className={classes.secondDiv}>{nameList}</div>
      </div>
    </Fragment>
  );
};

export default HomePage;
