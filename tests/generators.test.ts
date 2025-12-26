import { describe, expect, it } from "vitest";
import { generateTask } from "../src/logic/generators";
import { gcd, normalize } from "../src/engine/fractions";

const isSimplified = (num: bigint, den: bigint): boolean => {
  if (num === 0n) {
    return den === 1n;
  }
  return gcd(num < 0n ? -num : num, den) === 1n;
};

const expectTranslations = (task: { promptEn?: string; promptEs?: string; promptFr?: string }) => {
  expect(task.promptEn).toBeTruthy();
  expect(task.promptEs).toBeTruthy();
  expect(task.promptFr).toBeTruthy();
};

describe("task generators", () => {
  it("generates simplified free tasks for core subskills", () => {
    const subskills = [
      "S_MUL_01",
      "S_MUL_02",
      "S_MUL_03",
      "S_DIV_01",
      "S_DIV_02",
      "S_SIM_01",
      "S_MIS_01",
      "S_MIS_02",
      "S_MIS_03",
    ];

    for (const subskill of subskills) {
      for (let i = 0; i < 20; i += 1) {
        const task = generateTask(subskill);
        expect(task.type).toBe("free");
        expect(task.answer.den > 0n).toBe(true);
        expect(isSimplified(task.answer.num, task.answer.den)).toBe(true);
        expectTranslations(task);
      }
    }
  });

  it("generates visual tasks with valid specs", () => {
    const visualSkills = ["S_VIS_01", "S_VIS_02"];

    for (const subskill of visualSkills) {
      for (let i = 0; i < 10; i += 1) {
        const task = generateTask(subskill);
        expect(task.type).toBe("visual");
        expect(task.visual).toBeTruthy();
        expectTranslations(task);

        const visual = task.visual!;
        if (visual.type === "grid") {
          const total = (visual.rows ?? 0) * (visual.cols ?? 0);
          expect(total).toBeGreaterThan(0);
          expect(visual.shaded).toBeTypeOf("number");
          const expected = normalize(BigInt(visual.shaded ?? 0), BigInt(total));
          expect(task.answer).toEqual(expected);
        }
        if (visual.type === "circle") {
          const total = visual.sectors ?? 0;
          expect(total).toBeGreaterThan(0);
          expect(visual.shaded).toBeTypeOf("number");
          const expected = normalize(BigInt(visual.shaded ?? 0), BigInt(total));
          expect(task.answer).toEqual(expected);
        }
      }
    }
  });
});
