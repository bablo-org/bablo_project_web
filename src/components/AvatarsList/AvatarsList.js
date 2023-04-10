import { useEffect, useState } from "react";
import { auth } from "../../services/firebase";
import UserAvatar from "../UserAvatar/UserAvatar";
import Spinner from "../Spinner/Spinner";
import Stack from "@mui/material/Stack";

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

  const toggleSelectedId = (id) => {
    if (selectedIds.indexOf(id) !== -1) {
      const index = selectedIds.indexOf(id);
      if (index === -1) return;
      const newSelectedIds = [...selectedIds];
      newSelectedIds.splice(index, 1);
      setSelectedIds(newSelectedIds);
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const nameList = users.map((user) => (
    <UserAvatar
      key={user.id}
      name={user.name}
      id={user.id}
      toggleSelectedId={toggleSelectedId}
      isActive={selectedIds.indexOf(user.id) !== -1}
      isBlocked={
        (blockedUserIds &&
          (blockedUserIds.includes(currentUserId)
            ? user.id === currentUserId ||
              (selectedIds.length > 0 && user.id !== selectedIds[0])
            : user.id !== currentUserId)) ||
        (selectedIds.includes(currentUserId)
          ? user.id !== currentUserId
          : selectedIds.length > 0 && user.id === currentUserId)
      }
      avatarUrl={user.avatar}
    />
  ));

  return (
    <Stack direction="row" justifyContent="center">
      {loading ? <Spinner /> : nameList}
      {error && <div>Дрюс что-то сломал.</div>}
    </Stack>
  );
};

export default AvatarsList;
