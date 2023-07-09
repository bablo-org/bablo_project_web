import { Grid } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { UserInfoParams } from '.';
import { useGetUserById, useGetUsers } from '../queries';
import { useGetContactsRequests } from '../queries/contacts';
import { useAppSelector } from '../store/hooks';
import ContactCard from '../components/ContactCard/ContactCard';
import useAddToContacts from '../hooks/useAddToContacts';

function UserInfoPage() {
  const { user } = useAppSelector((state) => state.auth);
  const params = useParams<UserInfoParams>();
  const { data: users, isLoading: isUsersLoading } = useGetUsers();
  const { data: foundUser, isLoading: isFoundUserLoading } = useGetUserById(
    params?.id || '',
  );
  const { data: requests, isLoading: isRequestsLoaing } =
    useGetContactsRequests();

  const { onAddToContactsHandler, isLoading: isAddToContactsLoading } =
    useAddToContacts();

  const currentUser = useMemo(
    () => users?.find((item) => item.id === user?.uid),
    [users],
  );

  const isLoading = useMemo(
    () => isFoundUserLoading || isUsersLoading || isRequestsLoaing,
    [isFoundUserLoading, isRequestsLoaing, isUsersLoading],
  );

  const isRequestSent = useMemo(() => {
    return requests?.some((item) => item.receiver === params.id) || false;
  }, [requests, params.id]);

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
