export interface HelpdeskTicket {
  id: string;
  subject: string;
  description: string;
  userId: string;
  userName: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
  assignedToName?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export const mockHelpdeskTickets: HelpdeskTicket[] = [
  {
    id: '1',
    subject: 'Cannot access my account',
    description: 'I am unable to log in to my account. I keep getting an error message.',
    userId: '1',
    userName: 'John Doe',
    status: 'open',
    priority: 'high',
    createdAt: '2024-12-18T10:30:00Z',
    updatedAt: '2024-12-18T10:30:00Z',
  },
  {
    id: '2',
    subject: 'Payment issue',
    description: 'I was charged twice for my subscription. Please refund one of the charges.',
    userId: '2',
    userName: 'Jane Smith',
    status: 'in_progress',
    priority: 'high',
    assignedTo: 'admin1',
    assignedToName: 'Admin User',
    createdAt: '2024-12-17T14:20:00Z',
    updatedAt: '2024-12-19T09:15:00Z',
  },
  {
    id: '3',
    subject: 'Question about manual content',
    description: 'I have a question about the content in the Mathematics O-Level manual.',
    userId: '4',
    userName: 'Sarah Williams',
    status: 'resolved',
    priority: 'medium',
    assignedTo: 'admin2',
    assignedToName: 'Content Creator',
    createdAt: '2024-12-15T11:00:00Z',
    updatedAt: '2024-12-16T15:30:00Z',
    resolvedAt: '2024-12-16T15:30:00Z',
  },
  {
    id: '4',
    subject: 'Feature request',
    description: 'It would be great to have a dark mode option in the app.',
    userId: '5',
    userName: 'David Brown',
    status: 'open',
    priority: 'low',
    createdAt: '2024-12-19T16:45:00Z',
    updatedAt: '2024-12-19T16:45:00Z',
  },
  {
    id: '5',
    subject: 'Download not working',
    description: 'I am unable to download the PDF manual. The download button is not responding.',
    userId: '1',
    userName: 'John Doe',
    status: 'in_progress',
    priority: 'medium',
    assignedTo: 'admin1',
    assignedToName: 'Admin User',
    createdAt: '2024-12-16T09:20:00Z',
    updatedAt: '2024-12-17T11:00:00Z',
  },
  {
    id: '6',
    subject: 'Account deletion request',
    description: 'I would like to delete my account and all associated data.',
    userId: '6',
    userName: 'Emily Davis',
    status: 'closed',
    priority: 'low',
    assignedTo: 'admin1',
    assignedToName: 'Admin User',
    createdAt: '2024-12-10T13:15:00Z',
    updatedAt: '2024-12-12T10:00:00Z',
    resolvedAt: '2024-12-12T10:00:00Z',
  },
];

