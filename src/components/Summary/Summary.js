import { useMemo, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Grid } from '@mui/material';
import { useGetUsers, useGetTransactions } from '../../queries';
import { auth } from '../../services/firebase';

function createData(name, valueGain, valueLost, total, price) {
  return {
    name,
    valueGain,
    valueLost,
    total,
    price,
    history: [
      {
        date: '2020-01-05',
        customerId: 'антон педик',
        amount: 3,
      },
      {
        date: '2020-01-02',
        customerId: 'Anonymous',
        amount: 1,
      },
    ],
  };
}
function Row(props) {
  const { row } = props;
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label='expand row'
            size='small'
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component='th' scope='row'>
          {row.name}
        </TableCell>
        <TableCell align='right'>
          <Grid item xs={1} md={1} lg={1}>
            {row.valueGain}
          </Grid>
        </TableCell>
        <TableCell align='right'>{row.valueLost}</TableCell>
        <TableCell align='right'>{row.total}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant='h6' gutterBottom component='div'>
                History
              </Typography>
              <Table size='small' aria-label='purchases'>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell align='right'>Amount</TableCell>
                    <TableCell align='right'>Total price ($)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map((historyRow) => (
                    <TableRow key={historyRow.date}>
                      <TableCell component='th' scope='row'>
                        {historyRow.date}
                      </TableCell>
                      <TableCell>{historyRow.customerId}</TableCell>
                      <TableCell align='right'>{historyRow.amount}</TableCell>
                      <TableCell align='right'>
                        {Math.round(historyRow.amount * row.price * 100) / 100}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

function Summary() {
  const currentUserId = auth.currentUser.uid;
  const { data: users } = useGetUsers();
  const { data: transactions } = useGetTransactions();
  const [summaryData, setSummaryData] = useState([]);
  // const userNames = users.map((user) => {
  //   return user.name;
  // });
  const approvedTransactions = useMemo(() => {
    return transactions.filter(
      (transaction) => transaction.status === 'APPROVED',
    );
  }, [transactions]);

  useEffect(() => {
    if (users.length === 0 || approvedTransactions.length === 0) return;

    const currencies = {};
    approvedTransactions.forEach((transaction) => {
      currencies[transaction.currency] = 0;
    });
    const updatedSummaryData = users.map((user) => ({
      userId: user.id,
      name: user.name,
      total: currencies,
      totalOutcoming: currencies,
      totalIncoming: currencies,
    }));
    approvedTransactions.forEach((transaction) => {
      const senderIndex = updatedSummaryData.findIndex(
        (user) => user.userId === transaction.sender,
      );
      const receiverIndex = updatedSummaryData.findIndex(
        (user) => user.userId === transaction.receiver,
      );
      updatedSummaryData[receiverIndex] = {
        ...updatedSummaryData[receiverIndex],
        totalOutcoming: {
          ...updatedSummaryData[receiverIndex].totalOutcoming,
          [transaction.currency]: (updatedSummaryData[
            receiverIndex
          ].totalOutcoming[transaction.currency] += transaction.amount),
        },
        total: {
          ...updatedSummaryData[receiverIndex].total,
          [transaction.currency]: (updatedSummaryData[receiverIndex].total[
            transaction.currency
          ] -= transaction.amount),
        },
      };
      updatedSummaryData[senderIndex] = {
        ...updatedSummaryData[senderIndex],
        totalIncoming: {
          ...updatedSummaryData[senderIndex].totalIncoming,
          [transaction.currency]: (updatedSummaryData[
            senderIndex
          ].totalIncoming[transaction.currency] += transaction.amount),
        },
        total: {
          ...updatedSummaryData[senderIndex].total,
          [transaction.currency]: (updatedSummaryData[senderIndex].total[
            transaction.currency
          ] += transaction.amount),
        },
      };
    });
    const filteredSummaryData = updatedSummaryData.filter(
      (data) => data.userId !== currentUserId,
    );
    setSummaryData(filteredSummaryData);
  }, [users, approvedTransactions]);
  const rows = summaryData.map((userSumamryData) => {
    const displayTotalIncomeData = (totalSummaryData) => {
      const totalOutput = [];
      Object.entries(totalSummaryData).forEach((entry) => {
        const [key, value] = entry;
        totalOutput.push(key, ': ', value, ' ');
      });
      return totalOutput;
    };
    return createData(
      userSumamryData.name,
      displayTotalIncomeData(userSumamryData.totalIncoming),
      displayTotalIncomeData(userSumamryData.totalOutcoming),
      displayTotalIncomeData(userSumamryData.total),
      123,
    );
  });

  return (
    <TableContainer component={Paper}>
      <Table aria-label='collapsible table'>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Итоги по Транзакциям</TableCell>
            <TableCell align='right'>Я получу</TableCell>
            <TableCell align='right'>Я Должен</TableCell>
            <TableCell align='right'>Итоги</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row key={row.name} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default Summary;
