import { useEffect, useMemo } from 'react';
import {
  TextField,
  FormControl,
  Container,
  Stack,
  Button,
  Grid,
  Autocomplete,
  CircularProgress,
  Typography,
  Divider,
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Check as CheckIcon, Clear as ClearIcon } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import dayjs, { Dayjs } from 'dayjs';
import { nanoid } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { validationProps } from '../../utils/validationForm';
import classes from './DebtForm.module.css';
import {
  useGetCurrencies,
  useGetUsers,
  usePostTransaction,
} from '../../queries';
import { showSnackbarMessage } from '../../store/slices/snackbarMessage';
import { SnackbarSeverity } from '../../models/enums/SnackbarSeverity';
import {
  clearAllSumErrors,
  clearForm,
  setEnteredCurrency,
  setEnteredDescription,
  setEnteredDate,
  setCurrenciesOptions,
  validateAndSetEnteredSum,
  setEnteredSumOnBlur,
  shareSum,
  toogleIsBillСalculation,
} from '../../store/slices/addTransactionForm';
import SelectUsers from './SelectUser/SelectUsers';
import { isAllManual, choseSumTextHelper } from './Utils';
import GroupTransaction from './GroupTransaction/GroupTransaction';
import { groupCurrencies } from '../../utils/groupCurrencies';
import ItemsList from './GroupTransaction/CheckItemsList';
import BorderBox from '../UI/BorderBox';
import TransactionCard from '../TransactionCard/TransactionCard';
import User from '../../models/User';
import { TransactionStatus } from '../../models/enums/TransactionStatus';

function DebtForm() {
  const {
    sender,
    receiver,
    enteredCurrency,
    enteredSum,
    isEnteredSumValid,
    enteredUsersSum,
    enteredDescription,
    enteredDate,
    currenciesOptions,
    sumRemainsError,
    manualInputs,
    isBillModeOn,
    isAddPerItemDescription,
    perItemDescription,
  } = useAppSelector((state) => state.addTransactionForm);

  const dispatch = useAppDispatch();

  const {
    data: users,
    isFetching: isUsersLoading,
    isError: isUserLoadingError,
  } = useGetUsers();
  const { data: currencies, isFetching: loadingCurrencies } =
    useGetCurrencies();
  const { mutateAsync: postTransactions, isLoading: isAddingNewTransaction } =
    usePostTransaction();
  const currentUserId = useAppSelector((state) => state.auth.user?.uid);

  const sumInputChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    dispatch(validateAndSetEnteredSum(event.target.value));
  };

  const sumInputBlurHandler = () => {
    dispatch(setEnteredSumOnBlur());
  };

  const descriptionInputChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    dispatch(setEnteredDescription(event.target.value));
  };

  const dateInputChangeHandler = (date: Dayjs | null) => {
    const newEnteredDate = date?.valueOf();
    dispatch(setEnteredDate(newEnteredDate));
  };

  const cancelingOfDebtHandler = () => {
    dispatch(clearForm());
  };

  const chooseDescription = (id: string) => {
    if (isAddPerItemDescription && perItemDescription[id]) {
      let description = perItemDescription[id];
      if (enteredDescription) {
        description = enteredDescription.concat(
          '\n',
          ...perItemDescription[id],
        );
      }
      return description.toString();
    }
    return enteredDescription;
  };

  const putTransaction = async () => {
    const chooseAmount = (id: string) => {
      if (!isBillModeOn && sender.length === 1) {
        return +enteredSum!;
      }
      return +enteredUsersSum[id];
    };

    const debtData = sender.map((id) => {
      return {
        sender: id,
        receiver: receiver[0],
        currency: enteredCurrency?.id,
        amount: chooseAmount(id),
        description: chooseDescription(id),
        date: enteredDate?.valueOf(),
      };
    });
    try {
      await postTransactions({ transactions: debtData });
      dispatch(
        showSnackbarMessage({
          severity: SnackbarSeverity.SUCCESS,
          message: 'Транзакция успешно добавлена',
        }),
      );
    } catch {
      dispatch(
        showSnackbarMessage({
          severity: SnackbarSeverity.ERROR,
          message: 'Что-то пошло не так... Попробуйте перезагрузить страницу.',
        }),
      );
    } finally {
      dispatch(clearForm());
    }
  };

  const submissionOfDebtHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (Object.keys(sumRemainsError).length > 0) {
      return;
    }
    if (sender.length === 0) {
      dispatch(
        showSnackbarMessage({
          severity: SnackbarSeverity.ERROR,
          message: 'Выберите "Должника',
        }),
      );
    } else if (receiver.length === 0) {
      dispatch(
        showSnackbarMessage({
          severity: SnackbarSeverity.ERROR,
          message: 'Выберите "Получателя',
        }),
      );
    } else {
      putTransaction();
    }
  };

  const shareSumHandler = () => {
    dispatch(shareSum());
  };

  const currentUser = useMemo(
    () => users?.find((u) => u.id === currentUserId),
    [users, currentUserId],
  );

  const toogleTransactionMethod = () => {
    dispatch(toogleIsBillСalculation());
  };

  const sumInputError = useMemo(() => {
    return (
      (enteredSum && !validationProps.sum.testSum(enteredSum)) ||
      !isEnteredSumValid
    );
  }, [enteredSum, isEnteredSumValid, validationProps.sum]);

  const transactionSum = (user: User) => {
    if (enteredSum && sender.length === 1) {
      return +enteredSum;
    }
    if (enteredUsersSum[user.id]) {
      return +enteredUsersSum[user.id];
    }
    return 0;
  };

  useEffect(() => {
    if (isAllManual(manualInputs, sender.length)) {
      dispatch(clearAllSumErrors({ clearManualInputs: false }));
    }
  }, [enteredSum]);

  useEffect(() => {
    if (!currentUser || !currencies) {
      return;
    }
    const options = groupCurrencies(currencies, currentUser);

    dispatch(setCurrenciesOptions(options));
  }, [currentUser, currencies]);

  return (
    <BorderBox
      borderRadius={2}
      marginProp={4}
      style={{
        padding: 4,
      }}
    >
      <Container maxWidth='md'>
        <Grid container spacing={2} direction='column'>
          <Grid item xs={12}>
            <Stack direction='row' spacing={2} sx={{ justifyContent: 'end' }}>
              <Button
                variant={!isBillModeOn ? 'contained' : 'outlined'}
                onClick={toogleTransactionMethod}
              >
                Расчет по участникам
              </Button>
              <Button
                variant={isBillModeOn ? 'contained' : 'outlined'}
                onClick={toogleTransactionMethod}
              >
                Расчет по чеку
              </Button>
            </Stack>
          </Grid>
          {!isBillModeOn && (
            <SelectUsers
              users={users}
              isUsersLoading={isUsersLoading}
              isUserLoadingError={isUserLoadingError}
            />
          )}
          <Grid item xs={12}>
            <form onSubmit={submissionOfDebtHandler}>
              <Grid
                container
                spacing={2}
                direction='column'
                sx={{ marginTop: '15px' }}
              >
                <Grid item xs={12}>
                  <Stack direction='column' spacing={2}>
                    <Typography variant='h6' sx={{ textAlign: 'left' }}>
                      Конструктор транзакций
                    </Typography>
                    <Divider />
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    id='currencyAuto'
                    value={enteredCurrency}
                    options={currenciesOptions}
                    onChange={(event, newValue) => {
                      dispatch(setEnteredCurrency(newValue));
                    }}
                    loading={loadingCurrencies}
                    loadingText='Загрузка...'
                    noOptionsText='Ничего не найдено'
                    groupBy={(option) => option.group}
                    getOptionLabel={(option) => {
                      const currencyName = `${option.id} - ${option.name}`;
                      return currencyName;
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label='Валюта'
                        helperText='Выберите валюту'
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
                    className={enteredCurrency ? classes.valid : undefined}
                  />
                </Grid>
                {isBillModeOn && (
                  <>
                    <Grid item xs={12}>
                      <Typography
                        variant='body1'
                        sx={{ textAlign: 'left', fontWeight: 'bold' }}
                      >
                        Позиции чека
                      </Typography>
                    </Grid>
                    <ItemsList users={users} currentUserId={currentUserId} />
                  </>
                )}
                {!isBillModeOn && (
                  <Grid item xs={12}>
                    <FormControl fullWidth required>
                      <TextField
                        variant='outlined'
                        label='Сумма'
                        value={enteredSum || ''}
                        type='text'
                        id='sum'
                        onChange={sumInputChangeHandler}
                        onBlur={sumInputBlurHandler}
                        inputProps={{
                          inputMode: 'numeric',
                          pattern: validationProps.sum.inputPropsPattern,
                          title: validationProps.sum.errorTitle,
                        }}
                        helperText={choseSumTextHelper(
                          sumRemainsError,
                          isEnteredSumValid,
                        )}
                        error={sumInputError}
                        style={{ whiteSpace: 'pre-wrap' }}
                        className={enteredSum ? classes.valid : undefined}
                        required={sender.length < 2}
                      />
                    </FormControl>
                  </Grid>
                )}
                {sender.length > 1 && !isBillModeOn && (
                  <GroupTransaction
                    users={users}
                    shareSumHandler={shareSumHandler}
                  />
                )}
                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <TextField
                      variant='outlined'
                      label={
                        isAddPerItemDescription ? 'Общее описание' : 'Описание'
                      }
                      value={enteredDescription}
                      type='text'
                      id='description'
                      onChange={descriptionInputChangeHandler}
                      helperText={validationProps.description.title}
                      style={{ whiteSpace: 'pre-wrap' }}
                      className={enteredDescription && classes.valid}
                      required={!isAddPerItemDescription}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item md={4} xs={12}>
                      <FormControl fullWidth>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            label='Дата'
                            value={enteredDate ? dayjs(enteredDate) : null}
                            onChange={dateInputChangeHandler}
                            disableFuture
                            closeOnSelect
                            className={enteredDate ? classes.valid : undefined}
                            slotProps={{
                              textField: {
                                required: true,
                                helperText: validationProps.date.title,
                              },
                            }}
                          />
                        </LocalizationProvider>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                {sender.length > 0 && users && (
                  <Grid item xs={12}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant='h6' sx={{ textAlign: 'left' }}>
                          Предпросмотр транзакций
                        </Typography>
                        <Divider />
                      </Grid>
                      {users
                        .filter((user) => sender.includes(user.id))
                        .map((user) => (
                          <Grid item xs={12} md={6} key={user.id}>
                            <TransactionCard
                              previewMode
                              transaction={{
                                id: nanoid(),
                                amount: transactionSum(user),
                                currency: enteredCurrency?.id || '',
                                created: Date.now(),
                                description: chooseDescription(user.id),
                                sender: user.id,
                                receiver: receiver[0],
                                date: enteredDate ?? Date.now(),
                                status: TransactionStatus.PENDING,
                                updated: Date.now(),
                              }}
                              users={users}
                            />
                          </Grid>
                        ))}
                    </Grid>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Stack direction='row' spacing={2}>
                    <Button
                      variant='outlined'
                      color='error'
                      onClick={cancelingOfDebtHandler}
                      endIcon={<ClearIcon />}
                    >
                      Отмена
                    </Button>
                    <LoadingButton
                      loading={isAddingNewTransaction}
                      variant='contained'
                      color='success'
                      type='submit'
                      endIcon={<CheckIcon />}
                    >
                      Отправить
                    </LoadingButton>
                  </Stack>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </Container>
    </BorderBox>
  );
}

export default DebtForm;
