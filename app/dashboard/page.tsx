'use client';

import { Box, Grid, Card, CardContent, Typography, Paper, Chip } from '@mui/material';
import {
  Users,
  BookOpen,
  MessageSquare,
  FileText,
} from 'lucide-react';
import { UsersGrowthChart } from '@/components/charts/UsersGrowthChart';
import { MostAccessedManualsChart } from '@/components/charts/MostAccessedManualsChart';
import { ActiveUsersPie } from '@/components/charts/ActiveUsersPie';
import { GenderDistributionPie } from '@/components/charts/GenderDistributionPie';
import { SessionTimeAreaChart } from '@/components/charts/SessionTimeAreaChart';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { mockStudents } from '@/lib/data/mockStudents';
import { Student } from '@/lib/types/student';
import { useDateFilterStore } from '@/lib/stores/dateFilterStore';
import { useMemo } from 'react';

const stats = [
  { label: 'Total Students', value: '1,234', icon: <Users size={24} />, color: '#A020F0' },
  { label: 'Active Manuals', value: '456', icon: <BookOpen size={24} />, color: '#10B981' },
  { label: 'Pending Questions', value: '23', icon: <MessageSquare size={24} />, color: '#F59E0B' },
  { label: 'Published Blogs', value: '89', icon: <FileText size={24} />, color: '#3B82F6' },
];

export default function DashboardPage() {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 600, fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
        Dashboard Overview
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <Card>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      {stat.label}
                    </Typography>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 600, fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
                      {stat.value}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: { xs: 48, sm: 56 },
                      height: { xs: 48, sm: 56 },
                      borderRadius: 2,
                      backgroundColor: `${stat.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: stat.color,
                      flexShrink: 0,
                      ml: 2,
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              User Growth
            </Typography>
            <UsersGrowthChart />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              Active Users
            </Typography>
            <ActiveUsersPie />
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              Most Accessed Manuals
            </Typography>
            <MostAccessedManualsChart />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              Gender Distribution
            </Typography>
            <GenderDistributionPie />
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              Average Session Time
            </Typography>
            <SessionTimeAreaChart />
          </Paper>
        </Grid>
      </Grid>

      <Box>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          Recently Registered Users
        </Typography>
        <RecentUsersTable />
      </Box>
    </Box>
  );
}

function RecentUsersTable() {
  const filterType = useDateFilterStore((state) => state.filterType);
  const selectedMonth = useDateFilterStore((state) => state.selectedMonth);
  const selectedYear = useDateFilterStore((state) => state.selectedYear);
  const customRange = useDateFilterStore((state) => state.customRange);

  const recentStudents = useMemo(() => {
    let filtered = mockStudents;

    // Apply date filter if not "all"
    if (filterType !== 'all') {
      let dateRange: { startDate: Date; endDate: Date } | null = null;

      if (filterType === 'month') {
        dateRange = {
          startDate: new Date(selectedYear, selectedMonth, 1),
          endDate: new Date(selectedYear, selectedMonth + 1, 0, 23, 59, 59, 999),
        };
      } else if (filterType === 'year') {
        dateRange = {
          startDate: new Date(selectedYear, 0, 1),
          endDate: new Date(selectedYear, 11, 31, 23, 59, 59, 999),
        };
      } else if (filterType === 'custom' && customRange.startDate && customRange.endDate) {
        dateRange = {
          startDate: customRange.startDate,
          endDate: customRange.endDate,
        };
      }

      if (dateRange) {
        filtered = mockStudents.filter((student) => {
          const regDate = new Date(student.registrationDate);
          return regDate >= dateRange!.startDate && regDate <= dateRange!.endDate;
        });
      }
    }

    return filtered
      .sort((a, b) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime())
      .slice(0, 6);
  }, [filterType, selectedMonth, selectedYear, customRange]);

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
      id: 'registrationDate',
      label: 'Registered',
      minWidth: 120,
      format: (value: string) => formatDate(value),
    },
  ];

  return <DataTable columns={columns} rows={recentStudents} />;
}

