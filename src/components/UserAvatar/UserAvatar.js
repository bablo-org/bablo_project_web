import { Avatar, Badge } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function UserAvatar({
  name,
  id,
  toggleSelectedId,
  isActive,
  isBlocked,
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
          color="success"
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
        size="responsive"
        variant="rounded"
        sx={{
          backgroundColor: isBlocked ? 'grey' : '#1976d2',
          backgroundImage: `url(${avatarUrl})`,
          opacity: isBlocked && '0.3',
          backgroundSize: 'cover',
          fontSize:
            name.length < 6
              ? {
                  xs: 'clamp(12px, 1.5vw, 16px)',
                  md: 'clamp(14px, 2.5vw, 18px)',
                }
              : {
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
        onClick={!isBlocked ? onAvatarClicked : undefined}
      >
        {name}
      </Avatar>
    </Badge>
  );
}

export default UserAvatar;
