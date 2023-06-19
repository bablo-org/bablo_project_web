import { Grid } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { UserInfoParams } from '.';
import { useGetUsers } from '../queries';
import {
  // useAcceptContactRequest,
  useGetContactsRequests,
  // usePostContactRequest,
} from '../queries/contacts';
import { useAppSelector } from '../store/hooks';
// import { showSnackbarMessage } from '../store/slices/snackbarMessage';
// import { SnackbarSeverity } from '../models/enums/SnackbarSeverity';
import ContactCard from '../components/ContactCard/ContactCard';
import useAddToContacts from '../hooks/useAddToContacts';

function UserInfoPage() {
  // const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const params = useParams<UserInfoParams>();
  // const [showButtonLoading, setShowButtonLoading] = useState(false);
  const { data: users, isLoading: isUsersLoading } = useGetUsers();
  const { data: requests, isLoading: isRequestsLoaing } =
    useGetContactsRequests();
  // const { mutateAsync: sendContactRequest } = usePostContactRequest();
  // const { mutateAsync: acceptContactRequest } = useAcceptContactRequest();

  const { onAddToContactsHandler, isLoading: isAddToContactsLoading } =
    useAddToContacts();

  const currentUser = useMemo(
    () => users?.find((item) => item.id === user?.uid),
    [users],
  );

  const foundUser = useMemo(() => {
    return users?.find((item) => item.id === params.id);
  }, [users, params]);

  const isLoading = useMemo(
    () => isUsersLoading || isRequestsLoaing,
    [isUsersLoading, isRequestsLoaing],
  );

  const isRequestSent = useMemo(() => {
    return requests?.some((item) => item.receiver === params.id) || false;
  }, [requests, params.id]);

  // const isRequestRecieved = useMemo(() => {
  //   return requests?.some((item) => item.sender === params.id);
  // }, [requests, params.id]);

  const isAlreadyInContacts = useMemo(() => {
    if (!currentUser?.privateData?.network?.partners) {
      return false;
    }
    if (!params?.id) {
      return false;
    }

    return Object.keys(currentUser?.privateData?.network?.partners).includes(
      params.id,
    );
  }, [users, params.id, currentUser]);

  const showAddToContactsButton = useMemo(() => {
    if (foundUser?.id === user?.uid) {
      return false;
    }
    if (isAlreadyInContacts) {
      return false;
    }
    return true;
  }, [isAlreadyInContacts, foundUser, user]);

  // const onAddToContactsHandler = async () => {
  //   if (!foundUser || !requests) {
  //     return;
  //   }
  //   try {
  //     setShowButtonLoading(true);
  //     // Если запрос уже отправлен, то просто принимаем его
  //     if (isRequestRecieved) {
  //       const requestId = requests.find(
  //         (item) => item.sender === params.id,
  //       )?.id;
  //       if (!requestId) {
  //         return;
  //       }
  //       await acceptContactRequest({
  //         id: requestId,
  //       });
  //       dispatch(
  //         showSnackbarMessage({
  //           message: 'Контакт добавлен',
  //           severity: SnackbarSeverity.SUCCESS,
  //         }),
  //       );
  //       return;
  //     }
  //     // Если нет входящего запроса, то отправляем запрос
  //     await sendContactRequest({
  //       receiver: foundUser.id,
  //     });
  //     dispatch(
  //       showSnackbarMessage({
  //         message: 'Запрос отправлен',
  //         severity: SnackbarSeverity.SUCCESS,
  //       }),
  //     );
  //   } catch (error) {
  //     dispatch(
  //       showSnackbarMessage({
  //         message: 'Не удалось добавить контакт, попробуй позже',
  //         severity: SnackbarSeverity.ERROR,
  //       }),
  //     );
  //   } finally {
  //     setShowButtonLoading(false);
  //   }
  // };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!foundUser) {
    return <div>Not found</div>;
  }

  return (
    <Grid container justifyContent='center'>
      <Grid item xs={12} md={10}>
        <ContactCard
          user={foundUser}
          showAddToContactsButton={showAddToContactsButton}
          onAddToContactsHandler={() => onAddToContactsHandler(foundUser)}
          isRequestSent={isRequestSent}
          isAlreadyInContacts={isAlreadyInContacts}
          isButtonLoading={isAddToContactsLoading}
        />
      </Grid>
    </Grid>
  );
}

export default UserInfoPage;
