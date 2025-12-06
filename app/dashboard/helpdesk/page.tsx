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
import { mockHelpdeskTickets } from '@/lib/data/mockHelpdesk';
import { HelpdeskTicket } from '@/lib/data/mockHelpdesk';
import { toast } from 'sonner';

export default function HelpdeskPage() {
  const [tickets, setTickets] = useState<HelpdeskTicket[]>(mockHelpdeskTickets);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'open' | 'in_progress' | 'resolved' | 'closed'
  >('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesSearch =
        ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tickets, searchQuery, statusFilter, priorityFilter]);

  // Get available options from filtered data (after search)
  const availableStatuses = useMemo(() => {
    const searchFiltered = tickets.filter((ticket) => {
      return (
        ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
    return Array.from(new Set(searchFiltered.map((t) => t.status)));
  }, [tickets, searchQuery]);

  const availablePriorities = useMemo(() => {
    const searchFiltered = tickets.filter((ticket) => {
      return (
        ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
    return Array.from(new Set(searchFiltered.map((t) => t.priority)));
  }, [tickets, searchQuery]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  const columns = [
    { id: 'subject', label: 'Subject', minWidth: 200 },
    { id: 'userName', label: 'User', minWidth: 150 },
    {
      id: 'status',
      label: 'Status',
      minWidth: 120,
      align: 'center' as const,
      format: (value: string) => <StatusBadge status={value as any} />,
    },
    {
      id: 'priority',
      label: 'Priority',
      minWidth: 100,
      align: 'center' as const,
      format: (value: string) => (
        <StatusBadge status={value as any} label={value.charAt(0).toUpperCase() + value.slice(1)} />
      ),
    },
    {
      id: 'assignedToName',
      label: 'Assigned To',
      minWidth: 150,
      format: (value: string) => value || 'Unassigned',
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
        Helpdesk Tickets
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            placeholder="Search tickets..."
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
              <MenuItem value="all">All ({tickets.length})</MenuItem>
              {availableStatuses.map((status) => {
                const count = tickets.filter((t) => t.status === status).length;
                return (
                  <MenuItem key={status} value={status}>
                    {status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())} ({count})
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <FormControl fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select value={priorityFilter} label="Priority" onChange={(e) => setPriorityFilter(e.target.value as any)}>
              <MenuItem value="all">All ({tickets.length})</MenuItem>
              {availablePriorities.map((priority) => {
                const count = tickets.filter((t) => t.priority === priority).length;
                return (
                  <MenuItem key={priority} value={priority}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)} ({count})
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <DataTable
        columns={columns}
        rows={filteredTickets}
        onView={(row) => {
          toast.info(`Viewing ticket: ${row.subject}`);
        }}
        onEdit={(row) => {
          toast.info(`Editing ticket: ${row.subject}`);
        }}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={setRowsPerPage}
      />
    </Box>
  );
}
