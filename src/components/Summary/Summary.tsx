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
import Transaction from '../../models/Transaction';
import { formatNumber, isRoundingToZero } from '../../utils/NumberUtils';

type HistoryData = {
  date: number;
  description: string;
  amount: string | number;
};

type UserSummaryData = {
  userId: string;
  name: string;
  total: {
    [key: string]: number;
  };
  totalOutcoming: {
    [key: string]: number;
  };
  totalIncoming: {
    [key: string]: number;
  };
  history: HistoryData[];
};

function createData(
  name: string,
  valueGain: string,
  valueLost: string,
  total: string,
  history: HistoryData[],
) {
  return {
    name,
    valueGain,
    valueLost,
    total,
    history,
  };
}

function Summary() {
  const currentUserId = auth?.currentUser?.uid;
  const { data: users } = useGetUsers();
  const {
    data: transactions,
    isLoading: isTransactionsLoading,
    isRefetching: isTransactionsFetching,
  } = useGetTransactions();
  const [summaryData, setSummaryData] = useState<UserSummaryData[]>([]);
  const approvedTransactions: Transaction[] = useMemo(() => {
    return (
      transactions?.filter(
        (transaction) => transaction.status === 'APPROVED',
      ) ?? []
    );
  }, [transactions]);

  useEffect(() => {
    if (users?.length === 0 || approvedTransactions?.length === 0) return;

    const currencies: { [key: string]: number } = {};
    approvedTransactions?.forEach((transaction) => {
      currencies[transaction.currency] = 0;
    });

    const updatedSummaryData: UserSummaryData[] =
      users?.map((user) => ({
        userId: user.id,
        name: user.name,
        total: { ...currencies },
        totalOutcoming: { ...currencies },
        totalIncoming: { ...currencies },
        history: [],
      })) ?? [];
    approvedTransactions.forEach((transaction) => {
      const senderIndex = updatedSummaryData.findIndex(
        (user) => user.userId === transaction.sender,
      );
      const receiverIndex = updatedSummaryData.findIndex(
        (user) => user.userId === transaction.receiver,
      );
      const updateSummaryHistoryData = (index: number) => {
        const historyClone: HistoryData = {
          date: 0,
          description: '',
          amount: '',
        };

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

  const rows = summaryData.map((userSummaryData) => {
    const displayTotalIncomeData = (totalSummaryData: {
      [key: string]: number;
    }) => {
      const totalOutput = Object.entries(totalSummaryData)
        .filter((e) => !isRoundingToZero(e[1])) // skip zeros
        .map((e) => `${e[0]}: ${formatNumber(e[1])}`) // {'USD', 123456.789} => 'USD: 123 456,789'
        .join(' / ');
      return totalOutput || '-/-';
    };
    return createData(
      userSummaryData.name,
      displayTotalIncomeData(userSummaryData.totalIncoming),
      displayTotalIncomeData(userSummaryData.totalOutcoming),
      displayTotalIncomeData(userSummaryData.total),
      userSummaryData.history.sort((obj1: HistoryData, obj2: HistoryData) => {
        return obj2.date - obj1.date;
      }),
    );
  });

  if (isTransactionsFetching && transactions?.length === 0) {
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
    <>
      <Typography variant='h6' gutterBottom component='div'>
        Подтвержденные транзакции
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label='collapsible table'>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Кол-во</TableCell>
              <TableCell>Пользователь</TableCell>
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
    </>
  );
}
export { HistoryData };
export default Summary;
