import { useState } from 'react';
import classes from './UserSquare.module.css';

const UserSquare = (props) => {
  const [isClicked, setIsClicked] = useState(false);

  return (
    <div
      className={classes.square}
      style={{ borderColor: isClicked ? 'white' : '#240370' }}
      onClick={() => setIsClicked((prevState) => !prevState)}
    >
      <div class={classes.content}>{props.children}</div>
    </div>
  );
};

export default UserSquare;
