import { useState } from 'react';
import classes from './UserAvatars.module.css';

const UserAvatars = (props) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div
      className={classes.circle}
      style={{ borderColor: isActive ? 'white' : '#240370' }}
      onClick={() => setIsActive((prevState) => !prevState)}
    >
      <div class={classes.content}>{props.children}</div>
    </div>
  );
};

export default UserAvatars;
