import { useMemo } from 'react';
import { Grid, Box } from '@mui/material';
import TransactionItem from './TransactionItem';
import classes from './TransactionsList.module.css';
import Spinner from '../Spinner/Spinner';
import { useGetTransactions, useGetUsers } from '../../queries';

function TransactionsList() {
  const { data: users } = useGetUsers();
  const { data: transactions, isLoading: isTransactionsLoading } =
    useGetTransactions();

  const formatUserName = (incomingId) => {
    const idToName = users.find((user) => user.id === incomingId)?.name;
    return idToName;
  };

  const transformedTransactions = useMemo(() => {
    const sortedTransactions = transactions.sort(
      (obj1, obj2) => new Date(obj2.date) - new Date(obj1.date),
    );
    return sortedTransactions.map((transaction) => (
      <Grid item xs={12} md={6} lg={4} key={transaction.id}>
        <TransactionItem
          id={transaction.id}
          sender={formatUserName(transaction.sender)}
          receiver={formatUserName(transaction.receiver)}
          currency={transaction.currency}
          amount={transaction.amount}
          description={transaction.description}
          date={transaction.date}
          status={transaction.status}
          created={transaction.created}
          updated={transaction.updated}
          senderId={transaction.sender}
          recieverId={transaction.receiver}
        />
      </Grid>
    ));
  }, [transactions]);

  if (isTransactionsLoading || users === undefined) {
    return <Spinner />;
  }
  if (!isTransactionsLoading && transactions.length === 0) {
    return <p className={classes.noTransactionsAvailable}>Суй ананас в жопу</p>;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        {transformedTransactions}
      </Grid>
    </Box>
  );
}

export default TransactionsList;
