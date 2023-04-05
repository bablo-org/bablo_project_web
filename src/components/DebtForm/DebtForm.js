import { Fragment, useState, useEffect } from "react";
import classes from "./DebtForm.module.css";
import AvatarsList from "../AvatarsList/AvatarsList";
import useHomeApi from "../../hooks/useHomeApi";

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
  const [enteredDate, setEnteredDate] = useState();
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
  const dateInputChangeHandler = (event) => {
    setEnteredDate(event.target.value);
  };

  const clearForm = () => {
    setEnteredCurrency(``);
    setEnteredSum(``);
    setEnteredDescription(``);
    setEnteredDate(``);
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
      setIsSenderSelected(true);
      setIsReceiverSelected(true);

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

  const currencySelector = (
    <select
      className={classes.currencySelector}
      value={enteredCurrency}
      onChange={currencyInputChangeHandler}
      required
    >
      <option value="" defaultValue disabled hidden>
        Choose Value
      </option>
      {currencies.map((currency) => (
        <option key={currency.id} value={currency.id}>
          {currency.name}
        </option>
      ))}
    </select>
  );

  return (
    <Fragment>
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
      <div className={classes.container}>
        <form className={classes.form} onSubmit={submissionOfDebtHandler}>
          <div className={classes.control}>
            <label htmlFor="currency">Валюта</label>
            {currencySelector}
          </div>
          <div className={classes.control}>
            <label htmlFor="sum">Сумма</label>
            <input
              value={enteredSum}
              type="text"
              id="sum"
              onChange={sumInputChangeHandler}
              pattern="(?:0|[1-9]\d*)(?:\.\d{1,2})?"
              title="Введеная сумма должна быть в формате xxx.xx и не начинаться с 0 если это не дробь вида 0.хх"
              required
            />
          </div>
          {sender.length > 1 && (
            <div className={classes.actions}>
              <button type="button" onClick={shareSum} className={classes.sum}>
                Поделить поровну
              </button>
            </div>
          )}
          {sender.length > 1 &&
            sender.map((id) => {
              const user = users.find((item) => item.id === id);
              return (
                <div className={classes.control} key={`sum ${user.id}`}>
                  <label htmlFor="sum">Сумма {user.name}</label>
                  <input
                    value={enteredUsersSum[user.id] ?? ""}
                    type="text"
                    id={`sum ${user.id}`}
                    onChange={(event) =>
                      usersSumInputChangeHandler(event, user)
                    }
                    pattern="(?:0|[1-9]\d*)(?:\.\d{1,2})?"
                    title="Введеная сумма должна быть в формате xxx.xx и не начинаться с 0 если это не дробь вида 0.хх"
                    required
                  />
                </div>
              );
            })}
          <div className={classes.control}>
            <label htmlFor="description">Описание</label>
            <input
              value={enteredDescription}
              type="text"
              id="description"
              onChange={descriptionInputChangeHandler}
              required
            />
          </div>
          <div className={classes.control}>
            <label htmlFor="date">Дата</label>
            <input
              value={enteredDate}
              type="date"
              id="date"
              onChange={dateInputChangeHandler}
              required
            />
          </div>
          <div className={classes.actions}>
            <button type="button" onClick={cancelingOfDebtHandler}>
              Cancel
            </button>
            <button className={classes.submit}>Confirm</button>
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default DebtForm;
