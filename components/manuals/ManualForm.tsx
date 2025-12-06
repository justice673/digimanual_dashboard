'use client';

import { forwardRef, useImperativeHandle } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem, Box, Button, Typography } from '@mui/material';
import { Manual } from '@/lib/types/manual';
import { useState } from 'react';

const manualSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  subject: z.string().min(1, 'Subject is required'),
  level: z.enum(['O', 'A']),
  topics: z.array(z.string()).min(1, 'At least one topic is required'),
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
    const [topics, setTopics] = useState<string[]>(manual?.topics || []);
    const [topicInput, setTopicInput] = useState('');

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
            topics: manual.topics,
          }
        : {
            title: '',
            description: '',
            subject: '',
            level: 'O',
            topics: [],
          },
    });

    const handleAddTopic = () => {
      if (topicInput.trim() && !topics.includes(topicInput.trim())) {
        const newTopics = [...topics, topicInput.trim()];
        setTopics(newTopics);
        setValue('topics', newTopics);
        setTopicInput('');
      }
    };

    const handleRemoveTopic = (topic: string) => {
      const newTopics = topics.filter((t) => t !== topic);
      setTopics(newTopics);
      setValue('topics', newTopics);
    };

    const onSubmit = (data: ManualFormData) => {
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
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Topics
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                size="small"
                placeholder="Add topic"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTopic();
                  }
                }}
                sx={{ flexGrow: 1 }}
              />
              <Button variant="outlined" onClick={handleAddTopic}>
                Add
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {topics.map((topic) => (
                <Box
                  key={topic}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 2,
                    py: 0.5,
                    bgcolor: 'primary.light',
                    color: 'primary.main',
                    borderRadius: 2,
                    fontSize: '0.875rem',
                  }}
                >
                  {topic}
                  <Button
                    size="small"
                    onClick={() => handleRemoveTopic(topic)}
                    sx={{ minWidth: 'auto', p: 0.5 }}
                  >
                    ×
                  </Button>
                </Box>
              ))}
            </Box>
            {errors.topics && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                {errors.topics.message}
              </Typography>
            )}
          </Grid>
        </Grid>
      </form>
    );
  }
);

ManualForm.displayName = 'ManualForm';

