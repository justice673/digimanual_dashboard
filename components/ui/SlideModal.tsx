'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Drawer,
  IconButton,
  Typography,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { X } from 'lucide-react';

interface SlideModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  anchor?: 'left' | 'right' | 'top' | 'bottom';
  width?: number | string;
  height?: number | string;
}

export function SlideModal({
  open,
  onClose,
  title,
  children,
  anchor = 'right',
  width = 500,
  height = '100%',
}: SlideModalProps) {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  const isMobile = mounted && matches;
  const modalWidth = isMobile ? '100%' : width;

  return (
    <Drawer
      anchor={anchor}
      open={open}
      onClose={onClose}
      sx={{
        zIndex: { xs: theme.zIndex.drawer + 2, sm: theme.zIndex.modal },
        '& .MuiDrawer-paper': {
          width: anchor === 'left' || anchor === 'right' ? modalWidth : '100%',
          height: anchor === 'top' || anchor === 'bottom' ? height : '100%',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          zIndex: { xs: theme.zIndex.drawer + 2, sm: theme.zIndex.modal },
        },
        '& .MuiBackdrop-root': {
          zIndex: { xs: theme.zIndex.drawer + 1, sm: theme.zIndex.modal - 1 },
        },
      }}
      ModalProps={{
        keepMounted: false,
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: { xs: 2, sm: 3 },
            borderBottom: '1px solid',
            borderColor: 'divider',
            position: 'sticky',
            top: 0,
            backgroundColor: 'background.paper',
            zIndex: 1,
            minHeight: { xs: 56, sm: 64 },
          }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600, 
              fontSize: { xs: '1rem', sm: '1.25rem' }, 
              flex: 1, 
              pr: 2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {title}
          </Typography>
          <IconButton 
            onClick={onClose} 
            size={isMobile ? 'medium' : 'small'}
            sx={{
              color: 'text.primary',
              backgroundColor: { xs: 'rgba(0, 0, 0, 0.08)', sm: 'transparent' },
              border: { xs: '1px solid', sm: 'none' },
              borderColor: { xs: 'divider', sm: 'transparent' },
              '&:hover': {
                backgroundColor: 'action.hover',
              },
              minWidth: { xs: 44, sm: 32 },
              minHeight: { xs: 44, sm: 32 },
              flexShrink: 0,
              boxShadow: { xs: '0 2px 4px rgba(0,0,0,0.1)', sm: 'none' },
            }}
            aria-label="Close"
          >
            <X size={isMobile ? 24 : 20} strokeWidth={2.5} />
          </IconButton>
        </Box>
        <Box sx={{ flex: 1, overflow: 'auto', p: { xs: 2, sm: 3 } }}>{children}</Box>
      </Box>
    </Drawer>
  );
}

