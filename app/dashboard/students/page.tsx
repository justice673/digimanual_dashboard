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
} from '@mui/material';
import { Plus, Search, Filter } from 'lucide-react';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Chip, IconButton } from '@mui/material';
import { ConfirmDelete } from '@/components/ui/ConfirmDelete';
import { ViewModal } from '@/components/ui/ViewModal';
import { FormModal } from '@/components/ui/FormModal';
import { FilterModal } from '@/components/ui/FilterModal';
import { mockStudents } from '@/lib/data/mockStudents';
import { Student } from '@/lib/types/student';
import { toast } from 'sonner';
import { StudentDetailView } from '@/components/students/StudentDetailView';
import { StudentForm, StudentFormRef } from '@/components/students/StudentForm';

export default function StudentsPage() {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));
  const [mounted, setMounted] = useState(false);
  const [students, setStudents] = useState<Student[]>(mockStudents);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isMobile = mounted && matches;
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female' | 'other'>('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; student: Student | null }>({
    open: false,
    student: null,
  });
  const [viewModal, setViewModal] = useState<{ open: boolean; student: Student | null }>({
    open: false,
    student: null,
  });
  const [editModal, setEditModal] = useState<{ open: boolean; student: Student | null }>({
    open: false,
    student: null,
  });
  const [createModal, setCreateModal] = useState(false);
  const [filterModal, setFilterModal] = useState(false);
  const formRef = useRef<StudentFormRef>(null);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
      const matchesGender = genderFilter === 'all' || student.gender === genderFilter;
      return matchesSearch && matchesStatus && matchesGender;
    });
  }, [students, searchQuery, statusFilter, genderFilter]);

  // Get available statuses from filtered data (after search)
  const availableStatuses = useMemo(() => {
    const searchFiltered = students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
    return Array.from(new Set(searchFiltered.map((s) => s.status)));
  }, [students, searchQuery]);

  // Get available genders from filtered data (after search)
  const availableGenders = useMemo(() => {
    const searchFiltered = students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
    return Array.from(new Set(searchFiltered.map((s) => s.gender)));
  }, [students, searchQuery]);

  const handleView = (student: Student) => {
    setViewModal({ open: true, student });
  };

  const handleEdit = (student: Student) => {
    setEditModal({ open: true, student });
  };

  const handleCreate = () => {
    setCreateModal(true);
  };

  const handleSaveStudent = (studentData: Partial<Student>) => {
    if (editModal.student) {
      setStudents(students.map((s) => (s.id === editModal.student!.id ? { ...s, ...studentData } : s)));
      toast.success('Student updated successfully');
      setEditModal({ open: false, student: null });
    } else {
      const newStudent: Student = {
        ...studentData as Student,
        id: String(students.length + 1),
        registrationDate: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        enrolledManuals: 0,
        totalQuestions: 0,
        totalComments: 0,
      };
      setStudents([...students, newStudent]);
      toast.success('Student created successfully');
      setCreateModal(false);
    }
  };

  const handleDelete = (student: Student) => {
    setDeleteDialog({ open: true, student });
  };

  const confirmDelete = () => {
    if (deleteDialog.student) {
      setStudents(students.filter((s) => s.id !== deleteDialog.student!.id));
      toast.success('Student deleted successfully');
      setDeleteDialog({ open: false, student: null });
    }
  };

  const handleStatusToggle = (student: Student) => {
    setStudents(
      students.map((s) =>
        s.id === student.id
          ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' }
          : s
      )
    );
    toast.success(`Student ${student.status === 'active' ? 'deactivated' : 'activated'} successfully`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const columns = [
    { id: 'name', label: 'Name', minWidth: 150 },
    { id: 'email', label: 'Email', minWidth: 200 },
    {
      id: 'gender',
      label: 'Gender',
      minWidth: 100,
      align: 'center' as const,
      format: (value: string) => (
        <Chip
          label={value.charAt(0).toUpperCase() + value.slice(1)}
          size="small"
          sx={{
            bgcolor: value === 'male' ? '#3B82F620' : value === 'female' ? '#EC489920' : '#6B728020',
            color: value === 'male' ? '#3B82F6' : value === 'female' ? '#EC4899' : '#6B7280',
            fontWeight: 500,
          }}
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
    {
      id: 'subscriptionStatus',
      label: 'Subscription',
      minWidth: 120,
      align: 'center' as const,
      format: (value: string) => <StatusBadge status={value as any} />,
    },
    {
      id: 'registrationDate',
      label: 'Registered',
      minWidth: 120,
      format: (value: string) => formatDate(value),
    },
    {
      id: 'lastActive',
      label: 'Last Active',
      minWidth: 120,
      format: (value: string) => formatDate(value),
    },
    {
      id: 'enrolledManuals',
      label: 'Manuals',
      minWidth: 80,
      align: 'center' as const,
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
          Student Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'row', sm: 'row' }, width: { xs: '100%', sm: 'auto' } }}>
          <Button 
            variant="contained" 
            startIcon={<Plus size={18} />} 
            onClick={handleCreate}
            sx={{ width: 'auto' }}
          >
            Add Student
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
                setGenderFilter('all');
              }}
            >
              Clear Filters
            </Button>
          )}
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <TextField
              fullWidth
              placeholder="Search by name or email..."
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
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                >
                  <MenuItem value="all">All ({students.length})</MenuItem>
                  {availableStatuses.map((status) => {
                    const count = students.filter((s) => s.status === status).length;
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
                <InputLabel>Gender</InputLabel>
                <Select
                  value={genderFilter}
                  label="Gender"
                  onChange={(e) => setGenderFilter(e.target.value as any)}
                >
                  <MenuItem value="all">All ({students.length})</MenuItem>
                  {availableGenders.map((gender) => {
                    const count = students.filter((s) => s.gender === gender).length;
                    return (
                      <MenuItem key={gender} value={gender}>
                        {gender.charAt(0).toUpperCase() + gender.slice(1)} ({count})
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
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <MenuItem value="all">All ({students.length})</MenuItem>
              {availableStatuses.map((status) => {
                const count = students.filter((s) => s.status === status).length;
                return (
                  <MenuItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)} ({count})
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Gender</InputLabel>
            <Select
              value={genderFilter}
              label="Gender"
              onChange={(e) => setGenderFilter(e.target.value as any)}
            >
              <MenuItem value="all">All ({students.length})</MenuItem>
              {availableGenders.map((gender) => {
                const count = students.filter((s) => s.gender === gender).length;
                return (
                  <MenuItem key={gender} value={gender}>
                    {gender.charAt(0).toUpperCase() + gender.slice(1)} ({count})
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
              setGenderFilter('all');
              setFilterModal(false);
            }}
          >
            Clear Filters
          </Button>
        </FilterModal>
      )}

      <DataTable
        columns={columns}
        rows={filteredStudents}
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
        title="Delete Student"
        message="Are you sure you want to delete this student?"
        itemName={deleteDialog.student?.name}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteDialog({ open: false, student: null })}
      />

      <ViewModal
        open={viewModal.open}
        onClose={() => setViewModal({ open: false, student: null })}
        title="Student Details"
        width={900}
      >
        {viewModal.student && <StudentDetailView student={viewModal.student} />}
      </ViewModal>

      <FormModal
        open={editModal.open || createModal}
        onClose={() => {
          setEditModal({ open: false, student: null });
          setCreateModal(false);
        }}
        title={editModal.student ? 'Edit Student' : 'Create Student'}
        onSave={() => {
          formRef.current?.submit();
        }}
        width={700}
      >
        <StudentForm
          ref={formRef}
          student={editModal.student || undefined}
          onSave={handleSaveStudent}
        />
      </FormModal>
    </Box>
  );
}
