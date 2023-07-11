import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Logout from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGetCurrentUser } from '../../queries/users';
import { PATHES } from '../../routes';
import { logout } from '../../services/firebase';
import { useAppDispatch } from '../../store/hooks';
import { showSnackbarMessage } from '../../store/slices/snackbarMessage';
import { SnackbarSeverity } from '../../models/enums/SnackbarSeverity';

export default function AccountMenu() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: user } = useGetCurrentUser();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOnMyAccountClick = () => {
    navigate(PATHES.PROFILE);
    handleClose();
  };

  const handleOnLogoutClick = () => {
    logout().catch(() => {
      dispatch(
        showSnackbarMessage({
          severity: SnackbarSeverity.ERROR,
          message: t('accountMenu.tryLater'),
        }),
      );
    });
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title={t('accountMenu.accountSettings')}>
          <IconButton
            onClick={handleClick}
            size='small'
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup='true'
            aria-expanded={open ? 'true' : undefined}
          >
            {user && (
              <Avatar sx={{ width: 45, height: 45 }} src={user?.avatar}>
                {user?.name.substring(0, 1)}
              </Avatar>
            )}
            {!user && <Avatar sx={{ width: 45, height: 45 }} />}
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id='account-menu'
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleOnMyAccountClick}>
          <Avatar /> {t('accountMenu.myProfile')}
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleOnLogoutClick}>
          <ListItemIcon>
            <Logout fontSize='small' />
          </ListItemIcon>
          {t('accountMenu.logout')}
        </MenuItem>
      </Menu>
    </>
  );
}
