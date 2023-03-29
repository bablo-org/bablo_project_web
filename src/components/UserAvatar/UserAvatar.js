import classes from './UserAvatar.module.css';

const UserAvatar = ({ name, id, onSelected, isActive, isDisabled, isBlocked, avatarUrl}) => {
  const onAvatarClicked = () => {
    if (isActive) {
      onSelected();
    } else {
      onSelected(id);
    }
  };

  return (
    <div
      className={classes.circle}
      style={{
        borderColor: isActive ? 'white' : '#240370',
        backgroundColor: (isDisabled || isBlocked) && 'grey',
        backgroundImage: `url(${avatarUrl})`,
        opacity: (isDisabled || isBlocked) && '0.3',
        backgroundSize: 'cover'
      }}
      onClick={!isBlocked ? onAvatarClicked : undefined}
    >
      <div className={classes.content}>{name}</div>
    </div>
  );
};

export default UserAvatar;
