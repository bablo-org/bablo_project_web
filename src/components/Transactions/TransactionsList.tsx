import { useMemo } from 'react';
import { Grid, Box } from '@mui/material';
import { useLocation } from 'react-router-dom';
import TransactionItem from './TransactionItem';
import classes from './TransactionsList.module.css';
import Spinner from '../Spinner/Spinner';
import { useGetTransactions } from '../../queries';
import { TransactionStatus } from '../../models/enums/TransactionStatus';
import { PATHES } from '../../routes';

function TransactionsList() {
  const location = useLocation();

  const statuses = useMemo(() => {
    switch (location.pathname) {
      case `${PATHES.HISTORY_HOME.HOME}/${PATHES.HISTORY_HOME.HISTORY_DECLINED}`:
        return [TransactionStatus.DECLINED];
      case `${PATHES.HISTORY_HOME.HOME}/${PATHES.HISTORY_HOME.HISTORY_COMPLETED}`:
        return [TransactionStatus.COMPLETED];
      case `${PATHES.HISTORY_HOME.HOME}/${PATHES.HISTORY_HOME.HISTORY_ACTUAL}`:
      default:
        return [TransactionStatus.APPROVED, TransactionStatus.PENDING];
    }
  }, [location]);

  const {
    data: transactions,
    isLoading: isTransactionsLoading,
    isRefetching: isTransactionsFetching,
  } = useGetTransactions(statuses);

  const transformedTransactions = useMemo(() => {
    const sortedTransactions = transactions?.sort(
      (obj1, obj2) => obj2.date - obj1.date,
    );
    return sortedTransactions?.map((transaction) => (
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={transaction.id}>
        <TransactionItem
          id={transaction.id}
          currency={transaction.currency}
          amount={transaction.amount}
          description={transaction.description}
          date={transaction.date}
          status={transaction.status}
          senderId={transaction.sender}
          recieverId={transaction.receiver}
        />
      </Grid>
    ));
  }, [transactions]);

  if (isTransactionsFetching && transactions?.length === 0) {
    return <Spinner />;
  }
  if (!isTransactionsLoading && transactions?.length === 0) {
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
