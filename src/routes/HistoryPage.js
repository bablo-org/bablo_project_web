import { useEffect, useState } from 'react';
import useHomeApi from '../hooks/useHomeApi';

const HistoryPage = () => {
  const [transactions, setTransactions] = useState([]);
  const { loading, error, getTransactions } = useHomeApi();
  useEffect(() => {
    getTransactions().then(setTransactions);
  }, []);

  return <h1>{JSON.stringify(transactions)}</h1>;
};

export default HistoryPage;
