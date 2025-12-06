'use client';

import { Box, Button, Typography } from '@mui/material';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { SlideModal } from './SlideModal';

interface ConfirmDeleteProps {
  open: boolean;
  title: string;
  message: string;
  itemName?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}

export function ConfirmDelete({
  open,
  title,
  message,
  itemName,
  onConfirm,
  onCancel,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  loading = false,
}: ConfirmDeleteProps) {
  return (
    <SlideModal open={open} onClose={onCancel} title={title} width={400}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 64,
            height: 64,
            borderRadius: '50%',
            bgcolor: 'error.light',
            color: 'error.main',
            mx: 'auto',
          }}
        >
          <AlertTriangle size={32} />
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            {message}
          </Typography>
          {itemName && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              "{itemName}"
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            This action cannot be undone.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button
            variant="outlined"
            fullWidth
            onClick={onCancel}
            disabled={loading}
            startIcon={<X size={18} />}
          >
            {cancelText}
          </Button>
          <Button
            variant="contained"
            color="error"
            fullWidth
            onClick={onConfirm}
            disabled={loading}
            startIcon={<Trash2 size={18} />}
          >
            {loading ? 'Deleting...' : confirmText}
          </Button>
        </Box>
      </Box>
    </SlideModal>
  );
}

