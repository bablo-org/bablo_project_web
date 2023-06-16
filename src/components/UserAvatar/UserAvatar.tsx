import { Avatar, Badge, SxProps, Theme } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface UserAvatarProps {
  name: string;
  id: string;
  toggleSelectedId?: (id: string) => void;
  isActive?: boolean;
  isDisabled?: boolean;
  avatarUrl?: string;
  xs: number;
  sm: number;
  md: number;
  style?: SxProps<Theme>;
}

function UserAvatar({
  name,
  id,
  toggleSelectedId,
  isActive = false,
  isDisabled,
  avatarUrl,
  xs,
  sm,
  md,
  style = {},
}: UserAvatarProps) {
  const onAvatarClicked = () => {
    toggleSelectedId?.(id);
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
        sizes='responsive'
        variant='rounded'
        sx={{
          backgroundColor: isDisabled ? 'grey' : '#1976d2',
          backgroundImage: `url(${avatarUrl})`,
          opacity: isDisabled ? '0.3' : '1',
          backgroundSize: 'cover',
          fontSize: {
            xs: 'clamp(10px, 1.5vw, 14px)',
            md: 'clamp(12px, 2.5vw, 16px)',
          },
          width: { xs, sm, md },
          height: { xs, sm, md },
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
          ...style,
        }}
        onClick={onAvatarClicked}
      >
        {name === '' ? (
          <div />
        ) : (
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
        )}
      </Avatar>
    </Badge>
  );
}

export default UserAvatar;
