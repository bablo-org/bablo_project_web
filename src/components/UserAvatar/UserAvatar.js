import classes from './UserAvatar.module.css';

const UserAvatar = ({
  name,
  id,
  onSelected,
  isActive,
  isDisabled,
  isBlocked,
}) => {
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
      }}
      onClick={!isBlocked ? onAvatarClicked: null}
    >
      <div className={classes.content}>{name}</div>
    </div>
  );
};

export default UserAvatar;
