import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Typography } from '@mui/material';
import TransactionsList from '../components/Transactions/TransactionsList';
import Spinner from '../components/Spinner/Spinner';
import { useGetTransactions } from '../queries';
import { TransactionStatus } from '../models/enums/TransactionStatus';
import { PATHES } from './index';

enum Pages {
  ACTUAL = 'ACTUAL',
  COMPLETED = 'COMPLETED',
  DECLINED = 'DECLINED',
}

function TransactionPage() {
  const location = useLocation();
  const currentPage = useMemo(() => {
    switch (location.pathname) {
      case `${PATHES.HISTORY_HOME.HOME}/${PATHES.HISTORY_HOME.HISTORY_DECLINED}`:
        return {
          queryParam: [TransactionStatus.DECLINED],
          page: Pages.DECLINED,
        };
      case `${PATHES.HISTORY_HOME.HOME}/${PATHES.HISTORY_HOME.HISTORY_COMPLETED}`:
        return {
          queryParam: [TransactionStatus.COMPLETED],
          page: Pages.COMPLETED,
        };
      case `${PATHES.HISTORY_HOME.HOME}/${PATHES.HISTORY_HOME.HISTORY_ACTUAL}`:
      default:
        return {
          queryParam: [TransactionStatus.APPROVED, TransactionStatus.PENDING],
          page: Pages.ACTUAL,
        };
    }
  }, [location]);

  const {
    data: transactions,
    isLoading: isTransactionsLoading,
    isRefetching: isTransactionsFetching,
  } = useGetTransactions(currentPage.queryParam);

  const sortedTransactions = useMemo(
    () => transactions?.sort((obj1, obj2) => obj2.date - obj1.date),
    [transactions],
  );

  const transactionsFilteredByStatus = (status: TransactionStatus) => {
    return (
      sortedTransactions?.filter(
        (transaction) => transaction.status === status,
      ) ?? []
    );
  };

  // display Spinner while loading
  if (isTransactionsFetching && transactions?.length === 0) {
    return <Spinner />;
  }

  // display Error if no transactions are available
  if ((!isTransactionsLoading && transactions?.length === 0) || !transactions) {
    return (
      <Typography fontSize={50} color='red' align='center'>
        Суй ананас в жопу
      </Typography>
    );
  }

  switch (currentPage.page) {
    case Pages.DECLINED:
    case Pages.COMPLETED:
      return (
        <TransactionsList
          transactions={transactions}
          wrapperBox={{
            title: ' ',
          }}
        />
      );

    case Pages.ACTUAL:
    default:
      return (
        <>
          <TransactionsList
            transactions={transactionsFilteredByStatus(
              TransactionStatus.PENDING,
            )}
            wrapperBox={{
              title: 'Ожидающие',
            }}
          />
          <TransactionsList
            transactions={transactionsFilteredByStatus(
              TransactionStatus.APPROVED,
            )}
            wrapperBox={{
              title: 'Подтвержденные',
            }}
          />
        </>
      );
  }
}

export default TransactionPage;
