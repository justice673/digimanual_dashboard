'use client';

import { useState, useMemo, useRef } from 'react';
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
import { ViewModal } from '@/components/ui/ViewModal';
import { FormModal } from '@/components/ui/FormModal';
import { mockBlogs } from '@/lib/data/mockBlogs';
import { Blog } from '@/lib/data/mockBlogs';
import { toast } from 'sonner';
import { BlogDetailView } from '@/components/blogs/BlogDetailView';
import { BlogForm, BlogFormRef } from '@/components/blogs/BlogForm';

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>(mockBlogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published'>('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; blog: Blog | null }>({
    open: false,
    blog: null,
  });
  const [viewModal, setViewModal] = useState<{ open: boolean; blog: Blog | null }>({
    open: false,
    blog: null,
  });
  const [editModal, setEditModal] = useState<{ open: boolean; blog: Blog | null }>({
    open: false,
    blog: null,
  });
  const [createModal, setCreateModal] = useState(false);
  const formRef = useRef<BlogFormRef>(null);

  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesSearch =
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || blog.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [blogs, searchQuery, statusFilter]);

  // Get available statuses from filtered data (after search)
  const availableStatuses = useMemo(() => {
    const searchFiltered = blogs.filter((blog) => {
      return (
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
    return Array.from(new Set(searchFiltered.map((b) => b.status)));
  }, [blogs, searchQuery]);

  const handleView = (blog: Blog) => {
    setViewModal({ open: true, blog });
  };

  const handleEdit = (blog: Blog) => {
    setEditModal({ open: true, blog });
  };

  const handleCreate = () => {
    setCreateModal(true);
  };

  const handleSaveBlog = (blogData: Partial<Blog>) => {
    if (editModal.blog) {
      setBlogs(blogs.map((b) => (b.id === editModal.blog!.id ? { ...b, ...blogData } : b)));
      toast.success('Blog updated successfully');
      setEditModal({ open: false, blog: null });
    } else {
      const newBlog: Blog = {
        ...blogData as Blog,
        id: String(blogs.length + 1),
        slug: blogData.title?.toLowerCase().replace(/\s+/g, '-') || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        authorId: 'admin1',
        authorName: 'Admin User',
        viewCount: 0,
      };
      setBlogs([...blogs, newBlog]);
      toast.success('Blog created successfully');
      setCreateModal(false);
    }
  };

  const handleDelete = (blog: Blog) => {
    setDeleteDialog({ open: true, blog });
  };

  const confirmDelete = () => {
    if (deleteDialog.blog) {
      setBlogs(blogs.filter((b) => b.id !== deleteDialog.blog!.id));
      toast.success('Blog deleted successfully');
      setDeleteDialog({ open: false, blog: null });
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
    {
      id: 'coverImageUrl',
      label: 'Image',
      minWidth: 100,
      align: 'center' as const,
      format: (value: string, row?: Blog) => (
        <Box
          sx={{
            width: 60,
            height: 40,
            borderRadius: 1,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'grey.200',
          }}
        >
          {value ? (
            <Box
              component="img"
              src={value}
              alt={row?.title || 'Blog image'}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = '<span style="font-size: 20px;">📄</span>';
                }
              }}
            />
          ) : (
            <span style={{ fontSize: '20px' }}>📄</span>
          )}
        </Box>
      ),
    },
    { id: 'title', label: 'Title', minWidth: 250 },
    { id: 'authorName', label: 'Author', minWidth: 150 },
    {
      id: 'status',
      label: 'Status',
      minWidth: 100,
      align: 'center' as const,
      format: (value: string) => <StatusBadge status={value as any} />,
    },
    {
      id: 'viewCount',
      label: 'Views',
      minWidth: 80,
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
          Blog Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={handleCreate}
          sx={{ width: 'auto' }}
        >
          Create Blog
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <TextField
            fullWidth
            placeholder="Search blogs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <Search size={20} style={{ marginRight: 8, color: 'inherit', opacity: 0.6 }} />,
            }}
          />
        </Grid>
        <Grid size={{ xs: 'auto', md: 'auto' }}>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value as any)}>
              <MenuItem value="all">All ({blogs.length})</MenuItem>
              {availableStatuses.map((status) => {
                const count = blogs.filter((b) => b.status === status).length;
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
        rows={filteredBlogs}
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
        title="Delete Blog"
        message="Are you sure you want to delete this blog?"
        itemName={deleteDialog.blog?.title}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteDialog({ open: false, blog: null })}
      />

      <ViewModal
        open={viewModal.open}
        onClose={() => setViewModal({ open: false, blog: null })}
        title="Blog Details"
        width={900}
      >
        {viewModal.blog && <BlogDetailView blog={viewModal.blog} />}
      </ViewModal>

      <FormModal
        open={editModal.open || createModal}
        onClose={() => {
          setEditModal({ open: false, blog: null });
          setCreateModal(false);
        }}
        title={editModal.blog ? 'Edit Blog' : 'Create Blog'}
        onSave={() => {
          formRef.current?.submit();
        }}
        width={800}
      >
        <BlogForm
          ref={formRef}
          blog={editModal.blog || undefined}
          onSave={handleSaveBlog}
        />
      </FormModal>
    </Box>
  );
}
