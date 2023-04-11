import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { defaultQueryFn } from '.';

const useGetTransactions = () => {
  return useQuery({
    queryKey: ['transactions'],
    placeholderData: [],
    select: (data) => {
      return data.map((transaction) => ({
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
      }));
    },
  });
};

const usePostTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    /**
     *
     * @param {
     * Array<{
     *  sender: string;
     *  receiver: string;
     *  currency: string;
     *  amount: number;
     *  description: string;
     *  date: string
     * }>}
     */
    mutationFn: ({ transactions }) => {
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
    mutationFn: (transactionIds) => {
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
    mutationFn: (transactionIds) => {
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
    mutationFn: (transactionIds) => {
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
