'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Card,
  CardContent,
} from '@mui/material';
import { ArrowLeft, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

const manualSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  subject: z.string().min(1, 'Subject is required'),
  level: z.enum(['O', 'A']),
  topics: z.array(z.string()).min(1, 'At least one topic is required'),
});

type ManualFormData = z.infer<typeof manualSchema>;

export default function CreateManualPage() {
  const router = useRouter();
  const [topics, setTopics] = useState<string[]>([]);
  const [topicInput, setTopicInput] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ManualFormData>({
    resolver: zodResolver(manualSchema),
    defaultValues: {
      title: '',
      description: '',
      subject: '',
      level: 'O',
      topics: [],
    },
  });

  const selectedSubject = watch('subject');

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
    toast.success('Manual created successfully!');
    router.push('/dashboard/content/manuals');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <Button startIcon={<ArrowLeft size={18} />} onClick={() => router.back()}>
          Back
        </Button>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600, flexGrow: 1 }}>
          Create New Manual
        </Typography>
        <Button variant="contained" startIcon={<Save size={18} />} onClick={handleSubmit(onSubmit)}>
          Save Manual
        </Button>
      </Box>

      <Card>
        <CardContent>
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
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Subject</InputLabel>
                  <Select
                    label="Subject"
                    {...register('subject')}
                    error={!!errors.subject}
                    defaultValue=""
                  >
                    <MenuItem value="Mathematics">Mathematics</MenuItem>
                    <MenuItem value="Physics">Physics</MenuItem>
                    <MenuItem value="Chemistry">Chemistry</MenuItem>
                    <MenuItem value="Biology">Biology</MenuItem>
                    <MenuItem value="English">English</MenuItem>
                    <MenuItem value="Computer Science">Computer Science</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Level</InputLabel>
                  <Select label="Level" {...register('level')} error={!!errors.level} defaultValue="O">
                    <MenuItem value="O">O-Level</MenuItem>
                    <MenuItem value="A">A-Level</MenuItem>
                  </Select>
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
        </CardContent>
      </Card>
    </Box>
  );
}
