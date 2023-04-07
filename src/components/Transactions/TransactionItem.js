import classes from './TransactionItem.module.css';
import { auth } from '../../services/firebase';
import useHomeApi from '../../hooks/useHomeApi';
import { useState } from 'react';
import { Button } from '@mui/material';
const TransactionItem = ({
  sender,
  receiver,
  description,
  date,
  status,
  created,
  updated,
  currency,
  amount,
  id,
  senderId,
  recieverId,
  reFetchTransactions
}) => {
  const currentUserId = auth.currentUser.uid;
  const [isLoading, setIsLoading] = useState(false)
  const {
    putTransactionsApprove,
    putTransactionsComplete,
    putTransactionsDecline,
  } = useHomeApi();

  const formatDate = (ISOStringDate) => {
    const readableDate = new Date(ISOStringDate);
    let day = readableDate.getDate();
    let month = readableDate.getMonth() + 1;
    let year = readableDate.getFullYear();
    if (day < 10) {
      day = `0` + day;
    }
    if (month < 10) {
      month = `0` + month;
    }
    return day + `/` + month + `/` + year;
  };
  const putTransactionsDeclineHandler = () => {
    setIsLoading(true)
    putTransactionsDecline(JSON.stringify([id])).then(() =>
    reFetchTransactions()
    ).finally(() => setIsLoading(false));
  };
  const putTransactionsCompleteHandler = () => {
    setIsLoading(true)
    putTransactionsComplete(JSON.stringify([id])).then(() =>
    reFetchTransactions()
    ).finally(() => setIsLoading(false));
  };
  const putTransactionsApproveHandler = () => {
    putTransactionsApprove(JSON.stringify([id])).then(() =>
    reFetchTransactions()
    ).finally(() => setIsLoading(false));
  };

  return (
    <li className={classes.transaction}>
      <div>
        <h3 className={classes.transactionHeader}>Транзакция</h3>
        <div className={classes.description}>Отправитель: {sender}</div>
        <div className={classes.description}>Получатель: {receiver}</div>
        <div className={classes.description}>Описание: {description}</div>
        <div className={classes.description}>
          Дата: {JSON.stringify(formatDate(date))}
        </div>
        <div className={classes.description}>Статус: {status}</div>
        <div className={classes.description}>
          Создана: {JSON.stringify(formatDate(created))}
        </div>
        <div className={classes.description}>
          Обновлена: {JSON.stringify(formatDate(updated))}
        </div>
        <div className={classes.price}>Сумма: {amount + ` ` + currency}</div>
        <div>
          {currentUserId === senderId && status === `PENDING` && !isLoading && (
            <div>
              <Button color='error' variant='contained' onClick={putTransactionsDeclineHandler}>Decline</Button>
              <Button color='secondary' variant='contained' onClick={putTransactionsApproveHandler}>Approve</Button>
            </div>
          )}

          {status === `APPROVED` &&
            recieverId === currentUserId &&
            !isLoading && (
              <Button color='success' variant='contained' onClick={putTransactionsCompleteHandler}>Complete</Button>
            )}
        </div>
      </div>
    </li>
  );
};

export default TransactionItem;
