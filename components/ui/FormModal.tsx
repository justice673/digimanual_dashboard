'use client';

import { SlideModal } from './SlideModal';
import { Box, Button } from '@mui/material';
import { Save, X } from 'lucide-react';

interface FormModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSave?: () => void;
  saveText?: string;
  loading?: boolean;
  width?: number | string;
  submitButtonId?: string;
}

export function FormModal({
  open,
  onClose,
  title,
  children,
  onSave,
  saveText = 'Save',
  loading = false,
  width = 600,
  submitButtonId = 'hidden-submit',
}: FormModalProps) {
  return (
    <SlideModal open={open} onClose={onClose} title={title} width={width}>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ flex: 1, overflow: 'auto', mb: 3 }}>{children}</Box>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            pt: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Button
            variant="outlined"
            fullWidth
            onClick={onClose}
            disabled={loading}
            startIcon={<X size={18} />}
          >
            Cancel
          </Button>
          {onSave && (
            <Button
              variant="contained"
              fullWidth
              onClick={() => {
                const submitButton = document.getElementById(submitButtonId);
                if (submitButton) {
                  submitButton.click();
                } else {
                  onSave();
                }
              }}
              disabled={loading}
              startIcon={<Save size={18} />}
            >
              {loading ? 'Saving...' : saveText}
            </Button>
          )}
        </Box>
      </Box>
    </SlideModal>
  );
}

