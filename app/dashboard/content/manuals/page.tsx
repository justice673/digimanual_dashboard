'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
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
  useMediaQuery,
  useTheme,
  IconButton,
} from '@mui/material';
import { Plus, Search, Filter } from 'lucide-react';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ConfirmDelete } from '@/components/ui/ConfirmDelete';
import { ViewModal } from '@/components/ui/ViewModal';
import { FormModal } from '@/components/ui/FormModal';
import { FilterModal } from '@/components/ui/FilterModal';
import { mockManuals } from '@/lib/data/mockManuals';
import { Manual } from '@/lib/types/manual';
import { toast } from 'sonner';
import { ManualDetailView } from '@/components/manuals/ManualDetailView';
import { ManualForm, ManualFormRef } from '@/components/manuals/ManualForm';

export default function ManualsPage() {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));
  const [mounted, setMounted] = useState(false);
  const [manuals, setManuals] = useState<Manual[]>(mockManuals);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isMobile = mounted && matches;
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published'>('all');
  const [filterModal, setFilterModal] = useState(false);
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<'all' | 'O' | 'A'>('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; manual: Manual | null }>({
    open: false,
    manual: null,
  });
  const [viewModal, setViewModal] = useState<{ open: boolean; manual: Manual | null }>({
    open: false,
    manual: null,
  });
  const [editModal, setEditModal] = useState<{ open: boolean; manual: Manual | null }>({
    open: false,
    manual: null,
  });
  const [createModal, setCreateModal] = useState(false);
  const formRef = useRef<ManualFormRef>(null);

  // Get available options from filtered data (after search)
  const availableSubjects = useMemo(() => {
    const searchFiltered = manuals.filter((manual) => {
      const matchesSearch =
        manual.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        manual.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
    return Array.from(new Set(searchFiltered.map((m) => m.subject)));
  }, [manuals, searchQuery]);

  const availableStatuses = useMemo(() => {
    const searchFiltered = manuals.filter((manual) => {
      const matchesSearch =
        manual.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        manual.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
    return Array.from(new Set(searchFiltered.map((m) => m.status)));
  }, [manuals, searchQuery]);

  const availableLevels = useMemo(() => {
    const searchFiltered = manuals.filter((manual) => {
      const matchesSearch =
        manual.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        manual.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
    return Array.from(new Set(searchFiltered.map((m) => m.level)));
  }, [manuals, searchQuery]);

  const filteredManuals = useMemo(() => {
    return manuals.filter((manual) => {
      const matchesSearch =
        manual.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        manual.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || manual.status === statusFilter;
      const matchesSubject = subjectFilter === 'all' || manual.subject === subjectFilter;
      const matchesLevel = levelFilter === 'all' || manual.level === levelFilter;
      return matchesSearch && matchesStatus && matchesSubject && matchesLevel;
    });
  }, [manuals, searchQuery, statusFilter, subjectFilter, levelFilter]);

  const handleView = (manual: Manual) => {
    setViewModal({ open: true, manual });
  };

  const handleEdit = (manual: Manual) => {
    setEditModal({ open: true, manual });
  };

  const handleCreate = () => {
    setCreateModal(true);
  };

  const handleSaveManual = (manualData: Partial<Manual>) => {
    if (editModal.manual) {
      setManuals(manuals.map((m) => (m.id === editModal.manual!.id ? { ...m, ...manualData } : m)));
      toast.success('Manual updated successfully');
      setEditModal({ open: false, manual: null });
    } else {
      const newManual: Manual = {
        ...manualData as Manual,
        id: String(manuals.length + 1),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'admin1',
        accessCount: 0,
        downloadCount: 0,
        questionCount: 0,
      };
      setManuals([...manuals, newManual]);
      toast.success('Manual created successfully');
      setCreateModal(false);
    }
  };

  const handleDelete = (manual: Manual) => {
    setDeleteDialog({ open: true, manual });
  };

  const confirmDelete = () => {
    if (deleteDialog.manual) {
      setManuals(manuals.filter((m) => m.id !== deleteDialog.manual!.id));
      toast.success('Manual deleted successfully');
      setDeleteDialog({ open: false, manual: null });
    }
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
    { id: 'subject', label: 'Subject', minWidth: 120 },
    {
      id: 'level',
      label: 'Level',
      minWidth: 80,
      align: 'center' as const,
      format: (value: string) => (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {value}-Level
          </Typography>
        </Box>
      ),
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 100,
      align: 'center' as const,
      format: (value: string) => <StatusBadge status={value as any} />,
    },
    {
      id: 'accessCount',
      label: 'Views',
      minWidth: 80,
      align: 'center' as const,
    },
    {
      id: 'questionCount',
      label: 'Questions',
      minWidth: 100,
      align: 'center' as const,
    },
    {
      id: 'publishedAt',
      label: 'Published',
      minWidth: 120,
      format: (value: string) => (value ? formatDate(value) : 'Not published'),
    },
  ];

  return (
    <Box>
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: { xs: 2, sm: 0 },
          mb: 4 
        }}
      >
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600, fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
          Manual Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'row', sm: 'row' }, width: { xs: '100%', sm: 'auto' } }}>
          <Button
            variant="contained"
            startIcon={<Plus size={18} />}
            onClick={handleCreate}
            sx={{ width: 'auto' }}
          >
            Create Manual
          </Button>
          {!isMobile && (
            <Button
              variant="outlined"
              sx={{
                width: 'auto',
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
                setSubjectFilter('all');
                setLevelFilter('all');
              }}
            >
              Clear
            </Button>
          )}
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <TextField
              fullWidth
              placeholder="Search manuals..."
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
                <InputLabel>Status</InputLabel>
                <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value as any)}>
                  <MenuItem value="all">All ({manuals.length})</MenuItem>
                  {availableStatuses.map((status) => {
                    const count = manuals.filter((m) => m.status === status).length;
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
                <InputLabel>Subject</InputLabel>
                <Select value={subjectFilter} label="Subject" onChange={(e) => setSubjectFilter(e.target.value)}>
                  <MenuItem value="all">All ({manuals.length})</MenuItem>
                  {availableSubjects.map((subject) => {
                    const count = manuals.filter((m) => m.subject === subject).length;
                    return (
                      <MenuItem key={subject} value={subject}>
                        {subject} ({count})
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 'auto', md: 'auto' }}>
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>Level</InputLabel>
                <Select value={levelFilter} label="Level" onChange={(e) => setLevelFilter(e.target.value as any)}>
                  <MenuItem value="all">All ({manuals.length})</MenuItem>
                  {availableLevels.map((level) => {
                    const count = manuals.filter((m) => m.level === level).length;
                    return (
                      <MenuItem key={level} value={level}>
                        {level}-Level ({count})
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
            <InputLabel>Status</InputLabel>
            <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value as any)}>
              <MenuItem value="all">All ({manuals.length})</MenuItem>
              {availableStatuses.map((status) => {
                const count = manuals.filter((m) => m.status === status).length;
                return (
                  <MenuItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)} ({count})
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Subject</InputLabel>
            <Select value={subjectFilter} label="Subject" onChange={(e) => setSubjectFilter(e.target.value)}>
              <MenuItem value="all">All ({manuals.length})</MenuItem>
              {availableSubjects.map((subject) => {
                const count = manuals.filter((m) => m.subject === subject).length;
                return (
                  <MenuItem key={subject} value={subject}>
                    {subject} ({count})
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Level</InputLabel>
            <Select value={levelFilter} label="Level" onChange={(e) => setLevelFilter(e.target.value as any)}>
              <MenuItem value="all">All ({manuals.length})</MenuItem>
              {availableLevels.map((level) => {
                const count = manuals.filter((m) => m.level === level).length;
                return (
                  <MenuItem key={level} value={level}>
                    {level}-Level ({count})
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
              setSubjectFilter('all');
              setLevelFilter('all');
              setFilterModal(false);
            }}
          >
            Clear Filters
          </Button>
        </FilterModal>
      )}

      <DataTable
        columns={columns}
        rows={filteredManuals}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={setRowsPerPage}
      />

      <ConfirmDelete
        open={deleteDialog.open}
        title="Delete Manual"
        message="Are you sure you want to delete this manual?"
        itemName={deleteDialog.manual?.title}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteDialog({ open: false, manual: null })}
      />

      <ViewModal
        open={viewModal.open}
        onClose={() => setViewModal({ open: false, manual: null })}
        title="Manual Details"
        width={900}
      >
        {viewModal.manual && <ManualDetailView manual={viewModal.manual} />}
      </ViewModal>

      <FormModal
        open={editModal.open || createModal}
        onClose={() => {
          setEditModal({ open: false, manual: null });
          setCreateModal(false);
        }}
        title={editModal.manual ? 'Edit Manual' : 'Create Manual'}
        onSave={() => {
          formRef.current?.submit();
        }}
        width={800}
      >
        <ManualForm
          ref={formRef}
          manual={editModal.manual || undefined}
          onSave={handleSaveManual}
        />
      </FormModal>
    </Box>
  );
}
