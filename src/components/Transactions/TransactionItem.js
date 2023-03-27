import classes from './TransactionItem.module.css';

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
}) => {
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
      </div>
    </li>
  );
};

export default TransactionItem;
