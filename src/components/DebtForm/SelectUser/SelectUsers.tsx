import { Divider, Grid, Stack, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import AvatarsList from '../../AvatarsList/AvatarsList';
import { choseUsersId } from './choseUsersId';
import User from '../../../models/User';
import { setSelectedUsers } from '../../../store/slices/addTransactionForm';

interface SelectedUsersProps {
  users: User[] | undefined;
  isUsersLoading: boolean;
  isUserLoadingError: boolean;
}

function SelectUsers({
  users,
  isUsersLoading,
  isUserLoadingError,
}: SelectedUsersProps) {
  const { sender, disabledSender, receiver, disabledReceiver } = useAppSelector(
    (state) => state.addTransactionForm,
  );
  const currentUserId = useAppSelector((state) => state.auth.user?.uid);

  const dispatch = useAppDispatch();
  const toggleSelectedId = (id: string, isSender: boolean) => {
    let selectedUserIds = isSender ? [...sender] : [...receiver];

    // toggle selected Users
    if (selectedUserIds.includes(id)) {
      selectedUserIds = selectedUserIds.filter((item) => item !== id);
    } else if (id === currentUserId || !isSender) {
      selectedUserIds = [id];
    } else {
      selectedUserIds.push(id);
    }

    // check for toggle between sender and receiver as current user
    let secondUserIds = isSender ? [...receiver] : [...sender];
    if (
      currentUserId &&
      selectedUserIds.includes(currentUserId) &&
      secondUserIds.includes(currentUserId)
    ) {
      secondUserIds = [];
    }

    // hide reciever then sender toogle to unselected
    if (isSender && selectedUserIds.length === 0) {
      secondUserIds = [];
    }

    const floatProps = isSender
      ? { sender: selectedUserIds, receiver: secondUserIds }
      : { sender: secondUserIds, receiver: selectedUserIds };

    const { newSender, newReceiver, newDisabledSender, newDisabledReceiver } =
      choseUsersId({ ...floatProps }, users, currentUserId);

    dispatch(
      setSelectedUsers({
        sender: newSender,
        receiver: newReceiver,
        disabledSender: newDisabledSender,
        disabledReceiver: newDisabledReceiver,
      }),
    );
  };

  return (
    <>
      <Grid item xs={12} sx={{ marginTop: '31px' }}>
        <Stack direction='column' spacing={2}>
          <Typography variant='h6' sx={{ textAlign: 'left' }}>
            Должник
          </Typography>
          <Divider />
          <AvatarsList
            users={users}
            loading={isUsersLoading}
            error={isUserLoadingError}
            selectedUserIds={sender}
            disabledUserIds={disabledSender}
            toggleSelectedId={(id: string) => toggleSelectedId(id, true)}
          />
        </Stack>
      </Grid>

      {(sender.length > 0 || receiver.length > 0) && (
        <Grid item xs={12}>
          <Stack direction='column' spacing={2}>
            <Typography variant='h6' sx={{ textAlign: 'left' }}>
              Получатель
            </Typography>
            <Divider />
            <AvatarsList
              users={users}
              loading={isUsersLoading}
              error={isUserLoadingError}
              selectedUserIds={receiver}
              disabledUserIds={disabledReceiver}
              toggleSelectedId={(id: string) => toggleSelectedId(id, false)}
            />
          </Stack>
        </Grid>
      )}
    </>
  );
}
export default SelectUsers;
