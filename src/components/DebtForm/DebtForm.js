import { Fragment, useState, useEffect } from "react";
import classes from "./DebtForm.module.css";
import AvatarsList from "../AvatarsList/AvatarsList";
import useHomeApi from "../../hooks/useHomeApi";
import { validationProps } from "../../utils/validationForm";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";
import Container from "@mui/material/Container";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import SafetyDividerIcon from "@mui/icons-material/SafetyDivider";
import Grid from "@mui/system/Unstable_Grid/Grid";

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
    <Fragment>
      <Container maxWidth="md">
        <div>
          <label className={classes.addDebtlabel}>Должник</label>
          <AvatarsList
            users={users}
            loading={loading}
            error={error}
            onUserSelected={setSender}
            blockedUserIds={undefined}
          />
          {!isSenderSelected && <p>Выберите Должника</p>}

          {sender.length > 0 && (
            <>
              <label className={classes.addDebtlabel}>Получатель</label>
              <AvatarsList
                users={users}
                loading={loading}
                error={error}
                onUserSelected={setReceiver}
                blockedUserIds={sender}
              />
            </>
          )}
          {!isReceiverSelected && <p>Выберите Получателя</p>}
        </div>
        <Grid container spacing={2} direction="column">
          <form className={classes.form} onSubmit={submissionOfDebtHandler}>
            <Grid >
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
                  {enteredCurrency ? undefined : "Выберите валюту"}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid >
              <FormControl fullWidth required>
                <TextField
                  variant="outlined"
                  label="Сумма"
                  value={enteredSum}
                  type="text"
                  id="sum"
                  onChange={sumInputChangeHandler}
                  inputProps={{
                    inputMode: "numeric",
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
                  error={enteredSum && validationProps.sum.testSum(enteredSum)}
                  style={{ whiteSpace: "pre-wrap" }}
                  className={enteredSum ? classes.valid : undefined}
                  required
                />
              </FormControl>
            </Grid>

            {sender.length > 1 && (
              <Grid >
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
                  <Grid >
                    <FormControl fullWidth required>
                      <TextField
                        variant="outlined"
                        label={`Сумма ${user.name}`}
                        value={enteredUsersSum[user.id] ?? ""}
                        type="text"
                        id={`sum ${user.id}`}
                        onChange={(event) =>
                          usersSumInputChangeHandler(event, user)
                        }
                        inputProps={{
                          inputMode: "numeric",
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
                          enteredUsersSum[user.id] &&
                          validationProps.sum.testSum(enteredUsersSum[user.id])
                        }
                        style={{ whiteSpace: "pre-wrap" }}
                        className={
                          enteredUsersSum[user.id] ? classes.valid : undefined
                        }
                        required
                      />
                    </FormControl>
                  </Grid>
                );
              })}
            <Grid >
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
                  style={{ whiteSpace: "pre-wrap" }}
                  className={enteredDescription ? classes.valid : undefined}
                  required
                />
              </FormControl>
            </Grid>
            <Grid md={4}>
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
                        helperText: enteredDate ? undefined : validationProps.date.title,
                      },
                    }}
                  />
                </LocalizationProvider>
              </FormControl>
            </Grid>
            <Grid>
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
          </form>
        </Grid>
      </Container>
    </Fragment>
  );
};

export default DebtForm;
