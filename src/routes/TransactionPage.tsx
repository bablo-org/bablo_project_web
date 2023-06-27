import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Typography } from '@mui/material';
import TransactionsList from '../components/Transactions/TransactionsList';
// import Spinner from '../components/Spinner/Spinner';
import ListSkeleton from '../components/Transactions/Skeletons/ListSkeleton';
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

  const transactionsFilteredByStatus = (status: TransactionStatus) => {
    return (
      transactions?.filter((transaction) => transaction.status === status) ?? []
    );
  };

  // display Skeleton while loading
  if (isTransactionsFetching && transactions?.length === 0) {
    return <ListSkeleton />;
  }

  // display Error if no transactions are available
  if ((!isTransactionsLoading && transactions?.length === 0) || !transactions) {
    return (
      <Typography fontSize={50} color='red' align='center'>
        Раньше здесь был ананас...
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
            showWithoutTitle: true,
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
