'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Typography,
  Box,
  TextField,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  useMediaQuery,
  useTheme,
  IconButton,
  Chip,
  Button,
  Card,
  CardContent,
  Paper,
} from '@mui/material';
import { Search, Filter, Download, DollarSign, TrendingUp, TrendingDown, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { FilterModal } from '@/components/ui/FilterModal';
import { mockFinanceTransactions } from '@/lib/data/mockFinance';
import { FinanceTransaction } from '@/lib/types/finance';
import { IncomeExpenseChart } from '@/components/charts/IncomeExpenseChart';
import { ExpenseCategoryChart } from '@/components/charts/ExpenseCategoryChart';
import { toast } from 'sonner';

export default function FinancePage() {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));
  const [mounted, setMounted] = useState(false);
  const [transactions, setTransactions] = useState<FinanceTransaction[]>(mockFinanceTransactions);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed' | 'cancelled'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [filterModal, setFilterModal] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isMobile = mounted && matches;

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesSearch =
        transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.reference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.studentName?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || transaction.category === categoryFilter;
      return matchesSearch && matchesType && matchesStatus && matchesCategory;
    });
  }, [transactions, searchQuery, typeFilter, statusFilter, categoryFilter]);

  // Get available options from filtered data (after search)
  const availableTypes = useMemo(() => {
    const searchFiltered = transactions.filter((transaction) => {
      return (
        transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.reference?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
    return Array.from(new Set(searchFiltered.map((t) => t.type)));
  }, [transactions, searchQuery]);

  const availableStatuses = useMemo(() => {
    const searchFiltered = transactions.filter((transaction) => {
      return (
        transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.reference?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
    return Array.from(new Set(searchFiltered.map((t) => t.status)));
  }, [transactions, searchQuery]);

  const availableCategories = useMemo(() => {
    const searchFiltered = transactions.filter((transaction) => {
      return (
        transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.reference?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
    return Array.from(new Set(searchFiltered.map((t) => t.category)));
  }, [transactions, searchQuery]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  // Calculate totals
  const totals = useMemo(() => {
    const income = filteredTransactions
      .filter((t) => t.type === 'income' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = filteredTransactions
      .filter((t) => t.type === 'expense' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expense, net: income - expense };
  }, [filteredTransactions]);

  const columns = [
    { id: 'date', label: 'Date', minWidth: 120, format: (value: string) => formatDate(value) },
    {
      id: 'type',
      label: 'Type',
      minWidth: 100,
      format: (value: string, row: FinanceTransaction) => (
        <Chip
          label={value === 'income' ? 'Income' : 'Expense'}
          size="small"
          color={value === 'income' ? 'success' : 'error'}
          icon={value === 'income' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        />
      ),
    },
    {
      id: 'amount',
      label: 'Amount',
      minWidth: 120,
      align: 'right' as const,
      format: (value: number, row: FinanceTransaction) => (
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: row.type === 'income' ? 'success.main' : 'error.main',
          }}
        >
          {row.type === 'income' ? '+' : '-'}
          {formatCurrency(value, row.currency)}
        </Typography>
      ),
    },
    { id: 'description', label: 'Description', minWidth: 200 },
    {
      id: 'category',
      label: 'Category',
      minWidth: 120,
      format: (value: string) => (
        <Chip
          label={value.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 100,
      align: 'center' as const,
      format: (value: string) => <StatusBadge status={value as any} />,
    },
    { id: 'reference', label: 'Reference', minWidth: 150 },
  ];

  const handleExport = () => {
    toast.info('Export functionality coming soon');
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 600, fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
        Finance Management
      </Typography>

      {/* Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    Money In
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 600, fontSize: { xs: '1.5rem', sm: '2.125rem' }, color: 'success.main' }}>
                    {formatCurrency(totals.income)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: { xs: 48, sm: 56 },
                    height: { xs: 48, sm: 56 },
                    borderRadius: 2,
                    backgroundColor: '#10B98115',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#10B981',
                    flexShrink: 0,
                    ml: 2,
                  }}
                >
                  <ArrowUpCircle size={24} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    Money Out
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 600, fontSize: { xs: '1.5rem', sm: '2.125rem' }, color: 'error.main' }}>
                    {formatCurrency(totals.expense)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: { xs: 48, sm: 56 },
                    height: { xs: 48, sm: 56 },
                    borderRadius: 2,
                    backgroundColor: '#EF444415',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#EF4444',
                    flexShrink: 0,
                    ml: 2,
                  }}
                >
                  <ArrowDownCircle size={24} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    Net Balance
                  </Typography>
                  <Typography
                    variant="h4"
                    component="div"
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: '1.5rem', sm: '2.125rem' },
                      color: 'primary.main',
                    }}
                  >
                    {formatCurrency(totals.net)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: { xs: 48, sm: 56 },
                    height: { xs: 48, sm: 56 },
                    borderRadius: 2,
                    backgroundColor: '#A020F015',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'primary.main',
                    flexShrink: 0,
                    ml: 2,
                  }}
                >
                  <DollarSign size={24} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              Income vs Expenses
            </Typography>
            <IncomeExpenseChart transactions={transactions} />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              Expense by Category
            </Typography>
            <ExpenseCategoryChart transactions={transactions} />
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <TextField
              fullWidth
              placeholder="Search transactions..."
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
          <>
            <Grid size={{ xs: 'auto', md: 'auto' }}>
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>Type</InputLabel>
                <Select value={typeFilter} label="Type" onChange={(e) => setTypeFilter(e.target.value as any)}>
                  <MenuItem value="all">All ({transactions.length})</MenuItem>
                  {availableTypes.map((type) => {
                    const count = transactions.filter((t) => t.type === type).length;
                    return (
                      <MenuItem key={type} value={type}>
                        {type === 'income' ? 'Income' : 'Expense'} ({count})
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
                  <MenuItem value="all">All ({transactions.length})</MenuItem>
                  {availableStatuses.map((status) => {
                    const count = transactions.filter((t) => t.status === status).length;
                    return (
                      <MenuItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)} ({count})
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 'auto', md: 'auto' }}>
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>Category</InputLabel>
                <Select value={categoryFilter} label="Category" onChange={(e) => setCategoryFilter(e.target.value)}>
                  <MenuItem value="all">All ({transactions.length})</MenuItem>
                  {availableCategories.map((category) => {
                    const count = transactions.filter((t) => t.category === category).length;
                    return (
                      <MenuItem key={category} value={category}>
                        {category.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())} ({count})
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
          </>
        )}
      </Grid>

      {isMobile && (
        <FilterModal open={filterModal} onClose={() => setFilterModal(false)}>
          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select value={typeFilter} label="Type" onChange={(e) => setTypeFilter(e.target.value as any)}>
              <MenuItem value="all">All ({transactions.length})</MenuItem>
              {availableTypes.map((type) => {
                const count = transactions.filter((t) => t.type === type).length;
                return (
                  <MenuItem key={type} value={type}>
                    {type === 'income' ? 'Income' : 'Expense'} ({count})
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value as any)}>
              <MenuItem value="all">All ({transactions.length})</MenuItem>
              {availableStatuses.map((status) => {
                const count = transactions.filter((t) => t.status === status).length;
                return (
                  <MenuItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)} ({count})
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select value={categoryFilter} label="Category" onChange={(e) => setCategoryFilter(e.target.value)}>
              <MenuItem value="all">All ({transactions.length})</MenuItem>
              {availableCategories.map((category) => {
                const count = transactions.filter((t) => t.category === category).length;
                return (
                  <MenuItem key={category} value={category}>
                    {category.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())} ({count})
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
              setTypeFilter('all');
              setStatusFilter('all');
              setCategoryFilter('all');
              setFilterModal(false);
            }}
          >
            Clear Filters
          </Button>
        </FilterModal>
      )}

      <DataTable
        columns={columns}
        rows={filteredTransactions}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={setRowsPerPage}
      />
    </Box>
  );
}

