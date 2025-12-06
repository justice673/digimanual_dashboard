'use client';

import { use, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import {
  ArrowLeft,
  Edit,
  Ban,
  CheckCircle,
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { mockStudents } from '@/lib/data/mockStudents';
import { mockStudentActivity } from '@/lib/data/mockStudentActivity';
import { toast } from 'sonner';

export default function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEdit = searchParams.get('edit') === 'true';

  const student = mockStudents.find((s) => s.id === id);
  const activities = mockStudentActivity[id] || [];

  const [localStudent, setLocalStudent] = useState(student);

  if (!student) {
    return (
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Student Not Found
        </Typography>
        <Button onClick={() => router.push('/dashboard/students')}>Back to Students</Button>
      </Box>
    );
  }

  const handleStatusToggle = () => {
    const newStatus = localStudent!.status === 'active' ? 'inactive' : 'active';
    setLocalStudent({ ...localStudent!, status: newStatus });
    toast.success(`Student ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
  };

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
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <IconButton onClick={() => router.push('/dashboard/students')}>
          <ArrowLeft size={20} />
        </IconButton>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600, flexGrow: 1 }}>
          Student Details
        </Typography>
        <Button
          variant="outlined"
          startIcon={localStudent!.status === 'active' ? <Ban size={18} /> : <CheckCircle size={18} />}
          onClick={handleStatusToggle}
        >
          {localStudent!.status === 'active' ? 'Deactivate' : 'Activate'}
        </Button>
        <Button variant="contained" startIcon={<Edit size={18} />} onClick={() => router.push(`/dashboard/students/${id}?edit=true`)}>
          Edit
        </Button>
      </Box>

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
                    {localStudent!.name}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {localStudent!.email}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Status
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <StatusBadge status={localStudent!.status} />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Subscription Status
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <StatusBadge status={localStudent!.subscriptionStatus} />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Registration Date
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {formatDate(localStudent!.registrationDate)}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Last Active
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {formatDate(localStudent!.lastActive)}
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
                  {localStudent!.enrolledManuals}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Questions Posted
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  {localStudent!.totalQuestions}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Comments Posted
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  {localStudent!.totalComments}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
