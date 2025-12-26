import type { Fraction } from "../engine/fractions";

export type Module = {
  id: string;
  title: string;
  titleEn?: string;
  titleEs?: string;
  titleFr?: string;
};

export type Subskill = {
  id: string;
  moduleId: string;
  title: string;
  titleEn?: string;
  titleEs?: string;
  titleFr?: string;
};

export type TaskType = "free" | "mc" | "visual";

export type VisualSpec = {
  type: "grid" | "circle";
  rows?: number;
  cols?: number;
  sectors?: number;
  shaded?: number;
  target?: number;
  mode?: "read" | "shade";
};

export type TaskTemplate = {
  id: string;
  moduleId: string;
  subskillId: string;
  type: TaskType;
  prompt: string;
  promptEn?: string;
  promptEs?: string;
  promptFr?: string;
  answer: Fraction;
  distractors?: Fraction[];
  steps?: string[];
  stepsEn?: string[];
  stepsEs?: string[];
  stepsFr?: string[];
  solutions?: { title?: string; steps: string[] }[];
  solutionsEn?: { title?: string; steps: string[] }[];
  solutionsEs?: { title?: string; steps: string[] }[];
  solutionsFr?: { title?: string; steps: string[] }[];
  tags?: string[];
  visual?: VisualSpec;
};

export type TaskInstance = TaskTemplate & {
  seed: string;
};

export type Attempt = {
  taskId: string;
  moduleId?: string;
  subskillId?: string;
  isCorrect: boolean;
  userAnswer: string;
  timeMs: number;
  confidence: "high" | "medium" | "low";
  timestamp: number;
  errorType?: string;
};

export type ModuleStatus = {
  moduleId: string;
  correctnessRate: number;
  confidenceRate: number;
  color: "green" | "yellow" | "red";
};
