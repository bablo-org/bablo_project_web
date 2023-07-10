import {
  AppBar,
  Box,
  Collapse,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material/';
import {
  Menu,
  AddBox,
  Summarize,
  AccountCircle,
  Logout,
  Payments,
  ExpandLess,
  ExpandMore,
  Done,
  Block,
  History,
  People,
} from '@mui/icons-material/';
import { useMemo, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../services/firebase';
import { PATHES } from '../routes';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { showSnackbarMessage } from '../store/slices/snackbarMessage';
import { SnackbarSeverity } from '../models/enums/SnackbarSeverity';
import Logo from '../BabloLogo.png';
import RequestNameDialog from '../components/RequestNameDialog/RequestNameDialog';
import { useGetUsers } from '../queries';

interface ItemButton {
  name: string;
  path: string;
  icon: JSX.Element;
}
const drawerWidth = 240;

function AuthorizedLayout() {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { data: users, isFetched } = useGetUsers();
  const { user } = useAppSelector((state) => state.auth);
  const currentUser = useMemo(
    () => users?.find((item) => item.id === user?.uid),
    [users, user],
  );

  const isCurrentLocation = (item: ItemButton) => {
    return location.pathname === item.path;
  };

  const [open, setOpen] = useState(false);

  const handleClickTransactions = () => {
    if (
      (open &&
        location.pathname !==
          `${PATHES.HISTORY_HOME.HOME}/${PATHES.HISTORY_HOME.HISTORY_ACTUAL}`) ||
      (open &&
        `${PATHES.HISTORY_HOME.HOME}/${PATHES.HISTORY_HOME.HISTORY_COMPLETED}`) ||
      (open &&
        `${PATHES.HISTORY_HOME.HOME}/${PATHES.HISTORY_HOME.HISTORY_DECLINED}`)
    ) {
      setOpen(!open);
      return;
    }
    navigate(
      `${PATHES.HISTORY_HOME.HOME}/${PATHES.HISTORY_HOME.HISTORY_ACTUAL}`,
    );
    setOpen(!open);
  };

  const handleClick = (item: ItemButton) => {
    navigate(item.path);
    if (mobileOpen) {
      setMobileOpen(false);
    }
  };

  const dispatch = useAppDispatch();
  const transctionsItemButtons = useMemo(
    () => [
      {
        name: 'Актуальные',
        path: `${PATHES.HISTORY_HOME.HOME}/${PATHES.HISTORY_HOME.HISTORY_ACTUAL}`,
        icon: <Done />,
      },
      {
        name: 'Отклоненные',
        path: `${PATHES.HISTORY_HOME.HOME}/${PATHES.HISTORY_HOME.HISTORY_DECLINED}`,
        icon: <Block />,
      },
      {
        name: 'Завершенные',
        path: `${PATHES.HISTORY_HOME.HOME}/${PATHES.HISTORY_HOME.HISTORY_COMPLETED}`,
        icon: <History />,
      },
    ],
    [],
  );
  const listItemButtons: ItemButton[] = useMemo(
    () => [
      {
        name: 'Добавить транзакцию',
        path: PATHES.ADD_TRANSACTION,
        icon: <AddBox />,
      },
      {
        name: 'Транзакции',
        path: `${PATHES.HISTORY_HOME}/${PATHES.HISTORY_HOME.HISTORY_ACTUAL}`,
        icon: <Payments />,
      },
      {
        name: 'Итоги',
        path: PATHES.SUMMARY,
        icon: <Summarize />,
      },
      {
        name: 'Профиль',
        path: PATHES.PROFILE,
        icon: <AccountCircle />,
      },
      {
        name: 'Контакты',
        path: PATHES.CONTACTS,
        icon: <People />,
      },
    ],
    [],
  );

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const pageHeader = useMemo(() => {
    if (location.pathname.includes('/user/')) {
      return 'Профиль пользователя';
    }

    switch (location.pathname) {
      case '/add':
      case PATHES.ADD_TRANSACTION:
        return 'Создать транзакцию';
      case `${PATHES.HISTORY_HOME.HOME}/${PATHES.HISTORY_HOME.HISTORY_ACTUAL}`:
        return 'Актуальные транзакции';
      case `${PATHES.HISTORY_HOME.HOME}/${PATHES.HISTORY_HOME.HISTORY_COMPLETED}`:
        return 'Завершенные транзакции';
      case `${PATHES.HISTORY_HOME.HOME}/${PATHES.HISTORY_HOME.HISTORY_DECLINED}`:
        return 'Отклоненные транзакции';
      case PATHES.SUMMARY:
        return 'Итоги';
      case PATHES.PROFILE:
        return 'Профиль';
      case PATHES.CONTACTS:
        return 'Контакты';
      default:
        return 'Bablo Project';
    }
  }, [location.pathname]);

  const optionalList = (
    <List component='div' disablePadding>
      {transctionsItemButtons.map((item) => (
        <ListItem key={item.name} disablePadding>
          <ListItemButton
            sx={{ pl: 4 }}
            onClick={() => {
              navigate(item.path);
              if (mobileOpen) {
                setMobileOpen(false);
              }
            }}
            selected={isCurrentLocation(item)}
          >
            <ListItemIcon
              sx={isCurrentLocation(item) ? { color: '#1976d2' } : undefined}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.name} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );

  const drawer = (
    <div>
      <IconButton
        onClick={() => navigate('/')}
        sx={{ ':hover': { backgroundColor: 'transparent' } }}
      >
        <Box
          sx={{
            backgroundImage: `url(${Logo})`,
            backgroundSize: 'contain',
            width: { xs: 150 },
            height: { xs: 150 },
            margin: 'auto',
          }}
        />
      </IconButton>
      <Divider />
      <List>
        {listItemButtons.map((item) => {
          return (
            <>
              <ListItem key={item.name} disablePadding>
                <ListItemButton
                  onClick={
                    item.name === 'Транзакции'
                      ? handleClickTransactions
                      : () => handleClick(item)
                  }
                  selected={isCurrentLocation(item)}
                >
                  <ListItemIcon
                    sx={
                      isCurrentLocation(item) ? { color: '#1976d2' } : undefined
                    }
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.name} />
                  {item.name === 'Транзакции' &&
                    (open ? <ExpandLess /> : <ExpandMore />)}
                </ListItemButton>
              </ListItem>
              {item.name === 'Транзакции' && (
                <Collapse in={open} timeout='auto' unmountOnExit>
                  {optionalList}
                </Collapse>
              )}
            </>
          );
        })}
      </List>
      <Divider />
      <List>
        <ListItem key='Выйти' disablePadding>
          <ListItemButton
            onClick={async () => {
              logout().catch(() => {
                dispatch(
                  showSnackbarMessage({
                    severity: SnackbarSeverity.ERROR,
                    message: 'Ошибка, попробуйте позже...',
                  }),
                );
              });
            }}
          >
            <ListItemIcon>
              <Logout />
            </ListItemIcon>
            <ListItemText primary='Выйти' />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <>
      <RequestNameDialog open={!currentUser?.name && isFetched} />
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar
          position='fixed'
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
          }}
        >
          <Toolbar>
            <IconButton
              color='inherit'
              aria-label='open drawer'
              edge='start'
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <Menu />
            </IconButton>
            <Typography variant='h6' noWrap component='div'>
              {pageHeader}
            </Typography>
          </Toolbar>
        </AppBar>
        <Box
          component='nav'
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label='mailbox folders'
        >
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Drawer
            variant='temporary'
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant='permanent'
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        <Box
          component='main'
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
          }}
        >
          <Toolbar />
          <Outlet />
        </Box>
      </Box>
    </>
  );
}

export default AuthorizedLayout;
