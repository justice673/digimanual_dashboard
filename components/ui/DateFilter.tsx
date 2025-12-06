'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Popover,
  Button,
  Typography,
  IconButton,
} from '@mui/material';
import { Calendar, X } from 'lucide-react';
import { useDateFilterStore, DateFilterType } from '@/lib/stores/dateFilterStore';
import { Controller, useForm } from 'react-hook-form';

interface DateFilterForm {
  filterType: DateFilterType;
  month: number;
  year: number;
  startDate: string;
  endDate: string;
}

export function DateFilter() {
  const {
    filterType,
    selectedMonth,
    selectedYear,
    customRange,
    setFilterType,
    setSelectedMonth,
    setSelectedYear,
    setCustomRange,
  } = useDateFilterStore();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);

  const { control, handleSubmit, watch, reset } = useForm<DateFilterForm>({
    defaultValues: {
      filterType,
      month: selectedMonth,
      year: selectedYear,
      startDate: customRange.startDate
        ? customRange.startDate.toISOString().split('T')[0]
        : '',
      endDate: customRange.endDate ? customRange.endDate.toISOString().split('T')[0] : '',
    },
  });

  const currentFilterType = watch('filterType');

  // Sync form with store when popover opens
  useEffect(() => {
    if (open) {
      reset({
        filterType,
        month: selectedMonth,
        year: selectedYear,
        startDate: customRange.startDate
          ? customRange.startDate.toISOString().split('T')[0]
          : '',
        endDate: customRange.endDate ? customRange.endDate.toISOString().split('T')[0] : '',
      });
    }
  }, [open, filterType, selectedMonth, selectedYear, customRange, reset]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onSubmit = (data: DateFilterForm) => {
    setFilterType(data.filterType);
    if (data.filterType === 'month' || data.filterType === 'year') {
      setSelectedMonth(data.month);
      setSelectedYear(data.year);
    } else if (data.filterType === 'custom') {
      setCustomRange({
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
      });
    }
    handleClose();
  };

  const handleReset = () => {
    const now = new Date();
    reset({
      filterType: 'month',
      month: now.getMonth(),
      year: now.getFullYear(),
      startDate: '',
      endDate: '',
    });
    useDateFilterStore.getState().reset();
    handleClose();
  };

  const getDisplayText = () => {
    switch (filterType) {
      case 'all':
        return 'All Time';
      case 'month':
        const monthNames = [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ];
        return `${monthNames[selectedMonth]} ${selectedYear}`;
      case 'year':
        return `Year ${selectedYear}`;
      case 'custom':
        if (customRange.startDate && customRange.endDate) {
          return `${customRange.startDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })} - ${customRange.endDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}`;
        }
        return 'Custom Range';
      default:
        return 'Select Period';
    }
  };

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const currentYear = new Date().getFullYear();
  // Include current year and next year (2024, 2025)
  const years = Array.from({ length: 11 }, (_, i) => currentYear + 1 - i);

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        startIcon={<Calendar size={18} />}
        onClick={handleClick}
        sx={{
          textTransform: 'none',
          minWidth: 180,
          justifyContent: 'flex-start',
          borderColor: 'divider',
          color: 'text.primary',
        }}
      >
        {getDisplayText()}
      </Button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: { p: 3, minWidth: 320, maxWidth: 400 },
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Filter Period
            </Typography>
            <IconButton size="small" onClick={handleClose}>
              <X size={18} />
            </IconButton>
          </Box>

          <Controller
            name="filterType"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Period Type</InputLabel>
                <Select {...field} label="Period Type">
                  <MenuItem value="all">All Time</MenuItem>
                  <MenuItem value="month">Month</MenuItem>
                  <MenuItem value="year">Year</MenuItem>
                  <MenuItem value="custom">Custom Range</MenuItem>
                </Select>
              </FormControl>
            )}
          />

          {currentFilterType === 'month' && (
            <>
              <Controller
                name="month"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Month</InputLabel>
                    <Select {...field} label="Month">
                      {months.map((month, index) => (
                        <MenuItem key={index} value={index}>
                          {month}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
              <Controller
                name="year"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Year</InputLabel>
                    <Select {...field} label="Year">
                      {years.map((year) => (
                        <MenuItem key={year} value={year}>
                          {year}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </>
          )}

          {currentFilterType === 'year' && (
            <Controller
              name="year"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Year</InputLabel>
                  <Select {...field} label="Year">
                    {years.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          )}

          {currentFilterType === 'custom' && (
            <>
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="date"
                    label="Start Date"
                    InputLabelProps={{ shrink: true }}
                    sx={{ mb: 2 }}
                  />
                )}
              />
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="date"
                    label="End Date"
                    InputLabelProps={{ shrink: true }}
                    sx={{ mb: 2 }}
                  />
                )}
              />
            </>
          )}

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
            <Button variant="outlined" size="small" onClick={handleReset}>
              Reset
            </Button>
            <Button variant="contained" size="small" type="submit" color="primary">
              Apply
            </Button>
          </Box>
        </form>
      </Popover>
    </>
  );
}

