export interface ActivityLog {
  id: string;
  adminId: string;
  adminName: string;
  actionType: string;
  entityType: string;
  entityId: string;
  description: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

export const mockActivityLogs: ActivityLog[] = [
  {
    id: '1',
    adminId: 'admin1',
    adminName: 'Admin User',
    actionType: 'create',
    entityType: 'manual',
    entityId: '1',
    description: 'Created manual: Mathematics O-Level Complete Guide',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    createdAt: '2024-01-10T09:00:00Z',
  },
  {
    id: '2',
    adminId: 'admin2',
    adminName: 'Content Creator',
    actionType: 'update',
    entityType: 'blog',
    entityId: '1',
    description: 'Updated blog: 10 Tips for Acing Your O-Level Exams',
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    createdAt: '2024-11-12T14:30:00Z',
  },
  {
    id: '3',
    adminId: 'admin3',
    adminName: 'Community Moderator',
    actionType: 'approve',
    entityType: 'question',
    entityId: '1',
    description: 'Approved question: How to solve quadratic equations?',
    ipAddress: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64)',
    createdAt: '2024-12-15T10:35:00Z',
  },
  {
    id: '4',
    adminId: 'admin1',
    adminName: 'Admin User',
    actionType: 'delete',
    entityType: 'student',
    entityId: '7',
    description: 'Deleted student account: test@example.com',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    createdAt: '2024-12-18T11:20:00Z',
  },
  {
    id: '5',
    adminId: 'admin2',
    adminName: 'Content Creator',
    actionType: 'publish',
    entityType: 'manual',
    entityId: '4',
    description: 'Published manual: Biology A-Level Complete Course',
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    createdAt: '2024-04-05T09:15:00Z',
  },
  {
    id: '6',
    adminId: 'admin4',
    adminName: 'Finance Manager',
    actionType: 'view',
    entityType: 'report',
    entityId: 'revenue-2024',
    description: 'Viewed revenue report for 2024',
    ipAddress: '192.168.1.103',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    createdAt: '2024-12-19T15:45:00Z',
  },
];

