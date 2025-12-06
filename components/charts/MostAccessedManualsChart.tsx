'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useMediaQuery, useTheme } from '@mui/material';

const data = [
  { name: 'Mathematics O-Level', accesses: 1250 },
  { name: 'Biology A-Level', accesses: 980 },
  { name: 'Physics A-Level', accesses: 850 },
  { name: 'Computer Science', accesses: 720 },
  { name: 'English Literature', accesses: 650 },
];

export function MostAccessedManualsChart() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const chartHeight = isMobile ? 250 : 300;

  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="name" type="category" width={isMobile ? 100 : 150} />
        <Tooltip />
        <Legend />
        <Bar dataKey="accesses" fill="#10B981" name="Access Count" />
      </BarChart>
    </ResponsiveContainer>
  );
}

