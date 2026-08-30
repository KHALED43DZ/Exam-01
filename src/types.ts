export type QuestionType = "text" | "mcq" | "matching" | "integration" | "quran";

export interface QuranAyah {
  id: string;
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  uthmani: string;
  searchText: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  prompt: string;
  points: number;
  options?: string[];
  answer?: string;
  quran?: {
    ayahId: string;
    surahName: string;
    ayahNumber: number;
    text: string;
    riwayah: "hafs" | "warsh";
  };
}

export interface Exam {
  id?: number;
  institution: string;
  subject: string;
  level: string;
  duration: string;
  teacher: string;
  title: string;
  questions: Question[];
  updatedAt: number;
}