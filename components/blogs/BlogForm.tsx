'use client';

import { forwardRef, useImperativeHandle, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem, Box, Button, Typography } from '@mui/material';
import { Blog } from '@/lib/data/mockBlogs';

const blogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  excerpt: z.string().min(1, 'Excerpt is required'),
  status: z.enum(['draft', 'published']),
  tags: z.array(z.string()).optional(),
});

type BlogFormData = z.infer<typeof blogSchema>;

interface BlogFormProps {
  blog?: Blog;
  onSave: (data: Partial<Blog>) => void;
}

export interface BlogFormRef {
  submit: () => void;
}

export const BlogForm = forwardRef<BlogFormRef, BlogFormProps>(
  ({ blog, onSave }, ref) => {
    const [tags, setTags] = useState<string[]>(blog?.tags || []);
    const [tagInput, setTagInput] = useState('');

    const {
      register,
      control,
      handleSubmit,
      formState: { errors },
      setValue,
    } = useForm<BlogFormData>({
      resolver: zodResolver(blogSchema),
      defaultValues: blog
        ? {
            title: blog.title,
            excerpt: blog.excerpt,
            status: blog.status,
            tags: blog.tags,
          }
        : {
            title: '',
            excerpt: '',
            status: 'draft',
            tags: [],
          },
    });

    const handleAddTag = () => {
      if (tagInput.trim() && !tags.includes(tagInput.trim())) {
        const newTags = [...tags, tagInput.trim()];
        setTags(newTags);
        setValue('tags', newTags);
        setTagInput('');
      }
    };

    const handleRemoveTag = (tag: string) => {
      const newTags = tags.filter((t) => t !== tag);
      setTags(newTags);
      setValue('tags', newTags);
    };

    const onSubmit = (data: BlogFormData) => {
      onSave({ ...data, tags });
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
              label="Excerpt"
              multiline
              rows={3}
              {...register('excerpt')}
              error={!!errors.excerpt}
              helperText={errors.excerpt?.message}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
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
                    <MenuItem value="draft">Draft</MenuItem>
                    <MenuItem value="published">Published</MenuItem>
                  </Select>
                )}
              />
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Tags
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                size="small"
                placeholder="Add tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                sx={{ flexGrow: 1 }}
              />
              <Button variant="outlined" onClick={handleAddTag}>
                Add
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {tags.map((tag) => (
                <Box
                  key={tag}
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
                  {tag}
                  <Button
                    size="small"
                    onClick={() => handleRemoveTag(tag)}
                    sx={{ minWidth: 'auto', p: 0.5 }}
                  >
                    ×
                  </Button>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </form>
    );
  }
);

BlogForm.displayName = 'BlogForm';

