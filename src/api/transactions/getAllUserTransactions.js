import { Transactions } from "../../mockeddata/Transactions";

export const getAllUserTransactions = (userId) => {
  return new Promise((resolve, reject) => {
    const transactions = Transactions.filter(tx => tx.sender === userId || tx.reciever === userId);
    resolve(transactions);
  });
};