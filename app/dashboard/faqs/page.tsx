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
} from '@mui/material';
import { Plus, Search } from 'lucide-react';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ConfirmDelete } from '@/components/ui/ConfirmDelete';
import { mockFAQs } from '@/lib/data/mockFAQs';
import { FAQ } from '@/lib/data/mockFAQs';
import { toast } from 'sonner';

export default function FAQsPage() {
  const router = useRouter();
  const [faqs, setFaqs] = useState<FAQ[]>(mockFAQs);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; faq: FAQ | null }>({
    open: false,
    faq: null,
  });

  // Get available options from filtered data (after search)
  const availableCategories = useMemo(() => {
    const searchFiltered = faqs.filter((faq) => {
      const matchesSearch =
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
    return Array.from(new Set(searchFiltered.map((f) => f.category)));
  }, [faqs, searchQuery]);

  const availableStatuses = useMemo(() => {
    const searchFiltered = faqs.filter((faq) => {
      const matchesSearch =
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
    return Array.from(new Set(searchFiltered.map((f) => f.status)));
  }, [faqs, searchQuery]);

  const filteredFAQs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesSearch =
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || faq.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || faq.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [faqs, searchQuery, categoryFilter, statusFilter]);

  const handleDelete = (faq: FAQ) => {
    setDeleteDialog({ open: true, faq });
  };

  const confirmDelete = () => {
    if (deleteDialog.faq) {
      setFaqs(faqs.filter((f) => f.id !== deleteDialog.faq!.id));
      toast.success('FAQ deleted successfully');
      setDeleteDialog({ open: false, faq: null });
    }
  };

  const columns = [
    { id: 'question', label: 'Question', minWidth: 250 },
    { id: 'category', label: 'Category', minWidth: 120 },
    {
      id: 'status',
      label: 'Status',
      minWidth: 100,
      align: 'center' as const,
      format: (value: string) => <StatusBadge status={value as any} />,
    },
    {
      id: 'orderIndex',
      label: 'Order',
      minWidth: 80,
      align: 'center' as const,
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          FAQ Management
        </Typography>
        <Button variant="contained" startIcon={<Plus size={18} />} onClick={() => toast.info('Create FAQ form')}>
          Add FAQ
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <Search size={20} style={{ marginRight: 8, color: 'inherit', opacity: 0.6 }} />,
            }}
          />
        </Grid>
        <Grid size={{ xs: 'auto', md: 'auto' }}>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryFilter}
              label="Category"
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <MenuItem value="all">All ({faqs.length})</MenuItem>
              {availableCategories.map((category) => {
                const count = faqs.filter((f) => f.category === category).length;
                return (
                  <MenuItem key={category} value={category}>
                    {category} ({count})
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 'auto', md: 'auto' }}>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value as any)}>
              <MenuItem value="all">All ({faqs.length})</MenuItem>
              {availableStatuses.map((status) => {
                const count = faqs.filter((f) => f.status === status).length;
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
        rows={filteredFAQs}
        onEdit={(row) => toast.info(`Edit FAQ: ${row.question}`)}
        onDelete={handleDelete}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={setRowsPerPage}
      />

      <ConfirmDelete
        open={deleteDialog.open}
        title="Delete FAQ"
        message="Are you sure you want to delete this FAQ?"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteDialog({ open: false, faq: null })}
      />
    </Box>
  );
}
