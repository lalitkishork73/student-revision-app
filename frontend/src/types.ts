export type PDFItem = {
  id: string;
  title: string;
  url: string;
  pages?: number;
};

export type QuizOption = {
  id: string;
  text: string;
};

export type QuizQuestion = {
  id: string;
  type: 'mcq' | 'saq' | 'laq';
  question: string;
  options?: QuizOption[];
  correctOptionId?: string;
  marks?: number;
  topic?: string;
};

export type QuizAttempt = {
  id?: string;
  userId?: string;
  pdfIds: string[];
  questions: QuizQuestion[];
  answers: Record<string, string | string[]>;
  score?: number;
  createdAt?: string;
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  citations?: { page: number; snippet: string }[];
  createdAt?: string;
};

export type ProgressSummary = {
  topic: string;
  percent: number;
  attempts: number;
};
