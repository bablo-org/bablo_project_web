import { Grid, Typography, Chip } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CheckIcon from '@mui/icons-material/Check';
import BorderBox from '../UI/BorderBox';
import UserAvatar from '../UserAvatar/UserAvatar';
import User from '../../models/User';

interface ContactCardProps {
  user: User;
  showAddToContactsButton: boolean;
  isRequestSent: boolean;
  isButtonLoading: boolean;
  isAlreadyInContacts: boolean;
  onAddToContactsHandler: (user: User) => Promise<void>;
}

function ContactCard({
  user,
  showAddToContactsButton,
  isRequestSent,
  isButtonLoading,
  isAlreadyInContacts,
  onAddToContactsHandler,
}: ContactCardProps) {
  return (
    <Grid container justifyContent='center'>
      <Grid item xs={12} md={10}>
        <BorderBox
          borderRadius={2}
          marginProp={2}
          style={{
            padding: 4,
            margin: 4,
          }}
        >
          <Grid container justifyContent='center'>
            <Grid item xs={6}>
              <UserAvatar
                avatarUrl={user.avatar}
                xs={50}
                md={70}
                sm={70}
                name=''
                id={user.id}
              />
              <Typography marginTop={1} variant='h5'>
                {user.name}
              </Typography>
            </Grid>
            {/* Do not show button if current user equals user id in query param */}
            {showAddToContactsButton && (
              <Grid item xs={6} alignSelf='center'>
                <LoadingButton
                  loading={isButtonLoading}
                  disabled={isRequestSent}
                  variant='contained'
                  color='success'
                  onClick={() => onAddToContactsHandler(user)}
                  endIcon={isRequestSent ? <CheckIcon /> : <PersonAddIcon />}
                >
                  {isRequestSent ? 'Запрос отправлен' : 'Добавить в контакты'}
                </LoadingButton>
              </Grid>
            )}
            {isAlreadyInContacts && (
              <Grid item xs={6} alignSelf='center'>
                <Chip label='Добавлен' color='success' icon={<CheckIcon />} />
              </Grid>
            )}
          </Grid>
        </BorderBox>
      </Grid>
    </Grid>
  );
}

export default ContactCard;
