import { Grid, Box, Typography, Divider, Button } from '@mui/material';
import { useMemo, useState } from 'react';
import TransactionItem from './TransactionItem';
import BorderBox from '../UI/BorderBox';
import Transaction from '../../models/Transaction';
import FilterCollapse from './FilterAndSort/FilterCollapse';
import SearchField from './FilterAndSort/FIlterFields/SearchField';
import { useGetUsers } from '../../queries';
import SortMenu from './FilterAndSort/SortFields/SortMenu';
import { auth } from '../../services/firebase';

interface TransactionsListProps {
  transactions: Transaction[];
  wrapperBox?: {
    title?: string;
    showWithoutTitle?: boolean;
  };
}

function TransactionsList({ transactions, wrapperBox }: TransactionsListProps) {
  const [checked, setChecked] = useState(false);
  const [searchString, setSearchString] = useState('');
  const [IncomingOutcoming, setIncomingOutcoming] = useState('');
  const { data: users } = useGetUsers();
  const currentUserId = auth?.currentUser?.uid;

  // const IncomingOutcomingFilteredTransactions = useMemo(() => {
  //   switch (IncomingOutcoming) {
  //     case IncomingOutcoming === 'Все':
  //       return transactions;
  //     case IncomingOutcoming === 'ВХОДЯЩИЕ':
  //       return transactions.filter(
  //         (transaction) => transaction.sender === currentUserId;
  //       );
  //     case IncomingOutcoming === 'ИСХОДЯЩИЕ':
  //       return transactions.filter(
  //         (transaction) => transaction.sender !== currentUserId;
  //       );
  //     default:
  //       return transactions;;
  //   }
  // }, [transactions, IncomingOutcoming]);
  const filteredTransactions = useMemo(() => {
    return transactions?.filter((transaction) => {
      return transaction.description
        .toLowerCase()
        .includes(searchString.toLowerCase());
    });
  }, [transactions, searchString, IncomingOutcoming]);

  const IncomingOutcomingFilteredTransactions = useMemo(() => {
    if (IncomingOutcoming === 'ALL') {
      return filteredTransactions;
    }
    if (IncomingOutcoming === 'INCOMING') {
      return filteredTransactions.filter((transaction) => {
        return transaction.sender === currentUserId;
      });
    }
    if (IncomingOutcoming === 'OUTCOMING') {
      return filteredTransactions.filter((transaction) => {
        return transaction.sender !== currentUserId;
      });
    }
    return filteredTransactions;
  }, [transactions, IncomingOutcoming, searchString]);

  const handleChange = () => {
    setChecked((prev) => !prev);
  };
  const renderTransactions = () => {
    if (filteredTransactions?.length === 0 && searchString) {
      return (
        <Typography padding={2}>
          Транзакций не найдено, попробуйте другое ключевое слово
        </Typography>
      );
    }

    return (
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          {IncomingOutcomingFilteredTransactions?.map((transaction) => (
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
                users={users}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  if (!transactions.length) {
    return null;
  }

  return wrapperBox?.title || wrapperBox?.showWithoutTitle ? (
    <BorderBox
      borderRadius={2}
      marginProp={4}
      style={{
        padding: 4,
      }}
    >
      <>
        <Box display='flex' flexDirection='row' justifyContent='space-between'>
          <Grid container>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography
                  marginBottom={2}
                  variant='h6'
                  gutterBottom
                  component='div'
                  align='left'
                >
                  {wrapperBox.title}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Grid
                container
                spacing={2}
                sx={{ justifyContent: { xs: 'left', md: 'right' } }}
              >
                <Grid item xs='auto'>
                  <Button
                    variant={checked ? 'contained' : 'outlined'}
                    size='medium'
                    onClick={handleChange}
                    sx={{
                      height: '41px',
                    }}
                  >
                    Фильтр
                  </Button>
                </Grid>
                <Grid item xs='auto'>
                  <SortMenu />
                </Grid>
                <Grid item xs='auto'>
                  <SearchField
                    searchString={searchString}
                    setSearchString={setSearchString}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
        <FilterCollapse
          setIncomingOutcoming={setIncomingOutcoming}
          checked={checked}
          users={users}
        />
        <Divider sx={{ marginTop: 1, marginBottom: 2 }} />
        {renderTransactions()}
      </>
    </BorderBox>
  ) : (
    renderTransactions()
  );
}

export default TransactionsList;
