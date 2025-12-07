'use client';

import { useState, useMemo, useEffect } from 'react';
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
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Search, CheckCircle, X, Eye, Filter } from 'lucide-react';
import { FilterModal } from '@/components/ui/FilterModal';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { mockQuestions } from '@/lib/data/mockQuestions';
import { Question } from '@/lib/data/mockQuestions';
import { toast } from 'sonner';

export default function QuestionsPage() {
  const router = useRouter();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));
  const [mounted, setMounted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>(mockQuestions);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isMobile = mounted && matches;
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [filterModal, setFilterModal] = useState(false);
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
        <Grid size={{ xs: 12, sm: 6, md: 8 }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <TextField
              fullWidth
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <Search size={20} style={{ marginRight: 8, color: 'inherit', opacity: 0.6 }} />,
              }}
            />
            {isMobile && (
              <IconButton
                onClick={() => setFilterModal(true)}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: '12px',
                  minWidth: 48,
                  height: 48,
                }}
              >
                <Filter size={20} />
              </IconButton>
            )}
          </Box>
        </Grid>
        {!isMobile && (
          <Grid size={{ xs: 'auto', md: 'auto' }}>
            <FormControl sx={{ minWidth: 150 }}>
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
        )}
      </Grid>

      {isMobile && (
        <FilterModal open={filterModal} onClose={() => setFilterModal(false)}>
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
          <Button
            variant="outlined"
            fullWidth
            sx={{
              backgroundColor: 'white',
              borderColor: 'primary.main',
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.light',
                borderColor: 'primary.main',
                color: 'white',
              },
            }}
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
              setFilterModal(false);
            }}
          >
            Clear Filters
          </Button>
        </FilterModal>
      )}

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
