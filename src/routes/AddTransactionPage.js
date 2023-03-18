import { Fragment } from 'react';
import UserAvatars from '../components/AvatarsList/UserAvatars';
import classes from '../components/Header/Header.module.css';

const AddTransactionPage = () => {
  const dummyNames = [`Пахан`, `Арсен`, `Дрюс`, `Тоха-Лепеха`, `Мишустин`];
  const nameList = dummyNames.map((name) => <UserAvatars>{name}</UserAvatars>);

  return (
    <Fragment>
      <label className={classes.addDebtlabel}>Кто кому дает за щеку?</label>
      <div>
        <div className={classes.avatarsContainer}>{nameList}</div>
        <div className={classes.avatarsContainer}>{nameList}</div>
      </div>
    </Fragment>
  );
};

export default AddTransactionPage;
