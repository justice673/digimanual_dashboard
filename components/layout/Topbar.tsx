'use client';

import {
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Search as SearchIcon,
  Bell,
  LogOut,
  Settings,
  Menu as MenuIcon,
} from 'lucide-react';
import { styled, alpha } from '@mui/material/styles';
import { useUserStore } from '@/lib/stores/userStore';
import { useSidebarStore } from '@/lib/stores/sidebarStore';
import { DateFilter } from '@/components/ui/DateFilter';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.05),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.black, 0.08),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
    maxWidth: '400px',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

export function Topbar() {
  const { user, logout } = useUserStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isCollapsed, toggle } = useSidebarStore();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);

  const sidebarWidth = isMobile ? 0 : isCollapsed ? 64 : 280;

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchor(null);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
    handleMenuClose();
  };

  const isMenuOpen = Boolean(anchorEl);
  const isNotificationMenuOpen = Boolean(notificationAnchor);

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { xs: '100%', md: `calc(100% - ${sidebarWidth}px)` },
        ml: { xs: 0, md: `${sidebarWidth}px` },
        backgroundColor: 'background.paper',
        color: 'text.primary',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        transition: 'width 0.3s ease, margin-left 0.3s ease',
        zIndex: (theme) => theme.zIndex.appBar,
      }}
    >
      <Toolbar>
        {isMobile && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon size={24} />
          </IconButton>
        )}
        <Search>
          <SearchIconWrapper>
            <SearchIcon size={20} />
          </SearchIconWrapper>
          <StyledInputBase placeholder="Search..." inputProps={{ 'aria-label': 'search' }} />
        </Search>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <DateFilter />
          </Box>
          <IconButton
            size="medium"
            aria-label="show notifications"
            color="inherit"
            onClick={handleNotificationMenuOpen}
            sx={{ 
              width: { xs: 40, sm: 48 },
              height: { xs: 40, sm: 48 },
            }}
          >
            <Badge badgeContent={4} color="error">
              <Bell size={20} />
            </Badge>
          </IconButton>
          <IconButton
            size="medium"
            edge="end"
            aria-label="account menu"
            aria-controls={isMenuOpen ? 'account-menu' : undefined}
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
            sx={{ 
              width: { xs: 40, sm: 48 },
              height: { xs: 40, sm: 48 },
              p: 0,
            }}
          >
            <Avatar sx={{ width: { xs: 32, sm: 36 }, height: { xs: 32, sm: 36 }, bgcolor: 'primary.main' }}>
              {user?.name?.[0] || 'A'}
            </Avatar>
          </IconButton>
        </Box>
        <Menu
          anchorEl={anchorEl}
          open={isMenuOpen}
          onClose={handleMenuClose}
          onClick={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={() => router.push('/dashboard/settings')}>
            <Settings size={18} style={{ marginRight: 8 }} />
            Settings
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <LogOut size={18} style={{ marginRight: 8 }} />
            Logout
          </MenuItem>
        </Menu>
        <Menu
          anchorEl={notificationAnchor}
          open={isNotificationMenuOpen}
          onClose={handleNotificationMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleNotificationMenuClose}>
            <Typography variant="body2">No new notifications</Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

