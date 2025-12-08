'use client';

import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useMediaQuery, useTheme, Box, Typography } from '@mui/material';
import { FinanceTransaction } from '@/lib/types/finance';

interface ExpenseCategoryChartProps {
  transactions: FinanceTransaction[];
}

export function ExpenseCategoryChart({ transactions }: ExpenseCategoryChartProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const data = useMemo(() => {
    const categoryTotals: Record<string, number> = {};

    transactions
      .filter((t) => t.type === 'expense' && t.status === 'completed')
      .forEach((transaction) => {
        const category = transaction.category.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
        categoryTotals[category] = (categoryTotals[category] || 0) + transaction.amount;
      });

    const colors = ['#EF4444', '#F59E0B', '#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#6366F1'];
    
    return Object.entries(categoryTotals)
      .map(([name, value], index) => ({
        name,
        value,
        color: colors[index % colors.length],
      }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const chartHeight = isMobile ? 250 : 300;
  const outerRadius = isMobile ? 60 : 80;

  if (data.length === 0) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: chartHeight }}>
        <Typography variant="body2" color="text.secondary">
          No expense data available
        </Typography>
      </Box>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent, value }) => 
            `${name}: $${value.toFixed(0)} (${percent ? (percent * 100).toFixed(0) : 0}%)`
          }
          outerRadius={outerRadius}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

