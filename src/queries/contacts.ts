import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ContactRequest } from '../models/ContactRequest';
import { defaultQueryFn } from '.';

const useGetContactsRequests = () => {
  return useQuery({
    queryKey: ['partnershipRequests'],
    placeholderData: [],
    select: (data: any) => {
      return data.map((request: any) => ({
        id: request.id,
        sender: request.sender,
        receiver: request.receiver,
        created: request.created,
        updated: request.updated,
      })) as ContactRequest[];
    },
  });
};

const usePostContactRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ receiver }: { receiver: string }) => {
      return defaultQueryFn({
        queryKey: [`partnershipRequests?receiver=${receiver}`],
        requestOptions: {
          method: 'POST',
        },
      });
    },
    onSuccess: () => queryClient.invalidateQueries(['partnershipRequests']),
  });
};

const useAcceptContactRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string }) => {
      return defaultQueryFn({
        queryKey: [`partnershipRequests/${id}/accept`],
        requestOptions: {
          method: 'PUT',
        },
      });
    },
    onSuccess: () => {
      return Promise.all([
        queryClient.invalidateQueries(['partnershipRequests']),
        queryClient.invalidateQueries(['users?filter=partners']),
      ]);
    },
  });
};

const useDeclineContactRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string }) => {
      return defaultQueryFn({
        queryKey: [`partnershipRequests/${id}/decline`],
        requestOptions: {
          method: 'PUT',
        },
      });
    },
    onSuccess: () => queryClient.invalidateQueries(['partnershipRequests']),
  });
};

export {
  useGetContactsRequests,
  usePostContactRequest,
  useAcceptContactRequest,
  useDeclineContactRequest,
};
