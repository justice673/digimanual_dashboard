export interface Comment {
  id: string;
  content: string;
  userId: string;
  userName: string;
  entityType: 'manual' | 'question' | 'blog';
  entityId: string;
  parentId?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export const mockComments: Comment[] = [
  {
    id: '1',
    content: 'This manual is very helpful! Thank you for the detailed explanations.',
    userId: '1',
    userName: 'John Doe',
    entityType: 'manual',
    entityId: '1',
    status: 'approved',
    createdAt: '2024-12-15T10:45:00Z',
  },
  {
    id: '2',
    content: 'I have a question about the example on page 45. Can someone clarify?',
    userId: '2',
    userName: 'Jane Smith',
    entityType: 'manual',
    entityId: '2',
    status: 'pending',
    createdAt: '2024-12-18T15:20:00Z',
  },
  {
    id: '3',
    content: 'Great explanation! This helped me understand the concept better.',
    userId: '4',
    userName: 'Sarah Williams',
    entityType: 'question',
    entityId: '1',
    status: 'approved',
    createdAt: '2024-12-15T11:30:00Z',
  },
  {
    id: '4',
    content: 'I disagree with this answer. The correct approach should be...',
    userId: '5',
    userName: 'David Brown',
    entityType: 'question',
    entityId: '3',
    status: 'pending',
    createdAt: '2024-12-19T17:00:00Z',
  },
  {
    id: '5',
    content: 'This blog post is very informative. Keep up the good work!',
    userId: '1',
    userName: 'John Doe',
    entityType: 'blog',
    entityId: '1',
    status: 'approved',
    createdAt: '2024-12-10T09:20:00Z',
  },
  {
    id: '6',
    content: 'I found a typo on line 3. Should be "their" not "there".',
    userId: '2',
    userName: 'Jane Smith',
    entityType: 'blog',
    entityId: '2',
    status: 'rejected',
    createdAt: '2024-12-08T14:15:00Z',
  },
];

