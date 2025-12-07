'use client';

import { forwardRef, useImperativeHandle, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem, Box, Button, Typography, IconButton, Divider } from '@mui/material';
import { Manual, ManualUnit } from '@/lib/types/manual';
import { useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';

const manualSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  subject: z.string().min(1, 'Subject is required'),
  level: z.enum(['O', 'A']),
  units: z.array(z.object({
    title: z.string().min(1, 'Unit title is required'),
    description: z.string().optional(),
  })).min(1, 'At least one unit is required'),
});

type ManualFormData = z.infer<typeof manualSchema>;

interface ManualFormProps {
  manual?: Manual;
  onSave: (data: Partial<Manual>) => void;
}

export interface ManualFormRef {
  submit: () => void;
}

export const ManualForm = forwardRef<ManualFormRef, ManualFormProps>(
  ({ manual, onSave }, ref) => {
    const [units, setUnits] = useState<Array<{ title: string; description?: string }>>(
      manual?.units?.map(u => ({ title: u.title, description: u.description })) || []
    );

    const {
      register,
      control,
      handleSubmit,
      formState: { errors },
      setValue,
      watch,
    } = useForm<ManualFormData>({
      resolver: zodResolver(manualSchema),
      defaultValues: manual
        ? {
            title: manual.title,
            description: manual.description,
            subject: manual.subject,
            level: manual.level,
            units: manual.units.map(u => ({ title: u.title, description: u.description })),
          }
        : {
            title: '',
            description: '',
            subject: '',
            level: 'O',
            units: [],
          },
    });

    // Sync units with form when they change
    useEffect(() => {
      setValue('units', units);
    }, [units, setValue]);

    const handleAddUnit = () => {
      const newUnits = [...units, { title: `Unit ${units.length + 1}`, description: '' }];
      setUnits(newUnits);
      setValue('units', newUnits);
    };

    const handleRemoveUnit = (index: number) => {
      const newUnits = units.filter((_, i) => i !== index);
      setUnits(newUnits);
      setValue('units', newUnits);
    };

    const handleUnitChange = (index: number, field: 'title' | 'description', value: string) => {
      const newUnits = [...units];
      newUnits[index] = { ...newUnits[index], [field]: value };
      setUnits(newUnits);
      setValue('units', newUnits);
    };

    const onSubmit = (data: ManualFormData) => {
      // Convert form units to ManualUnit format
      const manualUnits: ManualUnit[] = data.units.map((unit, index) => ({
        id: manual?.units?.[index]?.id || `unit-${Date.now()}-${index}`,
        manualId: manual?.id || '',
        title: unit.title,
        description: unit.description,
        orderIndex: index + 1,
        questionCount: manual?.units?.[index]?.questionCount || 0,
      }));

      onSave({
        ...data,
        units: manualUnits,
      });
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
              label="Title"
              {...register('title')}
              error={!!errors.title}
              helperText={errors.title?.message}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              {...register('description')}
              error={!!errors.description}
              helperText={errors.description?.message}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth error={!!errors.subject}>
              <InputLabel>Subject</InputLabel>
              <Controller
                name="subject"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Subject"
                  >
                    <MenuItem value="Mathematics">Mathematics</MenuItem>
                    <MenuItem value="Physics">Physics</MenuItem>
                    <MenuItem value="Chemistry">Chemistry</MenuItem>
                    <MenuItem value="Biology">Biology</MenuItem>
                    <MenuItem value="English">English</MenuItem>
                    <MenuItem value="Computer Science">Computer Science</MenuItem>
                  </Select>
                )}
              />
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth error={!!errors.level}>
              <InputLabel>Level</InputLabel>
              <Controller
                name="level"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Level"
                  >
                    <MenuItem value="O">O-Level</MenuItem>
                    <MenuItem value="A">A-Level</MenuItem>
                  </Select>
                )}
              />
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Units ({units.length})
              </Typography>
              <Button variant="outlined" startIcon={<Plus size={18} />} onClick={handleAddUnit} size="small">
                Add Unit
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {units.map((unit, index) => (
                <Box
                  key={index}
                  sx={{
                    p: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    backgroundColor: 'background.default',
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', mt: 1 }}>
                      <GripVertical size={20} />
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <TextField
                        fullWidth
                        size="small"
                        label={`Unit ${index + 1} Title`}
                        value={unit.title}
                        onChange={(e) => handleUnitChange(index, 'title', e.target.value)}
                        sx={{ mb: 1 }}
                        placeholder="e.g., Unit 1: Introduction"
                      />
                      <TextField
                        fullWidth
                        size="small"
                        label="Description (Optional)"
                        value={unit.description || ''}
                        onChange={(e) => handleUnitChange(index, 'description', e.target.value)}
                        placeholder="Brief description of this unit"
                        multiline
                        rows={2}
                      />
                    </Box>
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveUnit(index)}
                      color="error"
                      sx={{ mt: 0.5 }}
                    >
                      <Trash2 size={18} />
                    </IconButton>
                  </Box>
                </Box>
              ))}
              {units.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                  <Typography variant="body2">No units added yet. Click "Add Unit" to get started.</Typography>
                </Box>
              )}
            </Box>
            {errors.units && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                {errors.units.message}
              </Typography>
            )}
          </Grid>
        </Grid>
      </form>
    );
  }
);

ManualForm.displayName = 'ManualForm';

