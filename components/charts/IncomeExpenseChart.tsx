'use client';

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useMediaQuery, useTheme, Box, Typography } from '@mui/material';
import { useDateFilterStore } from '@/lib/stores/dateFilterStore';
import { FinanceTransaction } from '@/lib/types/finance';

interface IncomeExpenseChartProps {
  transactions: FinanceTransaction[];
}

export function IncomeExpenseChart({ transactions }: IncomeExpenseChartProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const filterType = useDateFilterStore((state) => state.filterType);
  const selectedMonth = useDateFilterStore((state) => state.selectedMonth);
  const selectedYear = useDateFilterStore((state) => state.selectedYear);
  const customRange = useDateFilterStore((state) => state.customRange);

  const chartData = useMemo(() => {
    // Group transactions by month
    const monthlyData: Record<string, { month: string; income: number; expense: number; date: Date }> = {};

    transactions
      .filter((t) => t.status === 'completed')
      .forEach((transaction) => {
        const date = new Date(transaction.date);
        const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        const monthDate = new Date(date.getFullYear(), date.getMonth(), 1);

        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = {
            month: monthKey,
            income: 0,
            expense: 0,
            date: monthDate,
          };
        }

        if (transaction.type === 'income') {
          monthlyData[monthKey].income += transaction.amount;
        } else {
          monthlyData[monthKey].expense += transaction.amount;
        }
      });

    let allData = Object.values(monthlyData).sort((a, b) => a.date.getTime() - b.date.getTime());

    // Apply date filter
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
        const filtered = allData.filter((item) => {
          return item.date >= dateRange!.startDate && item.date <= dateRange!.endDate;
        });
        // If filtered data is empty, return all data instead (fallback)
        if (filtered.length > 0) {
          return filtered;
        }
      }
    }

    // Return all data if no filter or if filter resulted in empty data
    return allData;
  }, [transactions, filterType, selectedMonth, selectedYear, customRange]);

  const chartHeight = isMobile ? 250 : 300;

  if (chartData.length === 0) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: chartHeight }}>
        <Typography variant="body2" color="text.secondary">
          No data available
        </Typography>
      </Box>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
        <Legend />
        <Line
          type="monotone"
          dataKey="income"
          stroke="#10B981"
          strokeWidth={2}
          name="Income"
        />
        <Line
          type="monotone"
          dataKey="expense"
          stroke="#EF4444"
          strokeWidth={2}
          name="Expenses"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

