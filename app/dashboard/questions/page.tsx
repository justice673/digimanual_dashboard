'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Search, CheckCircle, X, Eye } from 'lucide-react';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { mockQuestions } from '@/lib/data/mockQuestions';
import { Question } from '@/lib/data/mockQuestions';
import { toast } from 'sonner';

export default function QuestionsPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>(mockQuestions);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filteredQuestions = useMemo(() => {
    return questions.filter((question) => {
      const matchesSearch =
        question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        question.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || question.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [questions, searchQuery, statusFilter]);

  // Get available statuses from filtered data (after search)
  const availableStatuses = useMemo(() => {
    const searchFiltered = questions.filter((question) => {
      const matchesSearch =
        question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        question.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
    return Array.from(new Set(searchFiltered.map((q) => q.status)));
  }, [questions, searchQuery]);

  const handleApprove = (question: Question) => {
    setQuestions(questions.map((q) => (q.id === question.id ? { ...q, status: 'approved' as const } : q)));
    toast.success('Question approved');
  };

  const handleReject = (question: Question) => {
    setQuestions(questions.map((q) => (q.id === question.id ? { ...q, status: 'rejected' as const } : q)));
    toast.success('Question rejected');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const columns = [
    { id: 'title', label: 'Title', minWidth: 200 },
    { id: 'userName', label: 'Asked By', minWidth: 150 },
    { id: 'manualName', label: 'Manual', minWidth: 200 },
    {
      id: 'status',
      label: 'Status',
      minWidth: 100,
      align: 'center' as const,
      format: (value: string) => <StatusBadge status={value as any} />,
    },
    {
      id: 'answerCount',
      label: 'Answers',
      minWidth: 80,
      align: 'center' as const,
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
        Questions Moderation
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <TextField
            fullWidth
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <Search size={20} style={{ marginRight: 8, color: 'inherit', opacity: 0.6 }} />,
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value as any)}>
              <MenuItem value="all">All ({questions.length})</MenuItem>
              {availableStatuses.map((status) => {
                const count = questions.filter((q) => q.status === status).length;
                return (
                  <MenuItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)} ({count})
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <DataTable
        columns={columns}
        rows={filteredQuestions}
        onView={(row) => {
          // View question details
          toast.info(`Viewing question: ${row.title}`);
        }}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={setRowsPerPage}
      />

      <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
        <Tooltip title="Approve Selected">
          <IconButton color="success" onClick={() => toast.info('Bulk approve functionality')}>
            <CheckCircle size={20} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Reject Selected">
          <IconButton color="error" onClick={() => toast.info('Bulk reject functionality')}>
            <X size={20} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}
