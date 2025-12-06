'use client';

import { Box, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { Toaster } from 'sonner';
import { useSidebarStore } from '@/lib/stores/sidebarStore';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isCollapsed } = useSidebarStore();
  const sidebarWidth = isMobile ? 0 : isCollapsed ? 64 : 280;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { xs: '100%', md: `calc(100% - ${sidebarWidth}px)` },
          backgroundColor: 'background.default',
          transition: 'width 0.3s ease',
        }}
      >
        <Topbar />
        <Toolbar />
        <Box sx={{ p: { xs: 2, sm: 3 } }}>{children}</Box>
      </Box>
      <Toaster position="top-right" richColors />
    </Box>
  );
}

