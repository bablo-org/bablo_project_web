import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { defaultQueryFn } from '.';
import Transaction from '../models/Transaction';
import { TransactionStatus } from '../models/enums/TransactionStatus';

const useGetTransactions = (statuses?: TransactionStatus[]) => {
  let queryParam: string = '';
  if (statuses && statuses.length > 0) {
    queryParam = `?status=${statuses?.join(',')}`;
  }

  return useQuery({
    queryKey: [`transactions${queryParam}`],
    placeholderData: [],
    select: (data: any) => {
      return data.map((transaction: any) => ({
        id: transaction.id,
        sender: transaction.sender,
        receiver: transaction.receiver,
        currency: transaction.currency,
        amount: transaction.amount,
        description: transaction.description,
        date: transaction.date,
        status: transaction.status,
        created: transaction.created,
        updated: transaction.updated,
      })) as Transaction[];
    },
  });
};

const usePostTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      transactions,
    }: {
      transactions: Partial<Transaction>[];
    }) => {
      return defaultQueryFn({
        queryKey: ['transactions'],
        requestOptions: {
          body: JSON.stringify(transactions),
          method: 'POST',
        },
      });
    },
    onSuccess: () => queryClient.invalidateQueries(['transactions']),
  });
};

const useApproveTransation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transactionIds: string[]) => {
      return defaultQueryFn({
        queryKey: ['transactions/approve'],
        requestOptions: {
          body: JSON.stringify(transactionIds),
          method: 'PUT',
        },
      });
    },
    onSuccess: () => {
      return queryClient.invalidateQueries([
        `transactions?status=${TransactionStatus.APPROVED},${TransactionStatus.PENDING}`,
      ]);
    },
  });
};

const useDeclineTransation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transactionIds: string[]) => {
      return defaultQueryFn({
        queryKey: ['transactions/decline'],
        requestOptions: {
          body: JSON.stringify(transactionIds),
          method: 'PUT',
        },
      });
    },
    onSuccess: () => {
      return Promise.all([
        queryClient.invalidateQueries([
          `transactions?status=${TransactionStatus.DECLINED}`,
        ]),
        queryClient.invalidateQueries([
          `transactions?status=${TransactionStatus.APPROVED},${TransactionStatus.PENDING}`,
        ]),
      ]);
    },
  });
};

const useCompleteTransation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transactionIds: string[]) => {
      return defaultQueryFn({
        queryKey: ['transactions/complete'],
        requestOptions: {
          body: JSON.stringify(transactionIds),
          method: 'PUT',
        },
      });
    },
    onSuccess: () => {
      return Promise.all([
        queryClient.invalidateQueries([
          `transactions?status=${TransactionStatus.COMPLETED}`,
          queryClient.invalidateQueries([
            `transactions?status=${TransactionStatus.APPROVED},${TransactionStatus.PENDING}`,
          ]),
        ]),
      ]);
    },
  });
};

export {
  useGetTransactions,
  usePostTransaction,
  useApproveTransation,
  useDeclineTransation,
  useCompleteTransation,
};
