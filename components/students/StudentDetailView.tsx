'use client';

import { Box, Grid, Card, CardContent, Typography, Divider, List, ListItem, ListItemText } from '@mui/material';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Student } from '@/lib/types/student';
import { mockStudentActivity } from '@/lib/data/mockStudentActivity';

interface StudentDetailViewProps {
  student: Student;
}

export function StudentDetailView({ student }: StudentDetailViewProps) {
  const activities = mockStudentActivity[student.id] || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'login':
        return '🔐';
      case 'manual_access':
        return '📖';
      case 'question_posted':
        return '❓';
      case 'comment_posted':
        return '💬';
      default:
        return '📝';
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 8 }}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              Personal Information
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Name
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {student.name}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {student.email}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Gender
                </Typography>
                <Typography variant="body1" sx={{ mb: 2, textTransform: 'capitalize' }}>
                  {student.gender}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Status
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <StatusBadge status={student.status} />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Subscription Status
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <StatusBadge status={student.subscriptionStatus} />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Registration Date
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {formatDate(student.registrationDate)}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Last Active
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {formatDate(student.lastActive)}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              Activity Log
            </Typography>
            {activities.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No activity recorded
              </Typography>
            ) : (
              <List>
                {activities.map((activity, index) => (
                  <Box key={activity.id}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <span>{getActivityIcon(activity.type)}</span>
                            <Typography variant="body1">{activity.description}</Typography>
                          </Box>
                        }
                        secondary={formatDate(activity.timestamp)}
                      />
                    </ListItem>
                    {index < activities.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            )}
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
                Enrolled Manuals
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main' }}>
                {student.enrolledManuals}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Questions Posted
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main' }}>
                {student.totalQuestions}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Comments Posted
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main' }}>
                {student.totalComments}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

