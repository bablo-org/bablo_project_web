import UserAvatar from '../UserAvatar/UserAvatar';
import classes from './AvatarsList.module.css';

const AvatarsList = ({ name }) => {
  const dummyNames = [`Пахан`, `Арсен`, `Дрюс`, `Тоха-Лепеха`, `Мишустин`];
  const nameList = dummyNames.map((name) => <UserAvatar name={name} />);

  return <div className={classes.avatarsContainer}>{nameList}</div>;
};

export default AvatarsList;
