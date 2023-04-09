import useHomeApi from "../../hooks/useHomeApi";
import { useEffect, useMemo, useState } from "react";
import TransactionItem from "./TransactionItem";
import classes from "./TransactionsList.module.css";
import Spinner from "../Spinner/Spinner";
import { Grid, Box } from "@mui/material";

const TransactionsList = () => {
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const { getTransactions, getUsers, loading } = useHomeApi();

  useEffect(() => {
    getTransactions().then(setTransactions);
    getUsers().then(setUsers);
  }, []);

  const reFetchTransactions = () => {
    getTransactions().then(setTransactions);
  };

  const formatUserName = (incomingId) => {
    const idToName = users.find((user) => user.id === incomingId)?.name;
    return idToName;
  };

  const transformedTransactions = useMemo(() => {
    const sortedTransactions = transactions.sort(
      (obj1, obj2) => new Date(obj2.date) - new Date(obj1.date)
    );
    return sortedTransactions.map((transaction) => (
      <Grid item xs={12} md={6} lg={4}>
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
          senderId={transaction.sender}
          recieverId={transaction.receiver}
          reFetchTransactions={reFetchTransactions}
        />
      </Grid>
    ));
  }, [transactions]);

  if (loading || users === undefined) {
    return <Spinner />;
  } else if (!loading && transactions.length === 0) {
    return <p className={classes.noTransactionsAvailable}>Суй ананас в жопу</p>;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        {transformedTransactions}
      </Grid>
    </Box>
  );
};

export default TransactionsList;
