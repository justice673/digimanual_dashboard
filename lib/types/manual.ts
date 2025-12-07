export interface ManualUnit {
  id: string;
  manualId: string;
  title: string; // e.g., "Unit 1", "Unit 2"
  description?: string;
  orderIndex: number;
  questionCount: number;
}

export interface Manual {
  id: string;
  title: string;
  description: string;
  subject: string;
  level: 'O' | 'A';
  units: ManualUnit[]; // Changed from topics to units
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
  unitId: string; // Link question to a specific unit
  questionText: string;
  questionType: 'multiple_choice' | 'short_answer' | 'essay';
  answerKey: string;
  difficultyLevel: 'easy' | 'medium' | 'hard';
  orderIndex: number;
}

