import { Badge } from '@mui/material';
import { DisabledByDefault as DisabledByDefaultIcon } from '@mui/icons-material';
import UserAvatar from '../../UserAvatar/UserAvatar';
import User from '../../../models/User';

interface Props {
  currentUser: User;
  deleteAvatar: () => void;
}

function UserProfileAvatar({ currentUser, deleteAvatar }: Props) {
  return (
    <Badge
      invisible={!currentUser.avatar}
      onClick={(event) => {
        if (!(event.target as HTMLElement).closest('.MuiAvatar-root')) {
          deleteAvatar();
        }
      }}
      badgeContent={
        <DisabledByDefaultIcon
          color='error'
          sx={{
            cursor: 'pointer !important',
            fontSize: '24px',
            '@media (max-width: 600px)': {
              fontSize: 'small',
            },
          }}
        />
      }
    >
      <UserAvatar
        xs={50}
        sm={70}
        md={100}
        key={currentUser.id}
        name={currentUser.name}
        id={currentUser.id}
        avatarUrl={currentUser.avatar}
      />
    </Badge>
  );
}

export default UserProfileAvatar;
