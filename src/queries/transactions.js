import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { defaultQueryFn } from ".";

const useGetTransactions = () => {
  return useQuery({
    queryKey: ["transactions"],
    placeholderData: [],
    select: (data) =>
      data.map((transaction) => ({
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
      })),
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
    mutationFn: ({ transactions }) =>
      defaultQueryFn({
        queryKey: ["transactions"],
        requestOptions: {
          body: JSON.stringify(transactions),
          method: "POST",
        },
      }),
    onSuccess: async () =>
      await queryClient.invalidateQueries(["transactions"]),
  });
};

const useApproveTransation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transactionIds) =>
      defaultQueryFn({
        queryKey: ["transactions/approve"],
        requestOptions: {
          body: JSON.stringify(transactionIds),
          method: "PUT",
        },
      }),
    onSuccess: async () =>
      await queryClient.invalidateQueries(["transactions"]),
  });
};

const useDeclineTransation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transactionIds) =>
      defaultQueryFn({
        queryKey: ["transactions/decline"],
        requestOptions: {
          body: JSON.stringify(transactionIds),
          method: "PUT",
        },
      }),
    onSuccess: async () =>
      await queryClient.invalidateQueries(["transactions"]),
  });
};

const useCompleteTransation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transactionIds) =>
      defaultQueryFn({
        queryKey: ["transactions/complete"],
        requestOptions: {
          body: JSON.stringify(transactionIds),
          method: "PUT",
        },
      }),
    onSuccess: async () =>
      await queryClient.invalidateQueries(["transactions"]),
  });
};

export {
  useGetTransactions,
  usePostTransaction,
  useApproveTransation,
  useDeclineTransation,
  useCompleteTransation,
};
