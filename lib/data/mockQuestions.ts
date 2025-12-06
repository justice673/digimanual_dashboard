export interface Question {
  id: string;
  title: string;
  content: string;
  userId: string;
  userName: string;
  manualId?: string;
  manualName?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  answerCount: number;
}

export const mockQuestions: Question[] = [
  {
    id: '1',
    title: 'How to solve quadratic equations?',
    content: 'I am having trouble understanding how to solve quadratic equations. Can someone explain the steps?',
    userId: '1',
    userName: 'John Doe',
    manualId: '1',
    manualName: 'Mathematics O-Level Complete Guide',
    status: 'approved',
    createdAt: '2024-12-15T10:30:00Z',
    answerCount: 3,
  },
  {
    id: '2',
    title: 'What is the difference between velocity and speed?',
    content: 'I am confused about the difference between velocity and speed in physics.',
    userId: '2',
    userName: 'Jane Smith',
    manualId: '2',
    manualName: 'Physics A-Level Advanced Topics',
    status: 'pending',
    createdAt: '2024-12-18T14:20:00Z',
    answerCount: 0,
  },
  {
    id: '3',
    title: 'Chemical bonding explanation needed',
    content: 'Can someone explain ionic and covalent bonding with examples?',
    userId: '4',
    userName: 'Sarah Williams',
    status: 'approved',
    createdAt: '2024-12-10T09:15:00Z',
    answerCount: 5,
  },
  {
    id: '4',
    title: 'Cell division process',
    content: 'I need help understanding mitosis and meiosis.',
    userId: '5',
    userName: 'David Brown',
    manualId: '4',
    manualName: 'Biology A-Level Complete Course',
    status: 'pending',
    createdAt: '2024-12-19T16:45:00Z',
    answerCount: 1,
  },
  {
    id: '5',
    title: 'Poetry analysis techniques',
    content: 'What are the best techniques for analyzing poetry in English literature?',
    userId: '1',
    userName: 'John Doe',
    manualId: '5',
    manualName: 'English Literature O-Level',
    status: 'approved',
    createdAt: '2024-12-12T11:30:00Z',
    answerCount: 4,
  },
  {
    id: '6',
    title: 'Database normalization',
    content: 'Can someone explain database normalization with examples?',
    userId: '2',
    userName: 'Jane Smith',
    manualId: '6',
    manualName: 'Computer Science A-Level',
    status: 'rejected',
    createdAt: '2024-12-08T13:20:00Z',
    answerCount: 0,
  },
];

