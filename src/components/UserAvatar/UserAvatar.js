import classes from './UserAvatar.module.css';

const UserAvatar = ({name, id, onSelected, isActive, isDisabled}) => {
  const onAvatarClicked = () => {
    if (isActive) {
      onSelected();
    } else {
      onSelected(id)
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
      <div class={classes.content}>{name}</div>
    </div>
  );
};

export default UserAvatar;
