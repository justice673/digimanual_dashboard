'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { Typography, Box, Button } from '@mui/material';
import { ArrowLeft } from 'lucide-react';
import { mockManuals } from '@/lib/data/mockManuals';

export default function EditManualPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const manual = mockManuals.find((m) => m.id === id);

  if (!manual) {
    return (
      <Box>
        <Typography variant="h4">Manual not found</Typography>
        <Button onClick={() => router.push('/dashboard/content/manuals')}>Back to Manuals</Button>
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
          Edit Manual: {manual.title}
        </Typography>
      </Box>
      <Typography variant="body1" color="text.secondary">
        Edit form will be implemented here (similar to create form with pre-filled data).
      </Typography>
    </Box>
  );
}
