import { Fragment, useState, useEffect } from 'react';
import classes from './DebtForm.module.css';
import AvatarsList from '../AvatarsList/AvatarsList';
import useHomeApi from '../../hooks/useHomeApi';
import { validationProps } from '../../utils/validationForm';
import {
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  FormHelperText,
  Container,
  Stack,
  Button,
  Grid,
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  Check as CheckIcon,
  Clear as ClearIcon,
  SafetyDivider as SafetyDividerIcon,
} from '@mui/icons-material';

const DebtForm = () => {
  const [users, setUsers] = useState([]);
  const [sender, setSender] = useState([]);
  const [isSenderSelected, setIsSenderSelected] = useState(true);
  const [receiver, setReceiver] = useState([]);
  const [isReceiverSelected, setIsReceiverSelected] = useState(true);
  const [enteredCurrency, setEnteredCurrency] = useState(``);
  const [enteredSum, setEnteredSum] = useState(``);
  const [enteredUsersSum, setEnteredUsersSum] = useState({});
  const [enteredDescription, setEnteredDescription] = useState(``);
  const [enteredDate, setEnteredDate] = useState(null);
  const [currencies, setCurrencies] = useState([]);
  const { getCurrencies, postTransactions, loading, error, getUsers } =
    useHomeApi();

  useEffect(() => {
    getCurrencies().then(setCurrencies);
    getUsers().then(setUsers);
  }, []);

  useEffect(() => {
    sender.length > 0 && setIsSenderSelected(true);
  }, [sender]);

  useEffect(() => {
    receiver.length > 0 && setIsReceiverSelected(true);
  }, [receiver]);

  const currencyInputChangeHandler = (event) => {
    setEnteredCurrency(event.target.value);
  };
  const sumInputChangeHandler = (event) => {
    setEnteredSum(event.target.value);
  };
  const usersSumInputChangeHandler = (event, user) => {
    const newUsersSum = { ...enteredUsersSum, [user.id]: event.target.value };
    setEnteredUsersSum(newUsersSum);
  };
  const descriptionInputChangeHandler = (event) => {
    setEnteredDescription(event.target.value);
  };
  const dateInputChangeHandler = (date) => {
    setEnteredDate(date);
  };

  const clearForm = () => {
    setEnteredCurrency(``);
    setEnteredSum(``);
    setEnteredDescription(``);
    setEnteredDate(null);
    setEnteredUsersSum({});
  };

  const cancelingOfDebtHandler = () => {
    clearForm();
  };

  const submissionOfDebtHandler = (event) => {
    event.preventDefault();
    if (sender.length === 0) {
      setIsSenderSelected(false);
    } else if (receiver.length === 0) {
      setIsReceiverSelected(false);
    } else {
      const debtData = sender.map((id) => {
        return {
          sender: id,
          receiver: receiver[0],
          currency: enteredCurrency,
          amount: parseFloat(
            sender.length === 1 ? enteredSum : enteredUsersSum[id]
          ),
          description: enteredDescription,
          date: enteredDate ? new Date(enteredDate).toISOString() : undefined,
        };
      });
      postTransactions(debtData);
      clearForm();
    }
  };

  const shareSum = () => {
    const sharedSum = Math.round((enteredSum / sender.length) * 100) / 100;
    const newUsersSum = {};
    sender.forEach((id) => {
      newUsersSum[id] = sharedSum;
    });
    setEnteredUsersSum(newUsersSum);
  };

  return (
    <Container maxWidth="md">
      <Grid container spacing={2} direction="column">
        <Grid item xs={12}>
          <AvatarsList
            users={users}
            loading={loading}
            error={error}
            onUserSelected={setSender}
            blockedUserIds={undefined}
          />
          {!isSenderSelected && <p>Выберите Должника</p>}
        </Grid>
        {sender.length > 0 && (
          <Grid item xs={12}>
            <AvatarsList
              users={users}
              loading={loading}
              error={error}
              onUserSelected={setReceiver}
              blockedUserIds={sender}
            />
            {!isReceiverSelected && <p>Выберите Получателя</p>}
          </Grid>
        )}
        <Grid item xs={12}>
          <form onSubmit={submissionOfDebtHandler}>
            <Grid container spacing={2} direction="column">
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel id="currency">Валюта</InputLabel>
                  <Select
                    labelId="currencyLabel"
                    id="currency"
                    value={enteredCurrency}
                    label="Валюта"
                    onChange={currencyInputChangeHandler}
                    required
                    className={enteredCurrency ? classes.valid : undefined}
                  >
                    {currencies.map((currency) => (
                      <MenuItem key={currency.id} value={currency.id}>
                        {currency.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    {enteredCurrency ? undefined : 'Выберите валюту'}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <TextField
                    variant="outlined"
                    label="Сумма"
                    value={enteredSum}
                    type="text"
                    id="sum"
                    onChange={sumInputChangeHandler}
                    inputProps={{
                      inputMode: 'numeric',
                      pattern: validationProps.sum.inputPropsPattern,
                      title: validationProps.sum.errorTitle,
                    }}
                    helperText={
                      enteredSum
                        ? validationProps.sum.testSum(enteredSum)
                          ? validationProps.sum.errorTitle
                          : undefined
                        : validationProps.sum.title
                    }
                    error={
                      !!(enteredSum && validationProps.sum.testSum(enteredSum))
                    }
                    style={{ whiteSpace: 'pre-wrap' }}
                    className={enteredSum ? classes.valid : undefined}
                    required={sender.length < 2 ? true : false}
                  />
                </FormControl>
              </Grid>

              {sender.length > 1 && (
                <Grid item xs={12}>
                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="contained"
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
                          variant="outlined"
                          label={`Сумма ${user.name}`}
                          value={enteredUsersSum[user.id] ?? ''}
                          type="text"
                          id={`sum ${user.id}`}
                          onChange={(event) =>
                            usersSumInputChangeHandler(event, user)
                          }
                          inputProps={{
                            inputMode: 'numeric',
                            pattern: validationProps.sum.inputPropsPattern,
                            title: validationProps.sum.errorTitle,
                          }}
                          helperText={
                            enteredUsersSum[user.id]
                              ? validationProps.sum.testSum(
                                  enteredUsersSum[user.id]
                                )
                                ? validationProps.sum.errorTitle
                                : undefined
                              : validationProps.sum.title
                          }
                          error={
                            !!(
                              enteredUsersSum[user.id] &&
                              validationProps.sum.testSum(
                                enteredUsersSum[user.id]
                              )
                            )
                          }
                          style={{ whiteSpace: 'pre-wrap' }}
                          className={
                            enteredUsersSum[user.id] ? classes.valid : undefined
                          }
                          required
                        />
                      </FormControl>
                    </Grid>
                  );
                })}
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <TextField
                    variant="outlined"
                    label="Описание"
                    value={enteredDescription}
                    type="text"
                    id="description"
                    onChange={descriptionInputChangeHandler}
                    helperText={
                      enteredDescription
                        ? undefined
                        : validationProps.description.title
                    }
                    style={{ whiteSpace: 'pre-wrap' }}
                    className={enteredDescription ? classes.valid : undefined}
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
                          label="Дата"
                          value={enteredDate}
                          id="date"
                          onChange={dateInputChangeHandler}
                          closeOnSelect={true}
                          className={enteredDate ? classes.valid : undefined}
                          slotProps={{
                            textField: {
                              required: true,
                              helperText: enteredDate
                                ? undefined
                                : validationProps.date.title,
                            },
                          }}
                        />
                      </LocalizationProvider>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={cancelingOfDebtHandler}
                    endIcon={<ClearIcon />}
                  >
                    Отмена
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    type="submit"
                    endIcon={<CheckIcon />}
                  >
                    Отправить
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DebtForm;
