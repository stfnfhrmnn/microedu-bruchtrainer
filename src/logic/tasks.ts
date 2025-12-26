import seedTasks from "../data/seed-tasks.json";
import { parseFraction } from "../engine/fractions";
import type { TaskTemplate } from "./models";

export const tasks: TaskTemplate[] = (seedTasks as unknown as any[]).map(
  (task) => ({
    id: task.id,
    moduleId: task.moduleId,
    subskillId: task.subskillId,
    type: task.type,
    prompt: task.prompt,
    promptEn: task.promptEn,
    promptEs: task.promptEs,
    promptFr: task.promptFr,
    answer: parseFraction(`${task.answer.num}/${task.answer.den}`),
    distractors: task.distractors
      ? task.distractors.map((d: { num: number; den: number }) =>
          parseFraction(`${d.num}/${d.den}`)
        )
      : undefined,
    steps: task.steps,
    stepsEn: task.stepsEn,
    stepsEs: task.stepsEs,
    stepsFr: task.stepsFr,
    solutions: task.solutions,
    solutionsEn: task.solutionsEn,
    solutionsEs: task.solutionsEs,
    solutionsFr: task.solutionsFr,
    tags: task.tags,
    visual: task.visual,
  })
);

export const taskIndex = new Map(tasks.map((task) => [task.id, task]));

export const taskLookupById = (taskId: string): TaskTemplate | undefined => {
  return taskIndex.get(taskId);
};
