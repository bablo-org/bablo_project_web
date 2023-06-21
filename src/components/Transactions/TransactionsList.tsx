import { Grid, Box, Typography, Divider, Button } from '@mui/material';
import { useState } from 'react';
import TransactionItem from './TransactionItem';
import BorderBox from '../UI/BorderBox';
import Transaction from '../../models/Transaction';
import FilterAnim from './FilterAndSort/FilterCollapse';
import SearchField from './FilterAndSort/FIlterFields/SearchField';
import { useGetUsers } from '../../queries';
import SortMenu from './FilterAndSort/SortFields/SortMenu';

interface TransactionsListProps {
  transactions: Transaction[];
  wrapperBox?: {
    title: string;
  };
}

function TransactionsList({ transactions, wrapperBox }: TransactionsListProps) {
  const [checked, setChecked] = useState(false);
  const { data: users } = useGetUsers();

  const handleChange = () => {
    setChecked((prev) => !prev);
  };
  const renderTransactions = () => (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        {transactions.map((transaction) => (
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

  if (!transactions.length) {
    return null;
  }

  return wrapperBox?.title ? (
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
                  >
                    Фильтр
                  </Button>
                </Grid>
                <Grid item xs='auto'>
                  <SortMenu />
                </Grid>
                <Grid item xs='auto'>
                  <SearchField />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
        <FilterAnim checked={checked} users={users} />
        <Divider sx={{ marginTop: 1, marginBottom: 2 }} />
        {renderTransactions()}
      </>
    </BorderBox>
  ) : (
    renderTransactions()
  );
}

export default TransactionsList;
