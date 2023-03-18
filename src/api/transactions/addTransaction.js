import { Transactions } from "../../mockeddata/Transactions";

export const addTransaction = (
  amount,
  currency,
  date,
  desctiption,
  reciever,
  sender,
  status,
) => {
  return new Promise((resolve, reject) => {
    if (!amount || !currency || !date || !desctiption || !reciever || !sender || !status) {
      reject("Please fulfill all trasaction's fields")
    }
    Transactions.push({
      amount,
      currency,
      date,
      desctiption,
      reciever,
      sender,
      status,
    })
    resolve('success')
  });
};