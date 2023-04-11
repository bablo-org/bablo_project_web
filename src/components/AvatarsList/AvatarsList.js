import { useCallback, useEffect, useState } from "react";
import { auth } from "../../services/firebase";
import UserAvatar from "../UserAvatar/UserAvatar";
import Spinner from "../Spinner/Spinner";
import { Stack, Skeleton, Box } from "@mui/material";

const AvatarsList = ({
  onUserSelected,
  blockedUserIds,
  users,
  loading,
  error,
}) => {
  const currentUserId = auth.currentUser.uid;
  const [selectedIds, setSelectedIds] = useState([]);

  const toggleSelectedId = useCallback(
    (id) => {
      if (selectedIds.includes(id)) {
        setSelectedIds((p) => p.filter((item) => item !== id));
      } else {
        setSelectedIds([...selectedIds, id]);
      }
    },
    [selectedIds]
  );

  const isUserBlocked = useCallback(
    (userId) => {
      if (!blockedUserIds) return false;
      if (blockedUserIds.includes(currentUserId)) {
        if (
          userId === currentUserId ||
          (selectedIds.length > 0 && userId !== selectedIds[0])
        ) {
          return true;
        }
      } else {
        if (userId !== currentUserId) {
          return true;
        }
      }
      return false;
    },
    [blockedUserIds, currentUserId, selectedIds]
  );

  const isUserSelected = useCallback(
    (userId) => {
      let isSelected = false;
      if (selectedIds.includes(currentUserId)) {
        if (userId !== currentUserId) {
          isSelected = true;
        }
      } else {
        if (selectedIds.length > 0 && userId === currentUserId) {
          isSelected = true;
        }
      }
      return isSelected;
    },
    [currentUserId, selectedIds]
  );

  const renderAvatar = useCallback(
    (user) => {
      const isBlocked = isUserBlocked(user.id);
      const isSelected = isBlocked ? false : isUserSelected(user.id);
      return (
        <UserAvatar
          key={user.id}
          name={user.name}
          id={user.id}
          toggleSelectedId={toggleSelectedId}
          isActive={selectedIds.indexOf(user.id) !== -1}
          isBlocked={isBlocked || isSelected}
          avatarUrl={user.avatar}
        />
      );
    },
    [isUserBlocked, isUserSelected, selectedIds, toggleSelectedId]
  );

  useEffect(() => {
    onUserSelected(selectedIds);
  }, [selectedIds]);

  return (
    <Stack direction="row" justifyContent="center">
      {loading
        ? Array.from(Array(5)).map(() => (
            <Box>
              <Skeleton
                variant="rounded"
                sx={{
                  width: { xs: 50, sm: 70, md: 100 },
                  height: { xs: 50, sm: 70, md: 100 },
                  marginLeft: { xs: 0.8, sm: 1.3, md: 4 },
                  marginRight: { xs: 0.8, sm: 1.3, md: 4 },
                }}
                animation="wave"
              />
            </Box>
          ))
        : users.map((user) => renderAvatar(user))}
      {error && <div>Дрюс что-то сломал.</div>}
    </Stack>
  );
};

export default AvatarsList;
