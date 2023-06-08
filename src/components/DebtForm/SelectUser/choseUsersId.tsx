import User from '../../../models/User';

interface UserIdProps {
  sender: string[];
  receiver: string[];
}

export const choseUsersId = (
  { sender, receiver }: UserIdProps,
  users: User[] | undefined,
  currentUserId: string | undefined,
) => {
  let newSender: string[] = [];
  let newReceiver: string[] = [];
  let newDisabledSender: string[] = [];
  let newDisabledReceiver: string[] = [];

  if (!users || !currentUserId) {
    return { newSender, newReceiver, newDisabledSender, newDisabledReceiver };
  }
  const usersIds: string[] = Object.values(users).map((user) => user.id);
  const filteredUserId = (filteredUserIdedId: string) => {
    return usersIds.filter((id) => id !== filteredUserIdedId);
  };

  // Chose sender
  if (sender.length === 1 && sender.includes(currentUserId)) {
    // Chose curent user as sender
    newSender = [currentUserId];
    newDisabledReceiver = [currentUserId];
    newDisabledSender = filteredUserId(currentUserId);
  } else if (sender.length > 0 && sender.includes(currentUserId)) {
    // Chose another user as sender
    newSender = [sender[sender.length - 1]];
    newReceiver = [currentUserId];
    newDisabledSender = [currentUserId];
    newDisabledReceiver = filteredUserId(currentUserId);
  } else if (sender.length > 0) {
    // Chose several users as sender
    newSender = sender;
    newReceiver = [currentUserId];
    newDisabledSender = [currentUserId];
    newDisabledReceiver = filteredUserId(currentUserId);
  }

  // chose reciever
  if (receiver.includes(currentUserId)) {
    // chose curent user as reciever
    newReceiver = [currentUserId];
    newDisabledReceiver = filteredUserId(currentUserId);
    newDisabledSender = [currentUserId];
  } else if (
    receiver.length === 1 &&
    sender.length === 1 &&
    sender.includes(currentUserId)
  ) {
    // chose another user as receiver with current user as sender
    newReceiver = receiver;
    newDisabledReceiver = filteredUserId(receiver[0]);
  } else if (receiver.length > 0 && !sender.includes(currentUserId)) {
    // chose another user as receiver
    newReceiver = receiver;
    newSender = [currentUserId];
    newDisabledReceiver = filteredUserId(receiver[0]);
    newDisabledSender = filteredUserId(currentUserId);
  }

  return { newSender, newReceiver, newDisabledSender, newDisabledReceiver };
};
