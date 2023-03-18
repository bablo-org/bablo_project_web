import { useState } from 'react';
import classes from './UserAvatar.module.css';

const UserAvatar = ({name}) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div
      className={classes.circle}
      style={{ borderColor: isActive ? 'white' : '#240370' }}
      onClick={() => setIsActive((prevState) => !prevState)}
    >
      <div class={classes.content}>{name}</div>
    </div>
  );
};

export default UserAvatar;
