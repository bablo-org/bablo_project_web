export const choseUsersId = ({ sender, receiver }, users, currentUserId) => {
  const usersIds = Object.values(users).map((user) => user.id);
  const filteredUserId = (filteredUserIdedId) => {
    return usersIds.filter((id) => id !== filteredUserIdedId);
  };

  let newSender = [];
  let newReceiver = [];
  let newDisabledSender = [];
  let newDisabledReceiver = [];

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
