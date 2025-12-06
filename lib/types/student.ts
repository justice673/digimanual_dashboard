export interface Student {
  id: string;
  name: string;
  email: string;
  gender: 'male' | 'female' | 'other';
  status: 'active' | 'inactive';
  registrationDate: string;
  lastActive: string;
  subscriptionStatus: 'active' | 'expired' | 'none';
  enrolledManuals: number;
  totalQuestions: number;
  totalComments: number;
}

export interface StudentActivity {
  id: string;
  type: 'login' | 'manual_access' | 'question_posted' | 'comment_posted';
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

