'use client';

import { SlideModal } from './SlideModal';
import { Box } from '@mui/material';

interface ViewModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: number | string;
}

export function ViewModal({
  open,
  onClose,
  title,
  children,
  width = 800,
}: ViewModalProps) {
  return (
    <SlideModal open={open} onClose={onClose} title={title} width={width}>
      <Box sx={{ overflow: 'auto' }}>{children}</Box>
    </SlideModal>
  );
}

