// FIX: Define all the necessary types for the application.
export type Language = 'it' | 'en' | 'pt' | 'es' | 'fr' | 'de';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Topic {
  id: string;
  icon: string;
}

export interface Question {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface GameResult {
  topic: string;
  score: number;
  correct: number;
  total: number;
  difficulty: Difficulty;
  date: string;
}
