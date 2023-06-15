import { useMemo } from 'react';
import { Grid, Box, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import TransactionItem from './TransactionItem';
import classes from './TransactionsList.module.css';
import Spinner from '../Spinner/Spinner';
import { useGetTransactions } from '../../queries';
import { TransactionStatus } from '../../models/enums/TransactionStatus';
import { PATHES } from '../../routes';
import BorderBox from '../UI/BorderBox';

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

  const sortedTransactions = transactions?.sort(
    (obj1, obj2) => obj2.date - obj1.date,
  );

  const transactionsFilteredByStatus = (status: string) => {
    return sortedTransactions?.filter(
      (transaction) => transaction.status === status,
    );
  };

  const approvedTransactions = useMemo(() => {
    return transactionsFilteredByStatus('APPROVED')?.map((transaction) => (
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

  const pendingTransactions = useMemo(() => {
    return transactionsFilteredByStatus('PENDING')?.map((transaction) => (
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

  const transformedTransactions = useMemo(() => {
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
  if (
    location.pathname !==
    `${PATHES.HISTORY_HOME.HOME}/${PATHES.HISTORY_HOME.HISTORY_ACTUAL}`
  ) {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          {transformedTransactions}
        </Grid>
      </Box>
    );
  }
  return (
    <>
      {pendingTransactions?.length !== 0 ? (
        <BorderBox
          borderRadius={2}
          marginProp={4}
          style={{
            padding: 1,
          }}
        >
          <>
            <Typography
              marginBottom={4}
              variant='h6'
              gutterBottom
              component='div'
              align='center'
            >
              Ожидающие
            </Typography>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2}>
                {pendingTransactions}
              </Grid>
            </Box>
          </>
        </BorderBox>
      ) : null}

      {approvedTransactions?.length !== 0 ? (
        <BorderBox
          borderRadius={2}
          marginProp={0}
          style={{
            padding: 1,
          }}
        >
          <>
            <Typography
              marginBottom={4}
              variant='h6'
              gutterBottom
              component='div'
              align='center'
            >
              Подтвержденнныe
            </Typography>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2}>
                {approvedTransactions}
              </Grid>
            </Box>
          </>
        </BorderBox>
      ) : null}
    </>
  );
}

export default TransactionsList;
