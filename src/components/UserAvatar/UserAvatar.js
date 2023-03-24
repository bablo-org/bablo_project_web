import classes from './UserAvatar.module.css';

const UserAvatar = ({ name, id, onSelected, isActive, isDisabled, avatarsName }) => {
  const onAvatarClicked = () => {
    if (isActive) {
      onSelected();
      avatarsName()
    } else {
      onSelected(id);
      avatarsName(name)
    }
  };

  return (
    <div
      className={classes.circle}
      style={{
        borderColor: isActive ? 'white' : '#240370',
        backgroundColor: isDisabled && 'grey',
      }}
      onClick={onAvatarClicked}
    >
      <div className={classes.content}>{name}</div>
    </div>
  );
};

export default UserAvatar;
