import { useEffect, useState } from "react";
import { auth } from "../../services/firebase";
import UserAvatar from "../UserAvatar/UserAvatar";
import classes from "./AvatarsList.module.css";
import Spinner from "../Spinner/Spinner";

const AvatarsList = ({
  onUserSelected,
  blockedUserIds,
  users,
  loading,
  error,
}) => {
  const currentUserId = auth.currentUser.uid;
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    onUserSelected(selectedIds);
  }, [selectedIds]);

  const addSelectedId = (id) => {
    setSelectedIds([...selectedIds, id]);
  };

  const removeSelectedId = (id) => {
    const index = selectedIds.indexOf(id);
    if (index === -1) return;
    const newSelectedIds = [...selectedIds];
    newSelectedIds.splice(index, 1);
    setSelectedIds(newSelectedIds);
  };
  const nameList = users.map((user) => (
    <UserAvatar
      key={user.id}
      name={user.name}
      id={user.id}
      addSelectedId={addSelectedId}
      removeSelectedId={removeSelectedId}
      isActive={selectedIds.indexOf(user.id) !== -1}
      isBlocked={
        (blockedUserIds &&
          (blockedUserIds.includes(currentUserId)
            ? user.id == currentUserId ||
              (selectedIds.length > 0 && user.id !== selectedIds[0])
            : user.id !== currentUserId)) ||
          (selectedIds.includes(currentUserId)
            ? user.id !== currentUserId
            : selectedIds.length > 0 && user.id == currentUserId)
      }
      avatarUrl={user.avatar}
    />
  ));

  return (
    <div className={classes.avatarsContainer}>
      {loading ? <Spinner /> : nameList}
      {error && <div>Дрюс что-то сломал.</div>}
    </div>
  );
};

export default AvatarsList;
