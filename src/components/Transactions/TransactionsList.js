import useHomeApi from '../../hooks/useHomeApi';
import { useEffect, useMemo, useState } from 'react';
import TransactionItem from './TransactionItem';
import classes from './TransactionsList.module.css';
import Spinner from '../Spinner/Spinner';
const TransactionsList = () => {
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const { getTransactions, getUsers, loading } = useHomeApi();

  useEffect(() => {
    getTransactions().then(setTransactions);
    getUsers().then(setUsers);
  }, []);

  const formatUserName = (incomingId) => {
    const idToName = users.find((user) => user.id === incomingId)?.name;
    return idToName;
  };

  const transformedTransactions = useMemo(() => {
    const sortedTransactions = transactions.sort(
      (obj1, obj2) => new Date(obj2.date) - new Date(obj1.date)
    );
    return sortedTransactions.map((transaction) => (
      <TransactionItem
        key={transaction.id}
        id={transaction.id}
        sender={formatUserName(transaction.sender)}
        receiver={formatUserName(transaction.receiver)}
        currency={transaction.currency}
        amount={transaction.amount}
        description={transaction.description}
        date={transaction.date}
        status={transaction.status}
        created={transaction.created}
        updated={transaction.updated}
      />
    ));
  }, [transactions]);

  if (loading || users === undefined) {
    return <Spinner />;
  } else if (!loading && transactions.length === 0) {
    return <p className={classes.noTransactionsAvailable}>Суй ананас в жопу</p>;
  }

  return (
    <section className={classes.transactions}>
      <div className={classes.card}>
        <ul>{transformedTransactions}</ul>
      </div>
    </section>
  );
};

export default TransactionsList;
