'use client';

import { SlideModal } from './SlideModal';
import { Box } from '@mui/material';

interface FilterModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function FilterModal({ open, onClose, children }: FilterModalProps) {
  return (
    <SlideModal open={open} onClose={onClose} title="Filters" anchor="bottom" height="auto">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pb: 2 }}>{children}</Box>
    </SlideModal>
  );
}

