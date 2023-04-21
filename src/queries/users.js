import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { defaultQueryFn } from '.';

const useGetUsers = () => {
  return useQuery({
    queryKey: ['users'],
    placeholderData: [],
    refetchOnReconnect: 'always',
    refetchOnWindowFocus: 'always',
    retryOnMount: true,
    select: (data) => {
      return data.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        created: user.created,
        avatar: user.avatar,
        telegramUser: user.telegramUser,
        enableTgNotifications: user.settings.enableTelegramNotifications,
      }));
    },
  });
};

const useUpdateUserAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ encodedImage, fileName }) => {
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
    mutationFn: ({ name, avatar }) => {
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
    mutationFn: (name) => {
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
    mutationFn: (settings) => {
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
