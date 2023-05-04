import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { useMemo, useState, useEffect } from 'react';
import SummaryRow from './SummaryRow';
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

function Summary() {
  const currentUserId = auth.currentUser.uid;
  const { data: users } = useGetUsers();
  const { data: transactions } = useGetTransactions();
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
    }));
    approvedTransactions.forEach((transaction) => {
      const senderIndex = updatedSummaryData.findIndex(
        (user) => user.userId === transaction.sender,
      );
      const receiverIndex = updatedSummaryData.findIndex(
        (user) => user.userId === transaction.receiver,
      );
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
            <SummaryRow key={row.name} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default Summary;
