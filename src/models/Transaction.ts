import { Timestamp } from 'firebase/firestore';
import { TransactionStatus } from './enums/TransactionStatus';

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  date: Timestamp;
  description: string;
  receiver: string;
  sender: string;
  status: TransactionStatus;
  updated: Timestamp;
  created: Timestamp;
}

export default Transaction;
