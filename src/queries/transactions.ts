import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { defaultQueryFn } from '.';
import Transaction from '../models/Transaction';

const useGetTransactions = () => {
  return useQuery({
    queryKey: ['transactions'],
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
    onSuccess: () => queryClient.invalidateQueries(['transactions']),
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
    onSuccess: () => queryClient.invalidateQueries(['transactions']),
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
    onSuccess: () => queryClient.invalidateQueries(['transactions']),
  });
};

export {
  useGetTransactions,
  usePostTransaction,
  useApproveTransation,
  useDeclineTransation,
  useCompleteTransation,
};
