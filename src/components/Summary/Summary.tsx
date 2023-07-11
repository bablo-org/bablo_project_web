import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Grid,
  Autocomplete,
  TextField,
  CircularProgress,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useMemo, useState, useEffect } from 'react';
import SummaryRow from './SummaryRow';
import SummarySkeleton from './Skeletons/SummarySkeleton';
import {
  useGetUsers,
  useGetTransactions,
  useGetCurrencies,
} from '../../queries';
import { auth } from '../../services/firebase';
import Transaction from '../../models/Transaction';
import { displayTotalIncomeData } from './utils/displayData';
import Overall from './Overall';
import Currency from '../../models/Currency';
import { roundSum } from '../DebtForm/Utils';
import { groupCurrencies } from '../../utils/groupCurrencies';
import BorderBox from '../UI/BorderBox';

interface GroupedCurrency extends Currency {
  group: string;
}

type HistoryData = {
  date: number;
  description: string;
  amount: number;
  currency: string;
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

export type OverallTotal = {
  [key: string]: number;
};

function createData(
  name: string,
  valueGain: string[],
  valueLost: string[],
  total: string[],
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
  const { t } = useTranslation();
  const currentUserId = auth?.currentUser?.uid;
  const { data: users } = useGetUsers();

  const defaulConvertertValue = {
    group: '',
    id: '',
    name: '',
    rate: 0,
    symbol: '',
    updated: 0,
  };

  const {
    data: transactions,
    isLoading: isTransactionsLoading,
    isRefetching: isTransactionsFetching,
  } = useGetTransactions();
  const [summaryData, setSummaryData] = useState<UserSummaryData[]>([]);
  const [enteredCurrency, setEnteredCurrency] =
    useState<GroupedCurrency | null>(defaulConvertertValue);
  const [currenciesOptions, setCurrenciesOptions] = useState<GroupedCurrency[]>(
    [],
  );
  const { data: currencies, isFetching: loadingCurrencies } =
    useGetCurrencies();

  const currentUser = useMemo(
    () => users?.find((u) => u.id === currentUserId),
    [users, currentUserId],
  );

  const approvedTransactions: Transaction[] = useMemo(() => {
    const userIds = users?.map((user) => user.id);
    return (
      transactions
        ?.filter((transaction) => {
          return (
            userIds?.includes(transaction.sender) &&
            userIds?.includes(transaction.receiver)
          );
        })
        .filter((transaction) => transaction.status === 'APPROVED') ?? []
    );
  }, [transactions]);

  const overallTotal: OverallTotal = useMemo(() => {
    const total: OverallTotal = {};
    summaryData.forEach((userSummary) => {
      Object.entries(userSummary.total).forEach((currencyArr) => {
        const [key, value] = currencyArr;
        if (total[key]) {
          total[key] += value;
        } else {
          total[key] = value;
        }
        total[key] = roundSum(total[key], 1);
      });
    });
    return total;
  }, [summaryData]);

  const updateSummaryData = () => {
    const summaryCurrencies: { [key: string]: number } = {};
    approvedTransactions?.forEach((transaction) => {
      summaryCurrencies[transaction.currency] = 0;
    });

    const updatedSummaryData: UserSummaryData[] =
      users?.map((user) => ({
        userId: user.id,
        name: user.name,
        total: { ...summaryCurrencies },
        totalOutcoming: { ...summaryCurrencies },
        totalIncoming: { ...summaryCurrencies },
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
          amount: 0,
          currency: '',
        };

        historyClone.description = `${transaction.description}`;

        historyClone.date = transaction.date;
        if (transaction.sender !== currentUserId) {
          historyClone.amount = transaction.amount;
        } else {
          historyClone.amount = -transaction.amount;
        }
        historyClone.currency = transaction.currency;
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
    return updatedSummaryData;
  };

  const convertSummaryDate = (data: UserSummaryData[]) => {
    if (!enteredCurrency || !currencies) {
      return [];
    }

    const convertedData = data.map((userData) => {
      const { total, totalIncoming, totalOutcoming, history } = userData;

      const convertedTotal: UserSummaryData['total'] = {};
      const convertedTotalIncoming: UserSummaryData['total'] = {};
      const convertedTotalOutcoming: UserSummaryData['total'] = {};

      const rate = (id: string) => {
        return currencies.find((item) => item.id === id)?.rate ?? 1;
      };

      const convert = (currenciesObj: { [key: string]: number }) => {
        let sum = 0;

        Object.keys(currenciesObj).forEach((id) => {
          if (id !== enteredCurrency?.id) {
            sum += (currenciesObj[id] / rate(id)) * enteredCurrency.rate;
          } else {
            sum += currenciesObj[id];
          }
        });

        return roundSum(sum, 1);
      };

      const convertedHistory = history.map((item) => {
        const convertedAmount =
          (item.amount / rate(item.currency)) * enteredCurrency.rate;
        return {
          ...item,
          amount: roundSum(convertedAmount, 1),
          currency: enteredCurrency.id,
        };
      });

      convertedTotal[enteredCurrency.id] = convert(total);
      convertedTotalIncoming[enteredCurrency.id] = convert(totalIncoming);
      convertedTotalOutcoming[enteredCurrency.id] = convert(totalOutcoming);

      return {
        ...userData,
        total: convertedTotal,
        totalIncoming: convertedTotalIncoming,
        totalOutcoming: convertedTotalOutcoming,
        history: convertedHistory,
      };
    });
    return convertedData;
  };

  const filteredSummaryData = useMemo(() => {
    if (users?.length === 0 || approvedTransactions?.length === 0) {
      return [];
    }
    return updateSummaryData().filter((data) => data.userId !== currentUserId);
  }, [users, approvedTransactions]);

  useEffect(() => {
    if (filteredSummaryData.length === 0) return;
    if (
      !enteredCurrency ||
      enteredCurrency.name === 'Все валюты' ||
      enteredCurrency.name === 'All currencies'
    ) {
      setSummaryData(filteredSummaryData);
    } else {
      setSummaryData(convertSummaryDate(filteredSummaryData));
    }
  }, [filteredSummaryData, enteredCurrency]);

  const rows = summaryData.map((userSummaryData) => {
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

  useEffect(() => {
    if (!currentUser || !currencies) {
      return;
    }
    const options = groupCurrencies(currencies, currentUser);
    options.unshift(defaulConvertertValue);

    setCurrenciesOptions(options);
  }, [currentUser, currencies]);

  if (isTransactionsFetching && transactions?.length === 0) {
    return <SummarySkeleton />;
  }

  if (approvedTransactions.length === 0 && !isTransactionsLoading) {
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
              {t('summaryPage.noApprovedTransactions')}
            </Typography>
          </BorderBox>
        </Grid>
      </Grid>
    );
  }

  return (
    <>
      <Typography variant='h6' gutterBottom component='div'>
        {t('summaryPage.pageHeader')}
      </Typography>
      <Autocomplete
        id='currencyAuto'
        value={enteredCurrency}
        options={currenciesOptions}
        onChange={(event, newValue) => {
          setEnteredCurrency(newValue);
        }}
        loading={loadingCurrencies}
        loadingText='Загрузка...'
        noOptionsText='Ничего не найдено'
        groupBy={(option) => option.group}
        getOptionLabel={(option) => {
          if (option.name === '') return '';
          const currencyName = `${option.id} - ${option.name}`;
          return currencyName;
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={t('summaryPage.currencyConverter.converterHeader')}
            helperText={t('summaryPage.currencyConverter.helperText')}
            required
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loadingCurrencies ? (
                    <CircularProgress color='inherit' size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
      <TableContainer component={Paper}>
        <Table aria-label='collapsible table'>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>{t('summaryPage.summaryTable.countRow')}</TableCell>
              <TableCell>{t('summaryPage.summaryTable.userRow')}</TableCell>
              <TableCell align='right'>
                {t('summaryPage.summaryTable.valueGainRow')}
              </TableCell>
              <TableCell align='right'>
                {t('summaryPage.summaryTable.valueLostRow')}
              </TableCell>
              <TableCell align='right'>
                {t('summaryPage.summaryTable.totalRow')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <SummaryRow key={row.name} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Overall totals={overallTotal} />
    </>
  );
}
export { HistoryData };
export default Summary;
