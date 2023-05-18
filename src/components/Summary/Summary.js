import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Grid,
} from '@mui/material';
import { useMemo, useState, useEffect } from 'react';
import SummaryRow from './SummaryRow';
import Spinner from '../Spinner/Spinner';
import { useGetUsers, useGetTransactions } from '../../queries';
import { auth } from '../../services/firebase';

function createData(name, valueGain, valueLost, total, history) {
  return {
    name,
    valueGain,
    valueLost,
    total,
    history,
  };
}

function Summary() {
  const currentUserId = auth.currentUser.uid;
  const { data: users } = useGetUsers();
  const {
    data: transactions,
    isLoading: isTransactionsLoading,
    isRefetching: isTransactionsFetching,
  } = useGetTransactions();
  const [summaryData, setSummaryData] = useState([]);
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
      total: { ...currencies },
      totalOutcoming: { ...currencies },
      totalIncoming: { ...currencies },
      history: [],
    }));
    approvedTransactions.forEach((transaction) => {
      const senderIndex = updatedSummaryData.findIndex(
        (user) => user.userId === transaction.sender,
      );
      const receiverIndex = updatedSummaryData.findIndex(
        (user) => user.userId === transaction.receiver,
      );
      const updateSummaryHistoryData = (index) => {
        const historyClone = { date: '', description: '', amount: '' };

        historyClone.description = `${transaction.description}`;

        historyClone.date = transaction.date;
        if (transaction.sender !== currentUserId) {
          historyClone.amount = `+${transaction.amount} ${transaction.currency}`;
        } else {
          historyClone.amount = `-${transaction.amount} ${transaction.currency}`;
        }
        updatedSummaryData[index].history.push(historyClone);
      };
      updateSummaryHistoryData(senderIndex);
      updateSummaryHistoryData(receiverIndex);
      updatedSummaryData[receiverIndex].totalOutcoming[transaction.currency] +=
        transaction.amount;
      updatedSummaryData[receiverIndex].total[transaction.currency] -=
        transaction.amount;
      updatedSummaryData[senderIndex].totalIncoming[transaction.currency] +=
        transaction.amount;
      updatedSummaryData[senderIndex].total[transaction.currency] +=
        transaction.amount;
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
      userSumamryData.history.sort((obj1, obj2) => obj2.date - obj1.date),
    );
  });
  if (isTransactionsFetching && transactions.length === 0) {
    return <Spinner />;
  }
  if (approvedTransactions.length === 0 && !isTransactionsLoading) {
    return (
      <Grid container alignItems='center' justifyContent='center'>
        <Box
          sx={{
            border: 3,
            borderColor: '#0566',
            borderRadius: 15,
            height: 100,
            width: 400,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          Нет подтвержденных транзакций
          <Typography />
        </Box>
      </Grid>
    );
  }
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
            <SummaryRow key={row.name} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default Summary;