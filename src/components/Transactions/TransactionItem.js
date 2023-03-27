import classes from './TransactionItem.module.css';

const TransactionItem = (props) => {
  const formatDate = (arg) => {
    const readableDate = new Date(arg);
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
        <div className={classes.description}>Отправитель: {props.sender}</div>
        <div className={classes.description}>Получатель: {props.receiver}</div>
        <div className={classes.description}>Описание: {props.description}</div>
        <div className={classes.description}>
          Дата: {JSON.stringify(formatDate(props.date))}
        </div>
        <div className={classes.description}>Статус: {props.status}</div>
        <div className={classes.description}>
          Создана: {JSON.stringify(formatDate(props.created))}
        </div>
        <div className={classes.description}>
          Обновлена: {JSON.stringify(formatDate(props.updated))}
        </div>
        <div className={classes.price}>
          Сумма: {props.amount + ` ` + props.currency}
        </div>
      </div>
    </li>
  );
};

export default TransactionItem;
