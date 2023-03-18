import classes from './UserAvatar.module.css';
// import { useState } from 'react';

const UserAvatar = ({name, id, onSelected, isActive, isDisabled}) => {
  // if (isActive) {
  //   isDisabled=true
  // }
  console.warn(isActive);
  return (
    <div
      className={classes.circle}
      style={{
        borderColor: isActive ? 'white' : '#240370',
        pointerEvents: isDisabled ? 'none' : 'all',
      }}
      onClick={() => onSelected(id, true)}
    >
      <div class={classes.content}>{name}</div>
    </div>
  );
};

export default UserAvatar;
