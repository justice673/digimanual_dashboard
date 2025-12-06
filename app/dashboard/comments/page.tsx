'use client';

import { useState, useMemo } from 'react';
import {
  Typography,
  Box,
  TextField,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Search } from 'lucide-react';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { mockComments } from '@/lib/data/mockComments';
import { Comment } from '@/lib/data/mockComments';
import { toast } from 'sonner';

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [entityFilter, setEntityFilter] = useState<'all' | 'manual' | 'question' | 'blog'>('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filteredComments = useMemo(() => {
    return comments.filter((comment) => {
      const matchesSearch = comment.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || comment.status === statusFilter;
      const matchesEntity = entityFilter === 'all' || comment.entityType === entityFilter;
      return matchesSearch && matchesStatus && matchesEntity;
    });
  }, [comments, searchQuery, statusFilter, entityFilter]);

  // Get available options from filtered data (after search)
  const availableStatuses = useMemo(() => {
    const searchFiltered = comments.filter((comment) => {
      return comment.content.toLowerCase().includes(searchQuery.toLowerCase());
    });
    return Array.from(new Set(searchFiltered.map((c) => c.status)));
  }, [comments, searchQuery]);

  const availableEntityTypes = useMemo(() => {
    const searchFiltered = comments.filter((comment) => {
      return comment.content.toLowerCase().includes(searchQuery.toLowerCase());
    });
    return Array.from(new Set(searchFiltered.map((c) => c.entityType)));
  }, [comments, searchQuery]);

  const handleApprove = (comment: Comment) => {
    setComments(comments.map((c) => (c.id === comment.id ? { ...c, status: 'approved' as const } : c)));
    toast.success('Comment approved');
  };

  const handleReject = (comment: Comment) => {
    setComments(comments.map((c) => (c.id === comment.id ? { ...c, status: 'rejected' as const } : c)));
    toast.success('Comment rejected');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const columns = [
    { id: 'content', label: 'Comment', minWidth: 300 },
    { id: 'userName', label: 'User', minWidth: 150 },
    {
      id: 'entityType',
      label: 'Type',
      minWidth: 100,
      format: (value: string) => value.charAt(0).toUpperCase() + value.slice(1),
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 100,
      align: 'center' as const,
      format: (value: string) => <StatusBadge status={value as any} />,
    },
    {
      id: 'createdAt',
      label: 'Created',
      minWidth: 120,
      format: (value: string) => formatDate(value),
    },
  ];

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
        Comments Moderation
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            placeholder="Search comments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <Search size={20} style={{ marginRight: 8, color: 'inherit', opacity: 0.6 }} />,
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value as any)}>
              <MenuItem value="all">All ({comments.length})</MenuItem>
              {availableStatuses.map((status) => {
                const count = comments.filter((c) => c.status === status).length;
                return (
                  <MenuItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)} ({count})
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Entity Type</InputLabel>
            <Select value={entityFilter} label="Entity Type" onChange={(e) => setEntityFilter(e.target.value as any)}>
              <MenuItem value="all">All ({comments.length})</MenuItem>
              {availableEntityTypes.map((entityType) => {
                const count = comments.filter((c) => c.entityType === entityType).length;
                return (
                  <MenuItem key={entityType} value={entityType}>
                    {entityType.charAt(0).toUpperCase() + entityType.slice(1)} ({count})
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <DataTable
        columns={columns}
        rows={filteredComments}
        onView={(row) => {
          toast.info(`Viewing comment by ${row.userName}`);
        }}
        onEdit={(row) => handleApprove(row)}
        onDelete={(row) => handleReject(row)}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={setRowsPerPage}
      />
    </Box>
  );
}
