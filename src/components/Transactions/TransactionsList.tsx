import { Grid, Box, Typography, Divider, Button } from '@mui/material';
import { useMemo, useState } from 'react';
import TransactionItem from './TransactionItem';
import BorderBox from '../UI/BorderBox';
import Transaction from '../../models/Transaction';
import FilterCollapse from './FilterAndSort/FilterCollapse';
import SearchField from './FilterAndSort/FIlterFields/SearchField';
import { useGetUsers, useGetCurrencies } from '../../queries';
import SortMenu from './FilterAndSort/SortFields/SortMenu';
import { auth } from '../../services/firebase';

export enum TransactionType {
  ALL = 'ALL',
  INCOMING = 'INCOMING',
  OUTCOMING = 'OUTCOMING',
}

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
  const [sortBySum, setSortBySum] = useState(false);
  const [sortByDate, setSortByDate] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<TransactionType>(
    TransactionType.ALL,
  );
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>('');
  const { data: users } = useGetUsers();
  const { data: currencies } = useGetCurrencies();
  console.log(currencies);
  const filteredTransactions = useMemo(() => {
    let sortedTransactions: Transaction[] = [...transactions];

    // firstly filter by type (incoming, outcoming, all)
    switch (selectedType) {
      case TransactionType.INCOMING:
        sortedTransactions = transactions.filter(
          (transaction) => transaction.sender === auth?.currentUser?.uid,
        );
        break;
      case TransactionType.OUTCOMING:
        sortedTransactions = transactions.filter(
          (transaction) => transaction.receiver === auth?.currentUser?.uid,
        );
        break;
      case TransactionType.ALL:
      default:
        sortedTransactions = transactions;
        break;
    }

    // then filter by currency
    if (selectedCurrency) {
      sortedTransactions = sortedTransactions.filter(
        (transaction) => transaction.currency === selectedCurrency,
      );
    }
    // then filter by users
    if (selectedUsers.length > 0) {
      sortedTransactions = sortedTransactions.filter((transaction) => {
        return (
          selectedUsers.includes(transaction.receiver) ||
          selectedUsers.includes(transaction.sender)
        );
      });
    }

    // then sort by date
    if (sortByDate) {
      sortedTransactions?.sort((obj1, obj2) => obj2.date - obj1.date);
    }
    if (!currencies) {
      return [];
    }
    // then sort by sum
    if (sortBySum) {
      sortedTransactions.sort((obj1, obj2) => {
        return (
          obj2.amount /
            currencies.find((currency) => currency.id === obj2.currency)!.rate -
          obj1.amount /
            currencies.find((currency) => currency.id === obj1.currency)!.rate
        );
      });
    }

    // then filter by search string
    return sortedTransactions.filter((transaction) => {
      return transaction.description
        .toLowerCase()
        .includes(searchString.toLowerCase());
    });
  }, [
    transactions,
    searchString,
    selectedType,
    auth,
    selectedCurrency,
    selectedUsers,
    sortByDate,
    sortBySum,
  ]);

  const handleChange = () => {
    setChecked((prev) => !prev);
  };
  const renderTransactions = () => {
    if (filteredTransactions.length === 0 && searchString) {
      return (
        <Typography padding={2}>
          Транзакций не найдено, попробуйте другое ключевое слово
        </Typography>
      );
    }

    return (
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          {filteredTransactions.map((transaction) => (
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
                  <SortMenu
                    setSortByDate={setSortByDate}
                    setSortBySum={setSortBySum}
                    sortByDate={sortByDate}
                    sortBySum={sortBySum}
                  />
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
          checked={checked}
          users={users}
          setTransactionType={setSelectedType}
          selectedTransactionType={selectedType}
          setSelectedCurrency={setSelectedCurrency}
          onChange={setSelectedUsers}
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
