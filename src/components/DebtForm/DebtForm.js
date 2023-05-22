import { useState, useEffect, useMemo } from 'react';
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
import {
  Check as CheckIcon,
  Clear as ClearIcon,
  SafetyDivider as SafetyDividerIcon,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { useDispatch } from 'react-redux';
import { auth } from '../../services/firebase';
import { validationProps } from '../../utils/validationForm';
import AvatarsList from '../AvatarsList/AvatarsList';
import classes from './DebtForm.module.css';
import {
  useGetCurrencies,
  useGetUsers,
  usePostTransaction,
} from '../../queries';
import { showSnackbarMessage } from '../../store/slices/snackbarMessage';

function DebtForm() {
  const [sender, setSender] = useState([]);
  const [disabledSender, setDisabledSender] = useState([]);
  const [isSenderSelected, setIsSenderSelected] = useState(true);
  const [receiver, setReceiver] = useState([]);
  const [disabledReceiver, setDisabledReceiver] = useState([]);
  const [isReceiverSelected, setIsReceiverSelected] = useState(true);
  const [enteredCurrency, setEnteredCurrency] = useState(null);
  const [enteredSum, setEnteredSum] = useState('');
  const [enteredUsersSum, setEnteredUsersSum] = useState({});
  const [enteredDescription, setEnteredDescription] = useState('');
  const [enteredDate, setEnteredDate] = useState(null);
  const [currenciesOptions, setCurrenciesOptions] = useState([]);
  const [sumRemainsError, setSumRemainsError] = useState({});
  const [sumError, setSumError] = useState({});
  const [manualInputs, setManualInputs] = useState([]);
  const dispatch = useDispatch();

  const {
    data: users,
    isFetching: isUsersLoading,
    isError: isUserLoadingError,
  } = useGetUsers();
  const { data: currencies, isFetching: loadingCurrencies } =
    useGetCurrencies();
  const { mutateAsync: postTransactions, isLoading: isAddingNewTransaction } =
    usePostTransaction();

  const sumInputChangeHandler = (event) => {
    setEnteredSum(event.target.value);
    setManualInputs([]);
    setEnteredUsersSum({});
    setSumError(false);
    setSumRemainsError(false);
  };

  const isSumValid = (sum) => {
    return validationProps.sum.testSum(sum);
  };

  const choseSumTextHelper = (sum, userId) => {
    if (sumRemainsError[userId]) {
      return validationProps.sum.errorRemainsTitle;
    }
    if (!isSumValid(sum) && sum) {
      return validationProps.sum.errorTitle;
    }
    if (sumError[userId]) {
      return validationProps.sum.errorRemainsSumTitle;
    }
    return validationProps.sum.title;
  };

  const roundSum = (sum, amount) => {
    return Math.round((sum / amount) * 100) / 100;
  };

  const isAllManual = (inputs) => {
    return inputs.length === sender.length;
  };

  const usersSumInputChangeHandler = (event, user) => {
    setSumRemainsError(false);
    setSumError(false);
    const newUsersSum = { ...enteredUsersSum };
    const newSumError = { ...sumError };
    const newManualInputs = [...manualInputs];
    newUsersSum[user.id] = event.target.value;
    newSumError[user.id] = true;

    if (!manualInputs.includes(user.id) && enteredSum) {
      newManualInputs.push(user.id);
      setManualInputs(newManualInputs);
    }

    if (!isSumValid(event.target.value)) {
      setSumError(newSumError);
      setEnteredUsersSum(newUsersSum);
      return;
    }

    if (
      enteredSum &&
      +event.target.value > +enteredSum &&
      !isAllManual(newManualInputs)
    ) {
      const newSumRemainsError = { ...sumRemainsError };
      newSumRemainsError[user.id] = true;
      setSumRemainsError(newSumRemainsError);
      setEnteredUsersSum(newUsersSum);
      return;
    }

    if (enteredSum) {
      let sumRemains = enteredSum - event.target.value;

      manualInputs.forEach((id) => {
        if (id in enteredUsersSum && id !== user.id) {
          sumRemains -= enteredUsersSum[id];
        }
      });

      if (isAllManual(newManualInputs)) {
        let sum = +event.target.value;
        manualInputs.forEach((id) => {
          if (id in enteredUsersSum && id !== user.id) {
            sum += +enteredUsersSum[id];
          }
        });
        setEnteredSum(sum);
      }

      if (isSumValid(roundSum(sumRemains, 1))) {
        sender.forEach((selectedUser) => {
          if (
            selectedUser !== user.id &&
            !manualInputs.includes(selectedUser)
          ) {
            const amount = sender.length - newManualInputs.length;
            newUsersSum[selectedUser] = roundSum(sumRemains, amount);
          }
        });
      } else if (+sumRemains < 0 && !isAllManual(newManualInputs)) {
        setSumError(newSumError);
      }
      setEnteredUsersSum(newUsersSum);
    } else {
      setEnteredUsersSum(newUsersSum);
    }
  };

  const descriptionInputChangeHandler = (event) => {
    setEnteredDescription(event.target.value);
  };

  const dateInputChangeHandler = (date) => {
    setEnteredDate(date);
  };

  const clearForm = () => {
    setManualInputs([]);
    setEnteredCurrency(null);
    setEnteredSum('');
    setEnteredDescription('');
    setEnteredDate(null);
    setEnteredUsersSum({});
    setSumRemainsError(false);
    setSumError(false);
  };

  const cancelingOfDebtHandler = () => {
    clearForm();
  };

  const putTransaction = async () => {
    const debtData = sender.map((id) => {
      return {
        sender: id,
        receiver: receiver[0],
        currency: enteredCurrency.id,
        amount: parseFloat(
          sender.length === 1 ? enteredSum : enteredUsersSum[id],
        ),
        description: enteredDescription,
        date: enteredDate ? new Date(enteredDate).toISOString() : undefined,
      };
    });
    try {
      await postTransactions({ transactions: debtData });
      dispatch(
        showSnackbarMessage({
          severity: 'success',
          message: 'Транзакция успешно добавлена',
        }),
      );
    } catch {
      dispatch(
        showSnackbarMessage({
          severity: 'error',
          message: 'Что-то пошло не так... Попробуйте перезагрузить страницу.',
        }),
      );
    } finally {
      clearForm();
    }
  };

  const submissionOfDebtHandler = (event) => {
    event.preventDefault();
    if (sumError || sumRemainsError) {
      return;
    }
    if (sender.length === 0) {
      setIsSenderSelected(false);
    } else if (receiver.length === 0) {
      setIsReceiverSelected(false);
    } else {
      putTransaction();
    }
  };

  const shareSum = () => {
    setManualInputs([]);
    setSumRemainsError(false);
    setSumError(false);
    const sharedSum = roundSum(enteredSum, sender.length);
    const newUsersSum = {};
    sender.forEach((id) => {
      newUsersSum[id] = sharedSum;
    });
    setEnteredUsersSum(newUsersSum);
  };

  const currentUserId = auth.currentUser.uid;

  const currentUser = useMemo(
    () => users.find((u) => u.id === currentUserId),
    [users, currentUserId],
  );

  const popularCurrencies = ['USD', 'EUR'];

  useEffect(() => {
    if (isAllManual(manualInputs)) {
      setSumError(false);
      setSumRemainsError(false);
    }
  }, [enteredSum]);

  useEffect(() => {
    sender.length > 0 && setIsSenderSelected(true);
  }, [sender]);

  useEffect(() => {
    receiver.length > 0 && setIsReceiverSelected(true);
  }, [receiver]);

  useEffect(() => {
    if (!currentUser || !currencies) {
      return;
    }
    const options = currencies
      .map((obj) => {
        if (currentUser.favoriteCurrencies.includes(obj.id)) {
          return { ...obj, group: 'Избранные валюты' };
        }
        if (popularCurrencies.includes(obj.id)) {
          return { ...obj, group: 'Популярные валюты' };
        }
        return { ...obj, group: 'Остальные валюты' };
      })
      .sort((a, b) => {
        const groupOrder = {
          'Избранные валюты': 1,
          'Популярные валюты': 2,
          'Остальные валюты': 3,
        };
        return groupOrder[a.group] - groupOrder[b.group];
      });

    setCurrenciesOptions(options);
  }, [currentUser, currencies]);

  return (
    <Container maxWidth='md'>
      <Grid container spacing={2} direction='column'>
        <Grid item xs={12}>
          <AvatarsList
            users={users}
            loading={isUsersLoading}
            error={isUserLoadingError}
            contractor={sender}
            disabledUserIds={disabledSender}
            sender={sender}
            receiver={receiver}
            setSender={setSender}
            setReceiver={setReceiver}
            setDisabledSender={setDisabledSender}
            setDisabledReceiver={setDisabledReceiver}
            isSender
          />
          {!isSenderSelected && <p>Выберите Должника</p>}
        </Grid>
        {(sender.length > 0 || receiver.length > 0) && (
          <Grid item xs={12}>
            <AvatarsList
              users={users}
              loading={isUsersLoading}
              error={isUserLoadingError}
              contractor={receiver}
              disabledUserIds={disabledReceiver}
              sender={sender}
              receiver={receiver}
              setSender={setSender}
              setReceiver={setReceiver}
              setDisabledSender={setDisabledSender}
              setDisabledReceiver={setDisabledReceiver}
            />
            {!isReceiverSelected && <p>Выберите Получателя</p>}
          </Grid>
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
                  className={enteredCurrency && classes.valid}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <TextField
                    variant='outlined'
                    label='Сумма'
                    value={enteredSum}
                    type='text'
                    id='sum'
                    onChange={sumInputChangeHandler}
                    inputProps={{
                      inputMode: 'numeric',
                      pattern: validationProps.sum.inputPropsPattern,
                      title: validationProps.sum.errorTitle,
                    }}
                    helperText={choseSumTextHelper(enteredSum)}
                    error={
                      !!(enteredSum && !validationProps.sum.testSum(enteredSum))
                    }
                    style={{ whiteSpace: 'pre-wrap' }}
                    className={enteredSum && classes.valid}
                    required={sender.length < 2}
                  />
                </FormControl>
              </Grid>

              {sender.length > 1 && (
                <Grid item xs={12}>
                  <Stack direction='row' spacing={2}>
                    <Button
                      variant='contained'
                      onClick={shareSum}
                      endIcon={<SafetyDividerIcon />}
                    >
                      Поделить поровну
                    </Button>
                  </Stack>
                </Grid>
              )}
              {sender.length > 1 &&
                sender.map((id) => {
                  const user = users.find((item) => item.id === id);
                  return (
                    <Grid item xs={12} key={id}>
                      <FormControl fullWidth required>
                        <TextField
                          variant='outlined'
                          label={`Сумма ${user.name}`}
                          value={enteredUsersSum[user.id] ?? ''}
                          type='text'
                          id={`sum ${user.id}`}
                          onChange={(event) => {
                            usersSumInputChangeHandler(event, user);
                          }}
                          inputProps={{
                            inputMode: 'numeric',
                            pattern: validationProps.sum.inputPropsPattern,
                            title: validationProps.sum.errorTitle,
                          }}
                          helperText={choseSumTextHelper(
                            enteredUsersSum[user.id],
                            user.id,
                          )}
                          error={sumRemainsError[user.id] || sumError[user.id]}
                          style={{ whiteSpace: 'pre-wrap' }}
                          className={enteredUsersSum[user.id] && classes.valid}
                          required
                        />
                      </FormControl>
                    </Grid>
                  );
                })}
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
                          value={enteredDate}
                          id='date'
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
                    onSubmit={submissionOfDebtHandler}
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
