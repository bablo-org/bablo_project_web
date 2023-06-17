import { Button, Grid, Typography } from '@mui/material';
import { useCallback, useMemo } from 'react';
import BorderBox from '../components/UI/BorderBox';
import { useGetUsers } from '../queries';
import { useGetContactsRequests } from '../queries/contacts';
import { useAppSelector } from '../store/hooks';
import ContactCard from '../components/ContactCard/ContactCard';
import useAddToContacts from '../hooks/useAddToContacts';

function ContactsPage() {
  const { user } = useAppSelector((state) => state.auth);
  const { data: users, isLoading: isUsersLoading } = useGetUsers();
  const { data: contactsRequests, isLoading: isContactsRequestsLoading } =
    useGetContactsRequests();
  const { onAddToContactsHandler, isLoading: showLoaderOnButton } =
    useAddToContacts();

  const currentUser = useMemo(
    () => users?.find((item) => item.id === user?.uid),
    [users, user],
  );
  const incomingRequests = useMemo(() => {
    if (!contactsRequests) {
      return [];
    }
    return contactsRequests.filter((item) => item.receiver === user?.uid);
  }, [contactsRequests, user]);

  const outcomingRequests = useMemo(() => {
    if (!contactsRequests) {
      return [];
    }
    return contactsRequests.filter((item) => item.sender === user?.uid);
  }, [contactsRequests, user]);

  const outcomingRequestUsers = useMemo(() => {
    if (!users) {
      return [];
    }
    return users.filter((item) => {
      return outcomingRequests.some((request) => request.receiver === item.id);
    });
  }, [outcomingRequests, users]);

  const incomingRequestUsers = useMemo(() => {
    if (!users) {
      return [];
    }
    return users.filter((item) => {
      return incomingRequests.some((request) => request.sender === item.id);
    });
  }, [incomingRequests, users]);

  const contacts = useMemo(() => {
    if (!users) {
      return [];
    }
    if (!currentUser?.privateData?.network?.partners) {
      return [];
    }
    const contactsIds = Object.keys(
      currentUser?.privateData?.network?.partners,
    );
    return users.filter((item) => {
      return contactsIds.includes(item.id);
    });
  }, [currentUser, users]);

  const isLoading = useMemo(
    () => isUsersLoading || isContactsRequestsLoading,
    [isUsersLoading, isContactsRequestsLoading],
  );

  const isRequestSent = useCallback(
    (userId: string) => {
      return (
        contactsRequests?.some((item) => item.receiver === userId) || false
      );
    },
    [contactsRequests],
  );

  if (isLoading || !currentUser) {
    return <div>Загрузка...</div>;
  }

  return (
    <>
      <BorderBox
        borderRadius={2}
        marginProp={0}
        style={{
          padding: 2,
        }}
      >
        <Grid container spacing={0} direction='column' alignItems='flex-start'>
          <Grid item xs={12}>
            <Typography variant='body1' textAlign='left'>
              Чтобы добавить контакт, перешли ссылку на свой профиль другому
              пользователю
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant='contained'
              color='primary'
              style={{ marginTop: 10 }}
              onClick={() => {
                navigator.clipboard.writeText(
                  `https://bablo-project.web.app/user/${currentUser?.id}`,
                );
              }}
            >
              Скопировать ссылку
            </Button>
          </Grid>
        </Grid>
      </BorderBox>
      {incomingRequestUsers.length > 0 && (
        <BorderBox
          borderRadius={2}
          marginProp={0}
          style={{
            padding: 2,
            marginTop: 2,
          }}
        >
          <Grid container spacing={0} direction='row' alignItems='flex-start'>
            <Typography variant='h6' textAlign='left'>
              Входящие запросы
            </Typography>
            <Grid item xs={12}>
              {incomingRequestUsers.map((item) => {
                return (
                  <ContactCard
                    isRequestSent={false}
                    isAlreadyInContacts={false}
                    key={item.id}
                    user={item}
                    isButtonLoading={false}
                    onAddToContactsHandler={() => {
                      return onAddToContactsHandler(item);
                    }}
                    showAddToContactsButton
                  />
                );
              })}
            </Grid>
          </Grid>
        </BorderBox>
      )}
      {outcomingRequestUsers.length > 0 && (
        <BorderBox
          borderRadius={2}
          marginProp={0}
          style={{
            padding: 2,
            marginTop: 2,
          }}
        >
          <Grid container spacing={0} direction='row' alignItems='flex-start'>
            <Typography variant='h6' textAlign='left'>
              Исходящие запросы
            </Typography>
            <Grid item xs={12}>
              {outcomingRequestUsers.map((item) => {
                return (
                  <ContactCard
                    isRequestSent={isRequestSent(item.id)}
                    isAlreadyInContacts={false}
                    key={item.id}
                    user={item}
                    isButtonLoading={showLoaderOnButton}
                    onAddToContactsHandler={() => new Promise(() => {})}
                    showAddToContactsButton
                  />
                );
              })}
            </Grid>
          </Grid>
        </BorderBox>
      )}
      <BorderBox
        borderRadius={2}
        marginProp={0}
        style={{
          padding: 2,
          marginTop: 2,
        }}
      >
        <Grid container spacing={0} direction='row' alignItems='flex-start'>
          <Typography variant='h6' textAlign='left'>
            Контакты
          </Typography>
          <Grid item xs={12}>
            {contacts.map((item) => {
              return (
                <ContactCard
                  isRequestSent={isRequestSent(item.id)}
                  isAlreadyInContacts
                  key={item.id}
                  user={item}
                  isButtonLoading={false}
                  onAddToContactsHandler={() => new Promise(() => {})}
                  showAddToContactsButton={false}
                />
              );
            })}
          </Grid>
          {contacts.length === 0 && (
            <Typography variant='body1' textAlign='left'>
              У тебя пока нет контактов
            </Typography>
          )}
        </Grid>
      </BorderBox>
    </>
  );
}

export default ContactsPage;
