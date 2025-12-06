export interface Manual {
  id: string;
  title: string;
  description: string;
  subject: string;
  level: 'O' | 'A';
  topics: string[];
  coverImageUrl?: string;
  status: 'draft' | 'published';
  publishedAt?: string;
  scheduledPublishAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  accessCount: number;
  downloadCount: number;
  questionCount: number;
}

export interface ManualQuestion {
  id: string;
  manualId: string;
  questionText: string;
  questionType: 'multiple_choice' | 'short_answer' | 'essay';
  answerKey: string;
  difficultyLevel: 'easy' | 'medium' | 'hard';
  orderIndex: number;
}

