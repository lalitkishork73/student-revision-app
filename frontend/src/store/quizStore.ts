import { create } from "zustand";
import { generateQuiz, submitQuiz } from "@/api/quizService";

interface QuizState {
  questions: any[];
  subject: string | null;
  type: string | null;
  answers: Record<string, string>; // questionId -> selectedAnswer
  loading: boolean;

  fetchQuiz: (pdfVectorId: string, quizType: string) => Promise<void>;
  selectAnswer: (questionId: string, answer: string) => void;
  submit: () => Promise<any>;
  reset: () => void;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  questions: [],
  subject: null,
  type: null,
  answers: {},
  loading: false,

  fetchQuiz: async (pdfVectorId, quizType) => {
    set({ loading: true });
    try {
      const res = await generateQuiz({ pdfId: pdfVectorId, quizType });
      // Correct the API response parsing
      const questions = res?.quiz?.questions || [];
      const subject = questions?.[0]?.subject || null;
      const type = questions?.[0]?.type || null;

      set({
        questions,
        subject,
        type,
        answers: {},
        loading: false,
      });
    } catch (err) {
      console.error("Error fetching quiz:", err);
      set({ loading: false });
    }
  },

  selectAnswer: (questionId, answer) => {
    const { answers } = get();
    set({
      answers: { ...answers, [questionId]: answer },
    });
  },

  submit: async () => {
    const { answers, subject, type } = get();
    const formatted = {
      subject: subject!,
      type: type!,
      answers: Object.entries(answers).map(([questionId, selectedOption]) => ({
        questionId,
        selectedOption,
      })),
    };
    return await submitQuiz(formatted);
  },

  reset: () => {
    set({
      questions: [],
      subject: null,
      type: null,
      answers: {},
      loading: false,
    });
  },
}));
