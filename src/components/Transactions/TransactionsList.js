import useHomeApi from '../../hooks/useHomeApi';
import { useEffect, useMemo, useState } from 'react';
import TransactionItem from './TransactionItem';
import classes from './TransactionsList.module.css';
import Spinner from '../Spinner/Spinner';
const TransactionsList = () => {
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const { getTransactions, getUsers, loading } = useHomeApi();
  const sortedTransactions = useMemo(() => {
    return transactions.sort(
      (obj1, obj2) => new Date(obj2.date) - new Date(obj1.date)
    );
  }, [transactions]);
  useEffect(() => {
    getTransactions().then(setTransactions);
    getUsers().then(setUsers);
  }, []);

  if (loading) {
    return <Spinner />;
  } else if (!loading && transactions.length === 0) {
    return <p className={classes.noTransactionsAvailable}>Суй ананас в жопу</p>;
  }

  const formatUserName = (incomingId) => {
    const idToName = users.find((user) => user.id === incomingId)?.name;
    return idToName;
  };

  const transformedTransactions = sortedTransactions.map((transaction) => (
    <TransactionItem
      key={transaction.id}
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

  return (
    <section className={classes.transactions}>
      <div className={classes.card}>
        <ul>{transformedTransactions}</ul>
      </div>
    </section>
  );
};

export default TransactionsList;
