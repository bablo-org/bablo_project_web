import { Badge } from '@mui/material';
import { DisabledByDefault as DisabledByDefaultIcon } from '@mui/icons-material';
import UserAvatar from '../../UserAvatar/UserAvatar';

function UserProfileAvatar({ currentUser, deleteAvatar }) {
  return (
    <Badge
      invisible={!currentUser.avatar}
      onClick={(event) => {
        if (!event.target.closest('.MuiAvatar-root')) {
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
        key={currentUser.id}
        name={currentUser.name}
        id={currentUser.id}
        avatarUrl={currentUser.avatar}
      />
    </Badge>
  );
}

export default UserProfileAvatar;
