import { Avatar, Badge } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function UserAvatar({
  name,
  id,
  toggleSelectedId,
  isActive,
  isDisabled,
  avatarUrl,
}) {
  const onAvatarClicked = () => {
    toggleSelectedId(id);
  };

  return (
    <Badge
      invisible={!isActive}
      badgeContent={
        <CheckCircleIcon
          color='success'
          sx={{
            fontSize: '24px',
            '@media (max-width: 600px)': {
              fontSize: 'small',
            },
          }}
        />
      }
    >
      <Avatar
        alt={name}
        size='responsive'
        variant='rounded'
        sx={{
          backgroundColor: isDisabled ? 'grey' : '#1976d2',
          backgroundImage: `url(${avatarUrl})`,
          opacity: isDisabled && '0.3',
          backgroundSize: 'cover',
          fontSize: {
            xs: 'clamp(10px, 1.5vw, 14px)',
            md: 'clamp(12px, 2.5vw, 16px)',
          },
          width: { xs: 50, sm: 70, md: 100 },
          height: { xs: 50, sm: 70, md: 100 },
          marginLeft: { xs: 0.8, sm: 1.3, md: 4 },
          marginRight: { xs: 0.8, sm: 1.3, md: 4 },
          boxShadow: '3px 3px 15px rgba(0, 0, 0, 0.5)',
          transform: isActive ? 'scale(1.1)' : 'scale(1.0)',
          transition: 'transform 0.2s',
          '@media (max-width: 600px)': {
            '&:active': {
              transform: 'scale(1.1)',
            },
          },
          '@media (min-width: 601px)': {
            '&:hover': {
              transform: 'scale(1.1)',
            },
          },
        }}
        onClick={onAvatarClicked}
      >
        <div
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            width: '90%',
            borderRadius: '4px',
            padding: '4px',
          }}
        >
          {name}
        </div>
      </Avatar>
    </Badge>
  );
}

export default UserAvatar;
