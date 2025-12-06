'use client';

import { Box, Grid, Card, CardContent, Typography, Chip } from '@mui/material';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Blog } from '@/lib/data/mockBlogs';

interface BlogDetailViewProps {
  blog: Blog;
}

export function BlogDetailView({ blog }: BlogDetailViewProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 8 }}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              Blog Information
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <Typography variant="body2" color="text.secondary">
                  Title
                </Typography>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {blog.title}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="body2" color="text.secondary">
                  Excerpt
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {blog.excerpt}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Tags
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {blog.tags.map((tag) => (
                    <Chip key={tag} label={tag} size="small" />
                  ))}
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Author
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {blog.authorName}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Status
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <StatusBadge status={blog.status} />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Published At
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {blog.publishedAt ? formatDate(blog.publishedAt) : 'Not published'}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Created At
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {formatDate(blog.createdAt)}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              Statistics
            </Typography>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                View Count
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main' }}>
                {blog.viewCount}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

