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
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Check as CheckIcon, Clear as ClearIcon } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import dayjs, { Dayjs } from 'dayjs';
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
} from '../../store/slices/addTransactionForm';
import SelectUsers from './SelectUser/SelectUsers';
import { isAllManual, choseSumTextHelper } from './Utils';
import GroupTransaction from './GroupTransaction/GroupTransaction';

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

  const putTransaction = async () => {
    const debtData = sender.map((id) => {
      return {
        sender: id,
        receiver: receiver[0],
        currency: enteredCurrency?.id,
        amount: sender.length === 1 ? +enteredSum! : +enteredUsersSum[id],
        description: enteredDescription,
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

  const popularCurrencies = ['USD', 'EUR'];

  useEffect(() => {
    if (isAllManual(manualInputs, sender.length)) {
      dispatch(clearAllSumErrors({ clearManualInputs: false }));
    }
  }, [enteredSum]);

  useEffect(() => {
    if (!currentUser || !currencies) {
      return;
    }
    const options = currencies
      .map((obj) => {
        if (
          currentUser.privateData?.settings?.favoriteCurrencies?.includes(
            obj.id,
          )
        ) {
          return { ...obj, group: 'Избранные валюты' };
        }
        if (popularCurrencies.includes(obj.id)) {
          return { ...obj, group: 'Популярные валюты' };
        }
        return { ...obj, group: 'Остальные валюты' };
      })
      .sort((a, b) => {
        const groupOrder: { [key: string]: number } = {
          'Избранные валюты': 1,
          'Популярные валюты': 2,
          'Остальные валюты': 3,
        };
        return groupOrder[a.group] - groupOrder[b.group];
      });

    dispatch(setCurrenciesOptions(options));
  }, [currentUser, currencies]);

  return (
    <Container maxWidth='md'>
      <Grid container spacing={2} direction='column'>
        <SelectUsers
          users={users}
          isUsersLoading={isUsersLoading}
          isUserLoadingError={isUserLoadingError}
        />
        <Grid item xs={12}>
          <form onSubmit={submissionOfDebtHandler}>
            <Grid
              container
              spacing={2}
              direction='column'
              sx={{ marginTop: '15px' }}
            >
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
                    error={
                      !!(
                        (enteredSum &&
                          !validationProps.sum.testSum(enteredSum)) ||
                        !isEnteredSumValid
                      )
                    }
                    style={{ whiteSpace: 'pre-wrap' }}
                    className={enteredSum ? classes.valid : undefined}
                    required={sender.length < 2}
                  />
                </FormControl>
              </Grid>
              {sender.length > 1 && (
                <GroupTransaction
                  users={users}
                  shareSumHandler={shareSumHandler}
                />
              )}
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <TextField
                    variant='outlined'
                    label='Описание'
                    value={enteredDescription}
                    type='text'
                    id='description'
                    onChange={descriptionInputChangeHandler}
                    helperText={validationProps.description.title}
                    style={{ whiteSpace: 'pre-wrap' }}
                    className={enteredDescription && classes.valid}
                    required
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
  );
}

export default DebtForm;
