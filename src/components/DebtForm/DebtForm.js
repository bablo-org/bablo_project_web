import { Fragment, useState, useEffect } from 'react';
import classes from './DebtForm.module.css';
import AvatarsList from '../AvatarsList/AvatarsList';
import useHomeApi from '../../hooks/useHomeApi';

const DebtForm = () => {
  const [sender, setSender] = useState();
  const [receiver, setReceiver] = useState();
  const [enteredCurrency, setEnteredCurrency] = useState(``);
  const [isFormValid, setIsFormIsValid] = useState(true);
  const [enteredSum, setEnteredSum] = useState(``);
  const [enteredDescription, setEnteredDescription] = useState(``);
  const [enteredDate, setEnteredDate] = useState();
  const [currencies, setCurrencies] = useState([]);
  const { getCurrencies, postTransactions } = useHomeApi();

  useEffect(() => {
    getCurrencies().then(setCurrencies);
  }, []);

  const currencyInputChangeHandler = (event) => {
    setEnteredCurrency(event.target.value);
  };
  const sumInputChangeHandler = (event) => {
    setEnteredSum(event.target.value.replace(/\D/g, ''));
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
    if (
      sender === undefined ||
      receiver === undefined ||
      enteredCurrency === `` ||
      enteredSum === `` ||
      enteredDescription === `` ||
      enteredDate === ``
    ) {
      setIsFormIsValid(false);
    } else {
      const debtData = {
        sender: sender,
        receiver: receiver,
        currency: enteredCurrency,
        amount: parseInt(enteredSum),
        description: enteredDescription,
        date: enteredDate ? new Date(enteredDate).toISOString() : undefined,
      };
      setIsFormIsValid(true);
      postTransactions(debtData);
      clearForm();
    }
  };

  const currencySelector = (
    <select
      className={classes.currencySelector}
      value={enteredCurrency}
      onChange={currencyInputChangeHandler}
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
        <AvatarsList onUserSelected={setSender} blockedUserId={receiver} />
        <AvatarsList onUserSelected={setReceiver} blockedUserId={sender} />
      </div>
      <div className={classes.container}>
        <form className={classes.form} onSubmit={submissionOfDebtHandler}>
          <div className={classes.control}>
            <label htmlFor="currency">Currency</label>
            {currencySelector}
          </div>
          <div className={classes.control}>
            <label htmlFor="sum">Sum</label>
            <input
              value={enteredSum}
              type="number"
              id="sum"
              onChange={sumInputChangeHandler}
            />
          </div>
          <div className={classes.control}>
            <label htmlFor="description">Description</label>
            <input
              value={enteredDescription}
              type="text"
              id="description"
              onChange={descriptionInputChangeHandler}
            />
          </div>
          <div className={classes.control}>
            <label htmlFor="date">Date</label>
            <input
              value={enteredDate}
              type="date"
              id="date"
              onChange={dateInputChangeHandler}
            />
          </div>
          <div className={classes.actions}>
            <button type="button" onClick={cancelingOfDebtHandler}>
              Cancel
            </button>
            <button className={classes.submit}>Confirm</button>
          </div>
          {!isFormValid ? <p>Все поля должны быть заполнены... Лох</p> : undefined}
        </form>
      </div>
    </Fragment>
  );
};

export default DebtForm;
