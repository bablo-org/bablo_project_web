import * as React from 'react';
import {
  AppBar,
  Box,
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
  Menu as MenuIcon,
  Receipt as ReceiptIcon,
  History as HistoryIcon,
  Summarize as SummarizeIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material/';
import { auth, signOut } from '../services/firebase';
import { useContext, useMemo } from 'react';
import { AuthContext } from '../context/Auth';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { PATHES } from '../routes';

const drawerWidth = 240;

function AuthorizedLayout(props) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const isCurrentLocation = (item) => location.pathname === item.path;
  const listItemButtons = useMemo(
    () => [
      {
        name: 'Добавить транзакцию',
        path: PATHES.ADD_TRANSACTION,
        icon: <ReceiptIcon />,
      },
      {
        name: 'История',
        path: PATHES.HISTORY,
        icon: <HistoryIcon />,
      },
      {
        name: 'Итоги',
        path: PATHES.SUMMARY,
        icon: <SummarizeIcon />,
      },
      {
        name: 'Профиль',
        path: PATHES.PROFILE,
        icon: <AccountCircleIcon />,
      },
    ],
    []
  );

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const pageHeader = useMemo(() => {
    const title = "Bablo Project"
    switch (location.pathname) {
      case '/':
      case PATHES.ADD_TRANSACTION:
        return title.concat(": Создать транзакцию");
      case PATHES.HISTORY:
        return title.concat(": История")
      case PATHES.SUMMARY:
        return title.concat(": Итоги")
      case PATHES.PROFILE:
        return title.concat(": Профиль")
      default:
        return title;
    }
  }, [location.pathname]);

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {listItemButtons.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton
              onClick={() => {
                navigate(item.path);
                mobileOpen && setMobileOpen(false);
              }}
              selected={isCurrentLocation(item)}
            >
              <ListItemIcon
                sx={{ color: isCurrentLocation(item) && '#1976d2' }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem key={'Выйти'} disablePadding>
          <ListItemButton
            onClick={() =>
              signOut(auth).then(() => {
                authContext.setUser(null);
              })
            }
          >
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary={'Выйти'} />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {pageHeader}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          variant="temporary"
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
          variant="permanent"
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
        component="main"
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
  );
}

export default AuthorizedLayout;
