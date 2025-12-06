'use client';

import { useRouter } from 'next/navigation';
import { Typography, Box, Button } from '@mui/material';
import { ArrowLeft } from 'lucide-react';

export default function CreateBlogPage() {
  const router = useRouter();

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <Button startIcon={<ArrowLeft size={18} />} onClick={() => router.back()}>
          Back
        </Button>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600, flexGrow: 1 }}>
          Create New Blog
        </Typography>
      </Box>
      <Typography variant="body1" color="text.secondary">
        Blog creation form with rich text editor will be implemented here.
      </Typography>
    </Box>
  );
}
