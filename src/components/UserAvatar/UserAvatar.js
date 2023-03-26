import classes from './UserAvatar.module.css';

const UserAvatar = ({ name, id, onSelected, isActive, isDisabled, isBlock}) => {
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
        backgroundColor: (isDisabled || isBlock) && 'grey',
      }}
      onClick={!isBlock && onAvatarClicked}
    >
      <div className={classes.content}>{name}</div>
    </div>
  );
};

export default UserAvatar;
