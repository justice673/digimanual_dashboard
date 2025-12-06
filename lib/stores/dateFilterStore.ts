import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type DateFilterType = 'all' | 'month' | 'year' | 'custom';
export type DateRange = {
  startDate: Date | null;
  endDate: Date | null;
};

interface DateFilterState {
  filterType: DateFilterType;
  selectedMonth: number; // 0-11 (0 = January)
  selectedYear: number;
  customRange: DateRange;
  setFilterType: (type: DateFilterType) => void;
  setSelectedMonth: (month: number) => void;
  setSelectedYear: (year: number) => void;
  setCustomRange: (range: DateRange) => void;
  getDateRange: () => { startDate: Date; endDate: Date } | null;
  reset: () => void;
}

const getCurrentMonthStart = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
};

const getCurrentMonthEnd = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
};

const getCurrentYearStart = () => {
  const now = new Date();
  return new Date(now.getFullYear(), 0, 1);
};

const getCurrentYearEnd = () => {
  const now = new Date();
  return new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
};

export const useDateFilterStore = create<DateFilterState>()(
  persist(
    (set, get) => ({
      filterType: 'month',
      selectedMonth: new Date().getMonth(),
      selectedYear: new Date().getFullYear(),
      customRange: {
        startDate: null,
        endDate: null,
      },
      setFilterType: (type) => set({ filterType: type }),
      setSelectedMonth: (month) => set({ selectedMonth: month }),
      setSelectedYear: (year) => set({ selectedYear: year }),
      setCustomRange: (range) => set({ customRange: range }),
      getDateRange: () => {
        const state = get();
        switch (state.filterType) {
          case 'all':
            return null; // No filter, return all data
          case 'month':
            const monthStart = new Date(state.selectedYear, state.selectedMonth, 1);
            const monthEnd = new Date(
              state.selectedYear,
              state.selectedMonth + 1,
              0,
              23,
              59,
              59,
              999
            );
            return { startDate: monthStart, endDate: monthEnd };
          case 'year':
            const yearStart = new Date(state.selectedYear, 0, 1);
            const yearEnd = new Date(state.selectedYear, 11, 31, 23, 59, 59, 999);
            return { startDate: yearStart, endDate: yearEnd };
          case 'custom':
            if (state.customRange.startDate && state.customRange.endDate) {
              return {
                startDate: state.customRange.startDate,
                endDate: state.customRange.endDate,
              };
            }
            return null;
          default:
            return null;
        }
      },
      reset: () =>
        set({
          filterType: 'month',
          selectedMonth: new Date().getMonth(),
          selectedYear: new Date().getFullYear(),
          customRange: {
            startDate: null,
            endDate: null,
          },
        }),
    }),
    {
      name: 'date-filter-storage',
    }
  )
);

