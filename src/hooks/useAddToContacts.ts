import { useState } from 'react';
import { SnackbarSeverity } from '../models/enums/SnackbarSeverity';
import {
  useAcceptContactRequest,
  useGetContactsRequests,
  usePostContactRequest,
} from '../queries/contacts';
import { useAppDispatch } from '../store/hooks';
import { showSnackbarMessage } from '../store/slices/snackbarMessage';
import User from '../models/User';

const useAddToContacts = () => {
  const dispatch = useAppDispatch();
  const { data: requests } = useGetContactsRequests();
  const { mutateAsync: sendContactRequest } = usePostContactRequest();
  const { mutateAsync: acceptContactRequest } = useAcceptContactRequest();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onAddToContactsHandler = async (userToAdd: User) => {
    if (!userToAdd || !requests) {
      return;
    }
    try {
      setIsLoading(true);
      // Если запрос уже отправлен, то просто принимаем его
      if (requests?.some((item) => item.sender === userToAdd.id)) {
        const requestId = requests.find(
          (item) => item.sender === userToAdd.id,
        )?.id;
        if (!requestId) {
          return;
        }
        await acceptContactRequest({
          id: requestId,
        });
        dispatch(
          showSnackbarMessage({
            message: 'Контакт добавлен',
            severity: SnackbarSeverity.SUCCESS,
          }),
        );
        return;
      }
      // Если нет входящего запроса, то отправляем запрос
      await sendContactRequest({
        receiver: userToAdd.id,
      });
      dispatch(
        showSnackbarMessage({
          message: 'Запрос отправлен',
          severity: SnackbarSeverity.SUCCESS,
        }),
      );
    } catch (error) {
      console.warn(error);
      dispatch(
        showSnackbarMessage({
          message: 'Не удалось добавить контакт, попробуй позже',
          severity: SnackbarSeverity.ERROR,
        }),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    onAddToContactsHandler,
    isLoading,
  };
};

export default useAddToContacts;
