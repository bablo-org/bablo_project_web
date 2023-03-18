import { useState } from 'react';
import UserAvatar from '../UserAvatar/UserAvatar';
import classes from './AvatarsList.module.css';

const AvatarsList = () => {
  const [selectedId, setSelectedId] = useState();

  const dummyNames = [
    {
      name: `Пахан`,
      id: `n1`,
    },
    {
      name: `Дрюс`,
      id: `n2`,
    },
    {
      name: `Тоха-Лепеха`,
      id: `n3`,
    },
    {
      name: `Мишустин`,
      id: `n4`,
    },
    {
      name: `Арсен`,
      id: `n5`,
    },
  ];

  const nameList = dummyNames.map((user) => (
    <UserAvatar
      name={user.name}
      id={user.id}
      onSelected={setSelectedId}
      isActive={selectedId === user.id}
      isDisabled={selectedId && selectedId !== user.id}
    />
  ));

  return <div className={classes.avatarsContainer}>{nameList}</div>;
};

export default AvatarsList;

