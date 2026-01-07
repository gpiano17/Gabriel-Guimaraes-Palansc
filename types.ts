
export enum Difficulty {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced',
  EXPERT = 'Expert'
}

export enum Genre {
  CLASSICAL = 'Classical',
  JAZZ = 'Jazz',
  POP = 'Pop',
  ROCK = 'Rock',
  BLUES = 'Blues',
  PRODUCTION = 'Production',
  ALL = 'All'
}

export interface ChordData {
  name: string;
  notes: string[]; // e.g., ["C", "E", "G"]
  root: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  genre: Genre;
  difficulty: Difficulty;
  content: string;
  xpValue: number;
  imageUrl: string;
  chords?: ChordData[];
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface UserProgress {
  totalXp: number;
  completedLessons: string[];
  currentStreak: number;
  dailyGoal: number;
  completedToday: number;
}

export interface AIResponse {
  text: string;
  imageUrl?: string;
  videoUrl?: string;
  searchSources?: Array<{ title: string; uri: string }>;
}
