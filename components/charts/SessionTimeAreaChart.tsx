'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useDateFilterStore } from '@/lib/stores/dateFilterStore';
import { useMemo } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';

// Full year data for 2024 and 2025
const fullData = [
  // 2024 data
  { month: 'Jan 2024', average: 25, date: new Date(2024, 0, 1) },
  { month: 'Feb 2024', average: 30, date: new Date(2024, 1, 1) },
  { month: 'Mar 2024', average: 35, date: new Date(2024, 2, 1) },
  { month: 'Apr 2024', average: 40, date: new Date(2024, 3, 1) },
  { month: 'May 2024', average: 45, date: new Date(2024, 4, 1) },
  { month: 'Jun 2024', average: 50, date: new Date(2024, 5, 1) },
  { month: 'Jul 2024', average: 48, date: new Date(2024, 6, 1) },
  { month: 'Aug 2024', average: 52, date: new Date(2024, 7, 1) },
  { month: 'Sep 2024', average: 55, date: new Date(2024, 8, 1) },
  { month: 'Oct 2024', average: 58, date: new Date(2024, 9, 1) },
  { month: 'Nov 2024', average: 60, date: new Date(2024, 10, 1) },
  { month: 'Dec 2024', average: 62, date: new Date(2024, 11, 1) },
  // 2025 data
  { month: 'Jan 2025', average: 65, date: new Date(2025, 0, 1) },
  { month: 'Feb 2025', average: 68, date: new Date(2025, 1, 1) },
  { month: 'Mar 2025', average: 70, date: new Date(2025, 2, 1) },
  { month: 'Apr 2025', average: 72, date: new Date(2025, 3, 1) },
  { month: 'May 2025', average: 75, date: new Date(2025, 4, 1) },
  { month: 'Jun 2025', average: 78, date: new Date(2025, 5, 1) },
  { month: 'Jul 2025', average: 80, date: new Date(2025, 6, 1) },
  { month: 'Aug 2025', average: 82, date: new Date(2025, 7, 1) },
  { month: 'Sep 2025', average: 85, date: new Date(2025, 8, 1) },
  { month: 'Oct 2025', average: 88, date: new Date(2025, 9, 1) },
  { month: 'Nov 2025', average: 90, date: new Date(2025, 10, 1) },
  { month: 'Dec 2025', average: 92, date: new Date(2025, 11, 1) },
];

export function SessionTimeAreaChart() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const filterType = useDateFilterStore((state) => state.filterType);
  const selectedMonth = useDateFilterStore((state) => state.selectedMonth);
  const selectedYear = useDateFilterStore((state) => state.selectedYear);
  const customRange = useDateFilterStore((state) => state.customRange);

  const filteredData = useMemo(() => {
    if (filterType === 'all') {
      return fullData;
    }

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

    if (!dateRange) {
      return fullData;
    }

    return fullData.filter((item) => {
      const itemDate = item.date;
      return itemDate >= dateRange!.startDate && itemDate <= dateRange!.endDate;
    });
  }, [filterType, selectedMonth, selectedYear, customRange]);

  const chartHeight = isMobile ? 250 : 300;

  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <AreaChart data={filteredData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area
          type="monotone"
          dataKey="average"
          stroke="#A020F0"
          fill="#C866FF"
          fillOpacity={0.6}
          name="Avg Session (min)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

