import { StudentActivity } from '@/lib/types/student';

export const mockStudentActivity: Record<string, StudentActivity[]> = {
  '1': [
    {
      id: 'a1',
      type: 'login',
      description: 'Logged in to the platform',
      timestamp: '2024-12-20T14:25:00Z',
    },
    {
      id: 'a2',
      type: 'manual_access',
      description: 'Accessed manual: Mathematics O-Level',
      timestamp: '2024-12-20T13:15:00Z',
      metadata: { manualId: 'm1', manualName: 'Mathematics O-Level' },
    },
    {
      id: 'a3',
      type: 'question_posted',
      description: 'Posted a question in Mathematics O-Level',
      timestamp: '2024-12-19T10:30:00Z',
      metadata: { questionId: 'q1' },
    },
    {
      id: 'a4',
      type: 'comment_posted',
      description: 'Commented on a question',
      timestamp: '2024-12-18T16:45:00Z',
      metadata: { commentId: 'c1' },
    },
  ],
  '2': [
    {
      id: 'b1',
      type: 'login',
      description: 'Logged in to the platform',
      timestamp: '2024-12-19T16:45:00Z',
    },
    {
      id: 'b2',
      type: 'manual_access',
      description: 'Accessed manual: Physics A-Level',
      timestamp: '2024-12-19T15:20:00Z',
      metadata: { manualId: 'm2', manualName: 'Physics A-Level' },
    },
  ],
  '3': [
    {
      id: 'c1',
      type: 'login',
      description: 'Logged in to the platform',
      timestamp: '2024-11-15T10:00:00Z',
    },
  ],
};

