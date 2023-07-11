import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Grid, Typography } from '@mui/material';
import TransactionsList from '../components/Transactions/TransactionsList';
import TransactionsListSkeleton from '../components/Transactions/Skeletons/TransactionsListSkeleton';
import { useGetTransactions, useGetUsers } from '../queries';
import { TransactionStatus } from '../models/enums/TransactionStatus';
import { PATHES } from './index';
import BorderBox from '../components/UI/BorderBox';

enum Pages {
  ACTUAL = 'ACTUAL',
  COMPLETED = 'COMPLETED',
  DECLINED = 'DECLINED',
}

function TransactionPage() {
  const { t } = useTranslation();
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
  const { data: users, isFetching: isUsersFetching } = useGetUsers();

  const transactionsFilteredByStatus = (status: TransactionStatus) => {
    return (
      transactions?.filter((transaction) => transaction.status === status) ?? []
    );
  };

  // display Skeleton while loading
  if (
    (isTransactionsFetching && transactions?.length === 0) ||
    (isUsersFetching && users?.length === 0)
  ) {
    return <TransactionsListSkeleton />;
  }

  // display Error if no transactions are available
  // Раньше здесь был ананас...
  if (
    (!isTransactionsLoading && transactions?.length === 0) ||
    !transactions ||
    !users
  ) {
    return (
      <Grid container justifyContent='center'>
        <Grid item xs={12} sm={11} md={10} lg={9} xl={8}>
          <BorderBox
            marginProp={0}
            style={{
              border: 3,
              borderColor: '#0566',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 4,
            }}
          >
            <Typography fontWeight='bold' fontSize='large'>
              {t('transactionsPage.noTransactionsFound')}
            </Typography>
          </BorderBox>
        </Grid>
      </Grid>
    );
  }

  switch (currentPage.page) {
    case Pages.DECLINED:
    case Pages.COMPLETED:
      return (
        <TransactionsList
          transactions={transactions}
          users={users}
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
            users={users}
            wrapperBox={{
              title: t(
                'transactionsPage.transactionLayout.transactionStatusLabels.pending',
              ),
            }}
          />
          <TransactionsList
            transactions={transactionsFilteredByStatus(
              TransactionStatus.APPROVED,
            )}
            users={users}
            wrapperBox={{
              title: t(
                'transactionsPage.transactionLayout.transactionStatusLabels.approved',
              ),
            }}
          />
        </>
      );
  }
}

export default TransactionPage;
