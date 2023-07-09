import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { defaultQueryFn } from '.';
import User, { UserSettings } from '../models/User';

const useGetUsers = () => {
  return useQuery({
    queryKey: ['users?filter=partners'],
    placeholderData: [],
    refetchOnReconnect: 'always',
    refetchOnWindowFocus: 'always',
    retryOnMount: true,
    select: (data: any) => {
      return data.map((user: any) => ({
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        created: user.created,
        privateData: {
          email: user.privateData?.email,
          telegramId: user.privateData?.telegramId,
          telegramUser: user.privateData?.telegramUser,
          settings: {
            enableTelegramNotifications:
              user.privateData?.settings?.enableTelegramNotifications,
            favoriteCurrencies: user?.privateData?.settings?.favoriteCurrencies,
          },
          network: {
            partners: user.privateData?.network?.partners,
          },
        },
        active: user.active,
      })) as User[];
    },
  });
};

const useGetUserById = (id: string) => {
  return useQuery({
    queryKey: [`users/${id}`],
    placeholderData: [],
    refetchOnReconnect: 'always',
    refetchOnWindowFocus: 'always',
    retryOnMount: true,
    select: (data: any) => {
      if (data.length === 0) {
        return undefined;
      }
      return data.map((user: any) => ({
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        created: user.created,
        privateData: {
          email: user.privateData?.email,
          telegramId: user.privateData?.telegramId,
          telegramUser: user.privateData?.telegramUser,
          settings: {
            enableTelegramNotifications:
              user.privateData?.settings?.enableTelegramNotifications,
            favoriteCurrencies: user?.privateData?.settings?.favoriteCurrencies,
          },
          network: {
            partners: user.privateData?.network?.partners,
          },
        },
        active: user.active,
      }))[0] as User;
    },
  });
};

const useUpdateUserAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      encodedImage,
      fileName,
    }: {
      encodedImage: string;
      fileName: string;
    }) => {
      return defaultQueryFn({
        queryKey: [`users/uploadAvatar?fileName=${fileName}`],
        requestOptions: {
          body: encodedImage,
          method: 'POST',
        },
      });
    },
    onSuccess: () => queryClient.invalidateQueries(['users?filter=partners']),
  });
};

const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name, avatar }: Partial<User>) => {
      return defaultQueryFn({
        queryKey: ['users/updateProfile'],
        requestOptions: {
          body: JSON.stringify({ name, avatar }),
          method: 'PUT',
        },
      });
    },
    onSuccess: () => queryClient.invalidateQueries(['users?filter=partners']),
  });
};

const useUpdateTgUserName = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => {
      return defaultQueryFn({
        queryKey: [`users/connectTelegram/${name}`],
        requestOptions: {
          method: 'PUT',
        },
      });
    },
    onSuccess: () => queryClient.invalidateQueries(['users?filter=partners']),
  });
};

const useUpdateUserSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (settings: UserSettings) => {
      return defaultQueryFn({
        queryKey: ['users/updateSettings'],
        requestOptions: {
          body: JSON.stringify(settings),
          method: 'PUT',
        },
      });
    },
    onSuccess: () => queryClient.invalidateQueries(['users?filter=partners']),
  });
};

const useRegisterUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      return defaultQueryFn({
        queryKey: ['registration/register'],
        requestOptions: {
          method: 'POST',
        },
      });
    },
    onSuccess: () => queryClient.invalidateQueries(['users?filter=partners']),
  });
};

export {
  useGetUsers,
  useUpdateUser,
  useUpdateUserAvatar,
  useUpdateTgUserName,
  useUpdateUserSettings,
  useRegisterUser,
  useGetUserById,
};
