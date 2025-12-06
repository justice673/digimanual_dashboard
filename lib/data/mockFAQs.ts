export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  orderIndex: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export const mockFAQs: FAQ[] = [
  {
    id: '1',
    question: 'How do I create an account?',
    answer: 'You can create an account by clicking on the "Sign Up" button on the homepage. Fill in your details and verify your email address.',
    category: 'Account',
    orderIndex: 1,
    status: 'active',
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z',
  },
  {
    id: '2',
    question: 'How do I access the manuals?',
    answer: 'Once you have an account, you can browse manuals by subject and level. Click on any manual to view its content.',
    category: 'Manuals',
    orderIndex: 2,
    status: 'active',
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z',
  },
  {
    id: '3',
    question: 'Can I download manuals?',
    answer: 'Yes, registered users can download manuals in PDF format. Look for the download button on the manual page.',
    category: 'Manuals',
    orderIndex: 3,
    status: 'active',
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z',
  },
  {
    id: '4',
    question: 'How do I post a question?',
    answer: 'Navigate to the community section and click "Ask a Question". Make sure to select the relevant manual or topic.',
    category: 'Community',
    orderIndex: 4,
    status: 'active',
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z',
  },
  {
    id: '5',
    question: 'What subscription plans are available?',
    answer: 'We offer monthly and annual subscription plans. Check the pricing page for current rates and features.',
    category: 'Subscription',
    orderIndex: 5,
    status: 'active',
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z',
  },
  {
    id: '6',
    question: 'How do I contact support?',
    answer: 'You can contact our support team through the helpdesk section in your dashboard or email us at support@dimanual.com.',
    category: 'Support',
    orderIndex: 6,
    status: 'active',
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z',
  },
];

