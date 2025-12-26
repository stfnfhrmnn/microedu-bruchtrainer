import type { Attempt, ModuleStatus } from "./models";

const confidenceValue = (confidence: Attempt["confidence"]): number => {
  if (confidence === "high") {
    return 1;
  }
  if (confidence === "medium") {
    return 0.5;
  }
  return 0;
};

export const evaluateModuleStatus = (
  attempts: Attempt[],
  moduleId: string,
  subskillLookup: (taskId: string) => { moduleId: string } | undefined
): ModuleStatus => {
  const relevant = attempts.filter(
    (attempt) =>
      subskillLookup(attempt.taskId)?.moduleId === moduleId ||
      attempt.moduleId === moduleId
  );

  if (relevant.length === 0) {
    return {
      moduleId,
      correctnessRate: 0,
      confidenceRate: 0,
      color: "red",
    };
  }

  const correctCount = relevant.filter((attempt) => attempt.isCorrect).length;
  const correctnessRate = correctCount / relevant.length;
  const confidenceRate =
    relevant.reduce((sum, attempt) => sum + confidenceValue(attempt.confidence), 0) /
    relevant.length;

  let color: ModuleStatus["color"] = "red";
  if (correctnessRate >= 0.8 && confidenceRate >= 0.6) {
    color = "green";
  } else if (correctnessRate >= 0.6) {
    color = "yellow";
  }

  return {
    moduleId,
    correctnessRate,
    confidenceRate,
    color,
  };
};

export const isSubskillMastered = (
  attempts: Attempt[],
  subskillId: string,
  subskillLookup: (taskId: string) => { subskillId: string } | undefined
): boolean => {
  const relevant = attempts
    .filter(
      (attempt) =>
        subskillLookup(attempt.taskId)?.subskillId === subskillId ||
        attempt.subskillId === subskillId
    )
    .slice(-10);

  if (relevant.length < 10) {
    return false;
  }

  const correctCount = relevant.filter((attempt) => attempt.isCorrect).length;
  const highConfidenceCount = relevant.filter(
    (attempt) => attempt.confidence === "high"
  ).length;

  return correctCount >= 8 && highConfidenceCount >= 5;
};
