import { Fragment, useState } from 'react';
import classes from './DebtForm.module.css';
import AvatarsList from '../AvatarsList/AvatarsList';

const DebtForm = () => {
  const [sender, setSender] = useState();
  const [receiver, setReceiver] = useState();
  const [enteredCurrency, setEnteredCurrency] = useState(``);
  const [enteredSum, setEnteredSum] = useState(``);
  const [enteredDescription, setEnteredDescription] = useState(``);
  const [enteredDate, setEnteredDate] = useState(``);

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
  };

  const cancelingOfDebtHandler = () => {
    clearForm();
  };

  const submissionOfDebtHandler = (event) => {
    event.preventDefault();
    console.warn(debtData);
    clearForm();
  };
  return (
    <Fragment>
      <div>
        <AvatarsList onUserSelected={setSender} />
        <AvatarsList onUserSelected={setReceiver} />
      </div>
      <div className={classes.container}>
        <form className={classes.form} onSubmit={submissionOfDebtHandler}>
          <div className={classes.control}>
            <label htmlFor="currency">Currency</label>
            <select
              value={enteredCurrency}
              className={classes.currencySelector}
              onChange={currencyInputChangeHandler}
            >
              <option value="" selected disabled hidden>
                Choose Value
              </option>
              <option value="USD">United States Dollars</option>
              <option value="THB">Thailand Baht</option>
            </select>
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
