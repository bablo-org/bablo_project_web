import { Fragment, useState, useEffect } from 'react';
import classes from './DebtForm.module.css';
import AvatarsList from '../AvatarsList/AvatarsList';
import useHomeApi from '../../hooks/useHomeApi';

const DebtForm = () => {
  const [sender, setSender] = useState();
  const [receiver, setReceiver] = useState();
  const [enteredCurrency, setEnteredCurrency] = useState(``);
  const [enteredSum, setEnteredSum] = useState(``);
  const [enteredDescription, setEnteredDescription] = useState(``);
  const [enteredDate, setEnteredDate] = useState(``);
  const [currencies, setCurrencies] = useState([]);
  const { getCurrencies } = useHomeApi();

  useEffect(() => {
    getCurrencies().then(setCurrencies);
  }, []);

  const currencyInputChangeHandler = (event) => {
    setEnteredCurrency(event.target.value);
  };
  const sumInputChangeHandler = (event) => {
    setEnteredSum(event.target.value);
  };
  const descriptionInputChangeHandler = (event) => {
    setEnteredDescription(event.target.value);
  };
  const dateInputChangeHandler = (event) => {
    setEnteredDate(event.target.value);
  };
  const debtData = {
    sender: sender,
    receiver: receiver,
    currency: enteredCurrency,
    sum: enteredSum + ` ${enteredCurrency}`,
    description: enteredDescription,
    date: enteredDate,
  };

  const clearForm = () => {
    setEnteredCurrency(``);
    setEnteredSum(``);
    setEnteredDescription(``);
    setEnteredDate(``);
    setSender(``);
    setReceiver(``);
  };

  const cancelingOfDebtHandler = () => {
    clearForm();
  };

  const submissionOfDebtHandler = (event) => {
    event.preventDefault();
    console.warn(debtData);
    clearForm();
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
        </form>
      </div>
    </Fragment>
  );
};

export default DebtForm;
