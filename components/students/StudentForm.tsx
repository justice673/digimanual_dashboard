'use client';

import { forwardRef, useImperativeHandle } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Student } from '@/lib/types/student';

const studentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  gender: z.enum(['male', 'female', 'other']),
  status: z.enum(['active', 'inactive']),
  subscriptionStatus: z.enum(['active', 'expired', 'none']),
});

type StudentFormData = z.infer<typeof studentSchema>;

interface StudentFormProps {
  student?: Student;
  onSave: (data: Partial<Student>) => void;
}

export interface StudentFormRef {
  submit: () => void;
}

export const StudentForm = forwardRef<StudentFormRef, StudentFormProps>(
  ({ student, onSave }, ref) => {
    const {
      register,
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<StudentFormData>({
      resolver: zodResolver(studentSchema),
      defaultValues: student
        ? {
            name: student.name,
            email: student.email,
            gender: student.gender,
            status: student.status,
            subscriptionStatus: student.subscriptionStatus,
          }
        : {
            name: '',
            email: '',
            gender: 'male',
            status: 'active',
            subscriptionStatus: 'none',
          },
    });

    const onSubmit = (data: StudentFormData) => {
      onSave(data);
    };

    useImperativeHandle(ref, () => ({
      submit: () => {
        handleSubmit(onSubmit)();
      },
    }));

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Name"
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth error={!!errors.gender}>
              <InputLabel>Gender</InputLabel>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select {...field} label="Gender">
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                )}
              />
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth error={!!errors.status}>
              <InputLabel>Status</InputLabel>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Status"
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                )}
              />
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth error={!!errors.subscriptionStatus}>
              <InputLabel>Subscription Status</InputLabel>
              <Controller
                name="subscriptionStatus"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Subscription Status"
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="expired">Expired</MenuItem>
                    <MenuItem value="none">None</MenuItem>
                  </Select>
                )}
              />
            </FormControl>
          </Grid>
        </Grid>
      </form>
    );
  }
);

StudentForm.displayName = 'StudentForm';
