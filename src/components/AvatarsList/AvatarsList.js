import { useCallback } from 'react';
import { Stack, Skeleton, Box } from '@mui/material';
import { auth } from '../../services/firebase';
import UserAvatar from '../UserAvatar/UserAvatar';
import { selectContractors } from './selectContractors';

function AvatarsList({
  users,
  loading,
  error,
  contractor,
  disabledUserIds,
  sender,
  receiver,
  isSender,
  setSender,
  setReceiver,
  setDisabledSender,
  setDisabledReceiver,
}) {
  const currentUserId = auth.currentUser.uid;
  const toggleSelectedId = (id) => {
    let currentContractor = [...contractor];

    // toggle selected Users
    if (currentContractor.includes(id)) {
      currentContractor = currentContractor.filter((item) => item !== id);
    } else if (id === currentUserId || !isSender) {
      currentContractor = [id];
    } else {
      currentContractor.push(id);
    }

    // check for toggle between sender and receiver as current user
    let secondContractor = isSender ? receiver : sender;
    if (
      currentContractor.includes(currentUserId) &&
      secondContractor.includes(currentUserId)
    ) {
      secondContractor = [];
    }

    const floatProps = isSender
      ? { sender: currentContractor, receiver: secondContractor }
      : { sender: secondContractor, receiver: currentContractor };
    selectContractors(
      { ...floatProps },
      setSender,
      setReceiver,
      setDisabledSender,
      setDisabledReceiver,
      users,
      currentUserId,
    );
  };

  const renderAvatar = useCallback(
    (user) => {
      return (
        <UserAvatar
          key={user.id}
          name={user.name}
          id={user.id}
          toggleSelectedId={toggleSelectedId}
          isActive={contractor.includes(user.id)}
          isDisabled={disabledUserIds.includes(user.id)}
          avatarUrl={user.avatar}
        />
      );
    },
    [contractor, users],
  );

  return (
    <Stack direction='row' justifyContent='center'>
      {loading
        ? Array.from(Array(5)).map((_, i) => {
            const key = i;
            return (
              <Box key={key}>
                <Skeleton
                  variant='rounded'
                  sx={{
                    width: { xs: 50, sm: 70, md: 100 },
                    height: { xs: 50, sm: 70, md: 100 },
                    marginLeft: { xs: 0.8, sm: 1.3, md: 4 },
                    marginRight: { xs: 0.8, sm: 1.3, md: 4 },
                  }}
                  animation='wave'
                />
              </Box>
            );
          })
        : users.map((user) => renderAvatar(user))}
      {error && <div>Дрюс что-то сломал.</div>}
    </Stack>
  );
}

export default AvatarsList;
