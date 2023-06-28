import { Grid, Typography, Divider } from '@mui/material';
import { nanoid } from '@reduxjs/toolkit';
import { useAppSelector } from '../../store/hooks';
import User from '../../models/User';
import RenderTransactionItem from '../UI/RenderTransactionItem';

interface RenderPreviewProps {
  users: User[] | undefined;
  startIndex: number;
  quantity: number;
  gridSize: {
    xs: number;
    md: number;
  };
  currentUserId: string | undefined;
}
function RenderPreview({
  users,
  startIndex,
  quantity,
  gridSize,
  currentUserId,
}: RenderPreviewProps) {
  const {
    enteredUsersSum,
    enteredDate,
    perItemDescription,
    enteredDescription,
    enteredCurrency,
    sender,
    receiver,
    enteredSum,
    isAddPerItemDescription,
  } = useAppSelector((state) => state.addTransactionForm);

  if (!users || !currentUserId) {
    return null;
  }

  const renderedUsersId = sender.slice(startIndex, quantity + startIndex);
  const filterUsers = (usersId: string[]) => {
    return users.filter((user) => {
      return usersId.includes(user.id);
    });
  };
  const renderedUsers: User[] = [];

  const isRenderedUserCurrentUser = sender.includes(currentUserId);

  if (isRenderedUserCurrentUser) {
    renderedUsers.push(...filterUsers(receiver));
  } else {
    renderedUsers.push(...filterUsers(renderedUsersId));
  }

  const transactionSum = (user: User) => {
    const currency = enteredCurrency?.id ?? '';

    if (isRenderedUserCurrentUser && enteredSum) {
      return `-${enteredSum} ${currency}`;
    }
    if (sender.length === 1 && enteredSum) {
      return `+${enteredSum} ${currency}`;
    }
    if (enteredUsersSum[user.id] && enteredUsersSum[user.id]) {
      return `+${enteredUsersSum[user.id]} ${currency}`;
    }
    return undefined;
  };

  const chooseDescription = (user: User) => {
    if (isAddPerItemDescription && perItemDescription[user.id]) {
      const description = [...perItemDescription[user.id]];
      if (enteredDescription) {
        description.unshift(enteredDescription);
      }
      return description.map((line, index) => (
        <Typography
          variant='body1'
          sx={{ textIndent: index > 1 ? '20px' : '0px' }}
          key={nanoid()}
        >
          {line}
        </Typography>
      ));
    }
    return enteredDescription;
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant='h6' sx={{ textAlign: 'left' }}>
          Предпросмотр транзакций
        </Typography>
        <Divider />
      </Grid>
      {renderedUsers.map((user) => (
        <Grid item xs={gridSize.xs} md={gridSize.md} key={user.id}>
          <RenderTransactionItem
            avatarId={user.id}
            avatarUrl={user.avatar}
            userName={user.name}
            statusColor='orange'
            status='Pending'
            description={chooseDescription(user)}
            date={enteredDate}
            amountColor={isRenderedUserCurrentUser ? 'red' : 'green'}
            amount={transactionSum(user)}
            showButtonContainer={false}
          />
        </Grid>
      ))}
    </Grid>
  );
}

export default RenderPreview;
