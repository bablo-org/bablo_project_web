import classes from './UserAvatar.module.css';

const UserAvatar = ({ name, id, addSelectedId, removeSelectedId, isActive, isBlocked, avatarUrl}) => {
  const onAvatarClicked = () => {
    if (isActive) {
      removeSelectedId(id);
    } else {
      addSelectedId(id);
    }
  };

  return (
    <div
      className={classes.circle}
      style={{
        borderColor: isActive ? 'white' : '#240370',
        backgroundColor: (isBlocked) && 'grey',
        backgroundImage: `url(${avatarUrl})`,
        opacity: (isBlocked) && '0.3',
        backgroundSize: 'cover'
      }}
      onClick={!isBlocked ? onAvatarClicked : undefined}
    >
      <div className={classes.content}>{name}</div>
    </div>
  );
};

export default UserAvatar;
