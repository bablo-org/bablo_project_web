import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { defaultQueryFn } from '.';
import User, { UserSettings } from '../models/User';

const useGetUsers = () => {
  return useQuery({
    queryKey: ['users'],
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
        email: user.email,
        settings: {
          enableTelegramNotifications:
            user.settings.enableTelegramNotifications,
          favoriteCurrencies: user.settings.favoriteCurrencies,
        },
        telegramId: user.telegramId,
        telegramUser: user.telegramUser,
      })) as User[];
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
    onSuccess: () => queryClient.invalidateQueries(['users']),
  });
};

const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name, avatar }: { name: string; avatar?: string }) => {
      return defaultQueryFn({
        queryKey: ['users/updateProfile'],
        requestOptions: {
          body: JSON.stringify({ name, avatar }),
          method: 'PUT',
        },
      });
    },
    onSuccess: () => queryClient.invalidateQueries(['users']),
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
    onSuccess: () => queryClient.invalidateQueries(['users']),
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
    onSuccess: () => queryClient.invalidateQueries(['users']),
  });
};

export {
  useGetUsers,
  useUpdateUser,
  useUpdateUserAvatar,
  useUpdateTgUserName,
  useUpdateUserSettings,
};
