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
  Button,
} from '@mui/material';
import { Search, Download } from 'lucide-react';
import { DataTable } from '@/components/ui/DataTable';
import { mockActivityLogs } from '@/lib/data/mockActivityLogs';
import { ActivityLog } from '@/lib/data/mockActivityLogs';
import { toast } from 'sonner';

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>(mockActivityLogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [entityFilter, setEntityFilter] = useState<string>('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const actionTypes = Array.from(new Set(logs.map((log) => log.actionType)));
  const entityTypes = Array.from(new Set(logs.map((log) => log.entityType)));

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.adminName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesAction = actionFilter === 'all' || log.actionType === actionFilter;
      const matchesEntity = entityFilter === 'all' || log.entityType === entityFilter;
      return matchesSearch && matchesAction && matchesEntity;
    });
  }, [logs, searchQuery, actionFilter, entityFilter]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleExport = () => {
    toast.success('Exporting activity logs...');
  };

  const columns = [
    {
      id: 'createdAt',
      label: 'Date & Time',
      minWidth: 180,
      format: (value: string) => formatDate(value),
    },
    { id: 'adminName', label: 'Admin', minWidth: 150 },
    {
      id: 'actionType',
      label: 'Action',
      minWidth: 100,
      format: (value: string) => (
        <Box sx={{ textTransform: 'capitalize', fontWeight: 500 }}>{value}</Box>
      ),
    },
    {
      id: 'entityType',
      label: 'Entity',
      minWidth: 100,
      format: (value: string) => (
        <Box sx={{ textTransform: 'capitalize' }}>{value}</Box>
      ),
    },
    { id: 'description', label: 'Description', minWidth: 300 },
    { id: 'ipAddress', label: 'IP Address', minWidth: 120 },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Activity Logs
        </Typography>
        <Button variant="outlined" startIcon={<Download size={18} />} onClick={handleExport}>
          Export Logs
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <Search size={20} style={{ marginRight: 8, color: 'inherit', opacity: 0.6 }} />,
            }}
          />
        </Grid>
        <Grid size={{ xs: 'auto', md: 'auto' }}>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Action Type</InputLabel>
            <Select
              value={actionFilter}
              label="Action Type"
              onChange={(e) => setActionFilter(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              {actionTypes.map((action) => (
                <MenuItem key={action} value={action}>
                  {action.charAt(0).toUpperCase() + action.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 'auto', md: 'auto' }}>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Entity Type</InputLabel>
            <Select
              value={entityFilter}
              label="Entity Type"
              onChange={(e) => setEntityFilter(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              {entityTypes.map((entity) => (
                <MenuItem key={entity} value={entity}>
                  {entity.charAt(0).toUpperCase() + entity.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <DataTable
        columns={columns}
        rows={filteredLogs}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={setRowsPerPage}
      />
    </Box>
  );
}
