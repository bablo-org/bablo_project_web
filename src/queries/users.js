import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { defaultQueryFn } from ".";

const useGetUsers = () => {
  return useQuery({
    queryKey: ["users"],
    placeholderData: [],
    refetchOnReconnect: "always",
    refetchOnWindowFocus: "always",
    retryOnMount: true,
    select: (data) =>
      data.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        created: user.created,
        avatar: user.avatar,
      })),
  });
};

const useUpdateUserAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ encodedImage, fileName }) =>
      defaultQueryFn({
        queryKey: [`users/uploadAvatar?fileName=${fileName}`],
        requestOptions: {
          body: encodedImage,
          method: "POST",
        },
      }),
    onSuccess: async () => await queryClient.invalidateQueries(["users"]),
  });
};

const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name, avatar }) =>
      defaultQueryFn({
        queryKey: ["users/updateProfile"],
        requestOptions: {
          body: JSON.stringify({ name, avatar }),
          method: "PUT",
        },
      }),
    onSuccess: async () => await queryClient.invalidateQueries(["users"]),
  });
};

export { useGetUsers, useUpdateUser, useUpdateUserAvatar };
