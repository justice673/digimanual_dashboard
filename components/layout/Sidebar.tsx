'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Box,
  Avatar,
  Typography,
  Collapse,
  useMediaQuery,
  useTheme,
  IconButton,
} from '@mui/material';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  MessageSquare,
  MessageCircle,
  HelpCircle,
  FileText,
  Headphones,
  Shield,
  Settings,
  History,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { useSidebarStore } from '@/lib/stores/sidebarStore';
import { useState } from 'react';

const DRAWER_WIDTH = 280;
const DRAWER_WIDTH_COLLAPSED = 64;

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
  { label: 'Students', icon: <Users size={20} />, path: '/dashboard/students' },
  {
    label: 'Content',
    icon: <BookOpen size={20} />,
    path: '/dashboard/content',
    children: [
      { label: 'Manuals', icon: <BookOpen size={20} />, path: '/dashboard/content/manuals' },
    ],
  },
  {
    label: 'Community',
    icon: <MessageSquare size={20} />,
    path: '/dashboard/community',
    children: [
      { label: 'Questions', icon: <MessageSquare size={20} />, path: '/dashboard/questions' },
      { label: 'Comments', icon: <MessageCircle size={20} />, path: '/dashboard/comments' },
      { label: 'FAQs', icon: <HelpCircle size={20} />, path: '/dashboard/faqs' },
    ],
  },
  { label: 'Blogs', icon: <FileText size={20} />, path: '/dashboard/blogs' },
  { label: 'Helpdesk', icon: <Headphones size={20} />, path: '/dashboard/helpdesk' },
  { label: 'Admins', icon: <Shield size={20} />, path: '/dashboard/admins' },
  { label: 'Settings', icon: <Settings size={20} />, path: '/dashboard/settings' },
  { label: 'Activity Logs', icon: <History size={20} />, path: '/dashboard/activity-logs' },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isCollapsed, setCollapsed, isOpen, closeMobile } = useSidebarStore();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const drawerWidth = isCollapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH;

  const handleToggleSection = (label: string) => {
    setOpenSections((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const handleNavigate = (path: string) => {
    router.push(path);
    // Close sidebar on mobile after navigation
    if (isMobile) {
      closeMobile();
    }
  };

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  const renderNavItem = (item: NavItem, level: number = 0) => {
    const active = isActive(item.path);
    const hasChildren = item.children && item.children.length > 0;
    const sectionOpen = openSections[item.label] || false;

    if (hasChildren) {
      return (
        <div key={item.path}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleToggleSection(item.label)}
              sx={{
                minHeight: 48,
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                px: 2.5,
                backgroundColor: active ? 'primary.light' : 'transparent',
                '&:hover': {
                  backgroundColor: active ? 'primary.light' : 'action.hover',
                },
                pl: level > 0 ? 4 : 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: isCollapsed ? 0 : 3,
                  justifyContent: 'center',
                  color: active ? 'primary.main' : 'text.secondary',
                }}
              >
                {item.icon}
              </ListItemIcon>
              {!isCollapsed && (
                <>
                  <ListItemText primary={item.label} />
                  <ChevronDown
                    size={20}
                    style={{
                      transform: sectionOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s',
                    }}
                  />
                </>
              )}
            </ListItemButton>
          </ListItem>
          {!isCollapsed && (
            <Collapse in={sectionOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {item.children?.map((child) => renderNavItem(child, level + 1))}
              </List>
            </Collapse>
          )}
        </div>
      );
    }

    return (
      <ListItem key={item.path} disablePadding>
        <ListItemButton
          onClick={() => handleNavigate(item.path)}
          sx={{
            minHeight: 48,
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            px: 2.5,
            backgroundColor: active ? 'primary.light' : 'transparent',
            borderLeft: active ? '3px solid' : '3px solid transparent',
            borderColor: active ? 'primary.main' : 'transparent',
            '&:hover': {
              backgroundColor: active ? 'primary.light' : 'action.hover',
            },
            pl: level > 0 ? 4 : 2.5,
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: isCollapsed ? 0 : 3,
              justifyContent: 'center',
              color: active ? 'primary.main' : 'text.secondary',
            }}
          >
            {item.icon}
          </ListItemIcon>
          {!isCollapsed && <ListItemText primary={item.label} />}
        </ListItemButton>
      </ListItem>
    );
  };

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={isMobile ? isOpen : true}
      onClose={closeMobile}
      ModalProps={{
        keepMounted: true, // Better mobile performance
      }}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        display: { xs: 'block', md: 'block' },
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: 'background.paper',
          transition: 'width 0.3s ease',
          zIndex: { xs: theme.zIndex.drawer + 1, md: 'auto' },
          boxShadow: isMobile ? theme.shadows[8] : 'none',
          top: { xs: 0, md: 0 },
        },
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: { xs: 2, sm: 2 },
          minHeight: { xs: '64px !important', md: '64px !important' },
          borderBottom: isMobile ? '1px solid' : 'none',
          borderColor: 'divider',
        }}
      >
        {!isCollapsed && (
          <Typography variant="h6" sx={{ flexGrow: 1, color: 'primary.main', fontWeight: 600 }}>
            DigiManual
          </Typography>
        )}
        {isMobile ? (
          <IconButton
            onClick={closeMobile}
            sx={{
              ml: 'auto',
              color: 'text.primary',
            }}
          >
            <X size={20} />
          </IconButton>
        ) : (
          <Box
            onClick={() => setCollapsed(!isCollapsed)}
            sx={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              borderRadius: 1,
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </Box>
        )}
      </Toolbar>
      <Divider />
      <List sx={{ flexGrow: 1, py: 1 }}>
        {navItems.map((item) => renderNavItem(item))}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        {!isCollapsed ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>A</Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" noWrap sx={{ fontWeight: 500 }}>
                Admin User
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                admin@dimanual.com
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>A</Avatar>
          </Box>
        )}
      </Box>
    </Drawer>
  );
}

