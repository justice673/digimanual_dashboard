'use client';

import { useState, useMemo } from 'react';
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
import { mockAdmins } from '@/lib/data/mockAdmins';
import { AdminUser } from '@/lib/stores/userStore';
import { toast } from 'sonner';

export default function AdminsPage() {
  const [admins, setAdmins] = useState<AdminUser[]>(mockAdmins);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; admin: AdminUser | null }>({
    open: false,
    admin: null,
  });

  const filteredAdmins = useMemo(() => {
    return admins.filter((admin) => {
      const matchesSearch =
        admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === 'all' || admin.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [admins, searchQuery, roleFilter]);

  // Get available roles from filtered data (after search)
  const availableRoles = useMemo(() => {
    const searchFiltered = admins.filter((admin) => {
      const matchesSearch =
        admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
    return Array.from(new Set(searchFiltered.map((a) => a.role)));
  }, [admins, searchQuery]);

  const handleDelete = (admin: AdminUser) => {
    setDeleteDialog({ open: true, admin });
  };

  const confirmDelete = () => {
    if (deleteDialog.admin) {
      setAdmins(admins.filter((a) => a.id !== deleteDialog.admin!.id));
      toast.success('Admin deleted successfully');
      setDeleteDialog({ open: false, admin: null });
    }
  };

  const columns = [
    { id: 'name', label: 'Name', minWidth: 150 },
    { id: 'email', label: 'Email', minWidth: 200 },
    {
      id: 'role',
      label: 'Role',
      minWidth: 150,
      format: (value: string) => (
        <Box sx={{ textTransform: 'capitalize' }}>{value.replace('_', ' ')}</Box>
      ),
    },
    {
      id: 'permissions',
      label: 'Permissions',
      minWidth: 200,
      format: (value: string[]) => (
        <Box>
          {value.includes('all') ? (
            <StatusBadge status="active" label="All Permissions" />
          ) : (
            <Typography variant="body2" color="text.secondary">
              {value.length} permissions
            </Typography>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Admin Management
        </Typography>
        <Button variant="contained" startIcon={<Plus size={18} />} onClick={() => toast.info('Add admin form')}>
          Add Admin
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <TextField
            fullWidth
            placeholder="Search admins..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <Search size={20} style={{ marginRight: 8, color: 'inherit', opacity: 0.6 }} />,
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select value={roleFilter} label="Role" onChange={(e) => setRoleFilter(e.target.value)}>
              <MenuItem value="all">All ({admins.length})</MenuItem>
              {availableRoles.map((role) => {
                const count = admins.filter((a) => a.role === role).length;
                return (
                  <MenuItem key={role} value={role}>
                    {role.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())} ({count})
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <DataTable
        columns={columns}
        rows={filteredAdmins}
        onEdit={(row) => toast.info(`Edit admin: ${row.name}`)}
        onDelete={handleDelete}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={setRowsPerPage}
      />

      <ConfirmDelete
        open={deleteDialog.open}
        title="Delete Admin"
        message="Are you sure you want to delete this admin?"
        itemName={deleteDialog.admin?.name}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteDialog({ open: false, admin: null })}
      />
    </Box>
  );
}
