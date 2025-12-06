'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { Typography, Box, Button } from '@mui/material';
import { ArrowLeft } from 'lucide-react';
import { mockBlogs } from '@/lib/data/mockBlogs';

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const blog = mockBlogs.find((b) => b.id === id);

  if (!blog) {
    return (
      <Box>
        <Typography variant="h4">Blog not found</Typography>
        <Button onClick={() => router.push('/dashboard/blogs')}>Back to Blogs</Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <Button startIcon={<ArrowLeft size={18} />} onClick={() => router.back()}>
          Back
        </Button>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600, flexGrow: 1 }}>
          Edit Blog: {blog.title}
        </Typography>
      </Box>
      <Typography variant="body1" color="text.secondary">
        Blog edit form will be implemented here.
      </Typography>
    </Box>
  );
}
