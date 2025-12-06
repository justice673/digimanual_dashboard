'use client';

import { Chip } from '@mui/material';

interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'pending' | 'approved' | 'rejected' | 'draft' | 'published' | 'expired' | 'none';
  label?: string;
}

const statusConfig: Record<string, { color: 'success' | 'error' | 'warning' | 'default' | 'info'; label: string }> = {
  active: { color: 'success', label: 'Active' },
  inactive: { color: 'error', label: 'Inactive' },
  pending: { color: 'warning', label: 'Pending' },
  approved: { color: 'success', label: 'Approved' },
  rejected: { color: 'error', label: 'Rejected' },
  draft: { color: 'default', label: 'Draft' },
  published: { color: 'success', label: 'Published' },
  expired: { color: 'warning', label: 'Expired' },
  none: { color: 'default', label: 'None' },
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const config = statusConfig[status] || { color: 'default' as const, label: status };
  return (
    <Chip
      label={label || config.label}
      color={config.color}
      size="small"
      sx={{
        fontWeight: 500,
        textTransform: 'capitalize',
      }}
    />
  );
}

