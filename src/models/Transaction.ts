import { TransactionStatus } from './enums/TransactionStatus';

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  date: number;
  description: string;
  receiver: string;
  sender: string;
  status: TransactionStatus;
  updated: number;
  created: number;
}

export default Transaction;
