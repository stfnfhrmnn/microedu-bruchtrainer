import type { TaskInstance, TaskTemplate } from "./models";
import { tasks } from "./tasks";
import { generateTask } from "./generators";

const makeSeed = (): string => `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;

export const toInstance = (task: TaskTemplate): TaskInstance => ({
  ...task,
  seed: makeSeed(),
});

export const getTasksForSubskill = (subskillId: string): TaskInstance[] => {
  const base = tasks.filter((task) => task.subskillId === subskillId);
  if (base.length > 0) {
    return base.map(toInstance);
  }
  return [generateTask(subskillId)];
};

export const getDiagnosisTasksForModule = (
  moduleId: string,
  count = 6
): TaskInstance[] => {
  const pool = tasks.filter((task) => task.moduleId === moduleId);
  if (pool.length === 0) {
    return [generateTask("S_MUL_01")];
  }
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, pool.length)).map(toInstance);
};

export const getTrainingTask = (subskillId: string, excludeTaskId?: string): TaskInstance => {
  const pool = tasks.filter((task) => task.subskillId === subskillId);
  if (pool.length > 0) {
    const candidates =
      excludeTaskId && pool.length > 1
        ? pool.filter((task) => task.id !== excludeTaskId)
        : pool;
    const choice = candidates[Math.floor(Math.random() * candidates.length)];
    return toInstance(choice);
  }
  return generateTask(subskillId);
};
