'use client';

import { Box, Grid, Card, CardContent, Typography, Chip } from '@mui/material';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Manual } from '@/lib/types/manual';

interface ManualDetailViewProps {
  manual: Manual;
}

export function ManualDetailView({ manual }: ManualDetailViewProps) {
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
              Manual Information
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <Typography variant="body2" color="text.secondary">
                  Title
                </Typography>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {manual.title}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="body2" color="text.secondary">
                  Description
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {manual.description}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Subject
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {manual.subject}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Level
                </Typography>
                <Typography variant="body1" sx={{ mb: 2, fontWeight: 600 }}>
                  {manual.level}-Level
                </Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Units ({manual.units.length})
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
                  {manual.units.map((unit) => (
                    <Box
                      key={unit.id}
                      sx={{
                        p: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                        backgroundColor: 'background.default',
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {unit.title}
                          </Typography>
                          {unit.description && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                              {unit.description}
                            </Typography>
                          )}
                        </Box>
                        <Chip label={`${unit.questionCount} questions`} size="small" color="primary" />
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Status
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <StatusBadge status={manual.status} />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Published At
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {manual.publishedAt ? formatDate(manual.publishedAt) : 'Not published'}
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
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Access Count
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main' }}>
                {manual.accessCount}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Download Count
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main' }}>
                {manual.downloadCount}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Questions
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main' }}>
                {manual.questionCount}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

