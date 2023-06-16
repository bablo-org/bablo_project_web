import { Grid, Box, Typography, Divider } from '@mui/material';
import TransactionItem from './TransactionItem';
import BorderBox from '../UI/BorderBox';
import Transaction from '../../models/Transaction';

interface TransactionsListProps {
  transactions: Transaction[];
  wrapperBox?: {
    title: string;
  };
}

function TransactionsList({ transactions, wrapperBox }: TransactionsListProps) {
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
        <Typography
          marginBottom={2}
          variant='h6'
          gutterBottom
          component='div'
          align='left'
        >
          {wrapperBox.title}
          <Divider sx={{ marginTop: 1 }} />
        </Typography>
        {renderTransactions()}
      </>
    </BorderBox>
  ) : (
    renderTransactions()
  );
}

export default TransactionsList;
