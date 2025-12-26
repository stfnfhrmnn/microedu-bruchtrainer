import type { Attempt, Subskill } from "./models";
import { isSubskillMastered } from "./progress";

export type SubskillStats = {
  subskillId: string;
  attempts: number;
  correctRate: number;
  highConfidenceRate: number;
  errorRate: number;
};

export const buildSubskillStats = (
  attempts: Attempt[],
  subskills: Subskill[],
  taskLookup: (taskId: string) => { subskillId: string } | undefined
): SubskillStats[] => {
  return subskills.map((subskill) => {
    const related = attempts.filter(
      (attempt) =>
        taskLookup(attempt.taskId)?.subskillId === subskill.id ||
        attempt.subskillId === subskill.id
    );
    if (related.length === 0) {
      return {
        subskillId: subskill.id,
        attempts: 0,
        correctRate: 0,
        highConfidenceRate: 0,
        errorRate: 1,
      };
    }

    const correctCount = related.filter((attempt) => attempt.isCorrect).length;
    const highConfidenceCount = related.filter(
      (attempt) => attempt.confidence === "high"
    ).length;
  const errorCount = related.filter((attempt) => !attempt.isCorrect).length;

    return {
      subskillId: subskill.id,
      attempts: related.length,
      correctRate: correctCount / related.length,
      highConfidenceRate: highConfidenceCount / related.length,
      errorRate: errorCount / related.length,
    };
  });
};

const weightedPick = (entries: Array<{ id: string; weight: number }>): string => {
  const total = entries.reduce((sum, entry) => sum + entry.weight, 0);
  const pick = Math.random() * total;
  let current = 0;
  for (const entry of entries) {
    current += entry.weight;
    if (pick <= current) {
      return entry.id;
    }
  }
  return entries[entries.length - 1].id;
};

export const pickTrainingSubskill = (
  attempts: Attempt[],
  subskills: Subskill[],
  taskLookup: (taskId: string) => { subskillId: string } | undefined
): string => {
  const stats = buildSubskillStats(attempts, subskills, taskLookup);

  const weighted = stats.map((stat) => {
    const mastered = isSubskillMastered(attempts, stat.subskillId, taskLookup);
    const baseWeight = mastered ? 0.2 : 1;
    const needBoost = 1 - stat.correctRate + (1 - stat.highConfidenceRate);
    const errorBoost = 1 + stat.errorRate * 1.5;
    return {
      id: stat.subskillId,
      weight: Math.max(0.1, baseWeight * needBoost * errorBoost),
    };
  });

  return weightedPick(weighted);
};
