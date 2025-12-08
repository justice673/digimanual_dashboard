export type TransactionType = 'income' | 'expense';
export type TransactionStatus = 'pending' | 'completed' | 'cancelled';
export type TransactionCategory =
  | 'subscription'
  | 'manual_sales'
  | 'refund'
  | 'salary'
  | 'marketing'
  | 'infrastructure'
  | 'other';

export interface FinanceTransaction {
  id: string;
  type: TransactionType;
  amount: number;
  currency: string;
  description: string;
  category: TransactionCategory;
  status: TransactionStatus;
  date: string;
  reference?: string;
  studentId?: string;
  studentName?: string;
  manualId?: string;
  manualTitle?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

