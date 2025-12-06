export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImageUrl?: string;
  status: 'draft' | 'published';
  publishedAt?: string;
  scheduledPublishAt?: string;
  authorId: string;
  authorName: string;
  tags: string[];
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export const mockBlogs: Blog[] = [
  {
    id: '1',
    title: '10 Tips for Acing Your O-Level Exams',
    slug: '10-tips-for-acing-your-o-level-exams',
    excerpt: 'Discover proven strategies and tips to excel in your O-Level examinations.',
    coverImageUrl: 'https://picsum.photos/800/400?random=11',
    status: 'published',
    publishedAt: '2024-11-15T10:00:00Z',
    authorId: 'admin1',
    authorName: 'Admin User',
    tags: ['Exams', 'Study Tips', 'O-Level'],
    viewCount: 1250,
    createdAt: '2024-11-10T09:00:00Z',
    updatedAt: '2024-11-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'Understanding Advanced Physics Concepts',
    slug: 'understanding-advanced-physics-concepts',
    excerpt: 'A comprehensive guide to mastering advanced physics topics for A-Level students.',
    coverImageUrl: 'https://picsum.photos/800/400?random=12',
    status: 'published',
    publishedAt: '2024-11-20T14:30:00Z',
    authorId: 'admin1',
    authorName: 'Admin User',
    tags: ['Physics', 'A-Level', 'Study Guide'],
    viewCount: 980,
    createdAt: '2024-11-18T11:00:00Z',
    updatedAt: '2024-11-20T14:30:00Z',
  },
  {
    id: '3',
    title: 'The Future of Online Learning',
    slug: 'the-future-of-online-learning',
    excerpt: 'Exploring how technology is transforming education and learning experiences.',
    coverImageUrl: 'https://picsum.photos/800/400?random=13',
    status: 'draft',
    authorId: 'admin2',
    authorName: 'Content Creator',
    tags: ['Education', 'Technology', 'Online Learning'],
    viewCount: 0,
    createdAt: '2024-12-01T10:00:00Z',
    updatedAt: '2024-12-05T15:20:00Z',
  },
  {
    id: '4',
    title: 'Effective Study Techniques for Mathematics',
    slug: 'effective-study-techniques-for-mathematics',
    excerpt: 'Learn the best practices and techniques to improve your math skills.',
    coverImageUrl: 'https://picsum.photos/800/400?random=14',
    status: 'published',
    publishedAt: '2024-11-25T09:15:00Z',
    authorId: 'admin2',
    authorName: 'Content Creator',
    tags: ['Mathematics', 'Study Tips', 'Learning'],
    viewCount: 1560,
    createdAt: '2024-11-22T08:00:00Z',
    updatedAt: '2024-11-25T09:15:00Z',
  },
  {
    id: '5',
    title: 'Building Strong Study Habits',
    slug: 'building-strong-study-habits',
    excerpt: 'Essential habits that successful students develop for academic excellence.',
    coverImageUrl: 'https://picsum.photos/800/400?random=15',
    status: 'published',
    publishedAt: '2024-12-01T10:30:00Z',
    authorId: 'admin1',
    authorName: 'Admin User',
    tags: ['Study Habits', 'Productivity', 'Success'],
    viewCount: 890,
    createdAt: '2024-11-28T12:00:00Z',
    updatedAt: '2024-12-01T10:30:00Z',
  },
  {
    id: '6',
    title: 'Chemistry Lab Safety Guidelines',
    slug: 'chemistry-lab-safety-guidelines',
    excerpt: 'Important safety protocols every chemistry student should know and follow.',
    coverImageUrl: 'https://picsum.photos/800/400?random=16',
    status: 'published',
    publishedAt: '2024-12-05T11:45:00Z',
    authorId: 'admin2',
    authorName: 'Content Creator',
    tags: ['Chemistry', 'Safety', 'Lab'],
    viewCount: 720,
    createdAt: '2024-12-03T09:00:00Z',
    updatedAt: '2024-12-05T11:45:00Z',
  },
];

