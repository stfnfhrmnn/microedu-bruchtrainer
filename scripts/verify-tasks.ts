import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  Fraction,
  div,
  gcd,
  mul,
  normalize,
  parseFraction,
} from "../src/engine/fractions";

type TaskExpr =
  | { op: "mul"; a: string; b: string }
  | { op: "div"; a: string; b: string }
  | { op: "simplify"; a: string }
  | { op: "mixedToImproper"; a: string }
  | { op: "missingFactor"; factor: string; result: string }
  | { op: "missingDivisor"; dividend: string; result: string }
  | { op: "missingDividend"; divisor: string; result: string }
  | { op: "visual"; shaded: number; total: number };

type TaskAnswer = { num: number; den: number };

type Task = {
  id: string;
  type: "free" | "mc" | "visual";
  answer: TaskAnswer;
  distractors?: TaskAnswer[];
  expr: TaskExpr;
  prompt?: string;
  promptEn?: string;
  promptEs?: string;
  promptFr?: string;
  visual?: {
    type?: "grid" | "circle";
    rows?: number;
    cols?: number;
    sectors?: number;
    shaded?: number;
    target?: number;
    mode?: "read" | "shade";
  };
};

const toFraction = (answer: TaskAnswer): Fraction => {
  const num = BigInt(answer.num);
  const den = BigInt(answer.den);
  if (den === 0n || den < 0n) {
    throw new Error("InvalidAnswerDenominator");
  }
  if (gcd(num, den) !== 1n && num !== 0n) {
    throw new Error("AnswerNotSimplified");
  }
  return normalize(num, den);
};

const evalExpr = (expr: TaskExpr): Fraction => {
  switch (expr.op) {
    case "mul":
      return mul(parseFraction(expr.a), parseFraction(expr.b));
    case "div":
      return div(parseFraction(expr.a), parseFraction(expr.b));
    case "simplify":
      return parseFraction(expr.a);
    case "mixedToImproper":
      return parseFraction(expr.a);
    case "missingFactor":
      return div(parseFraction(expr.result), parseFraction(expr.factor));
    case "missingDivisor":
      return div(parseFraction(expr.dividend), parseFraction(expr.result));
    case "missingDividend":
      return mul(parseFraction(expr.result), parseFraction(expr.divisor));
    case "visual":
      return normalize(BigInt(expr.shaded), BigInt(expr.total));
    default: {
      const neverExpr: never = expr;
      return neverExpr;
    }
  }
};

const extractTokens = (text: string): string[] => {
  const matches = text.match(/-?\d+\s+\d+\/\d+|-?\d+\/\d+|-?\d+/g);
  return matches ? matches.map((value) => value.trim()) : [];
};

const checkPromptMatchesExpr = (prompt: string, expr: TaskExpr): string[] => {
  const issues: string[] = [];
  const tokens = extractTokens(prompt);
  const expectToken = (value: string, label: string) => {
    if (!tokens.includes(value)) {
      issues.push(`Prompt missing ${label} (${value})`);
    }
  };

  switch (expr.op) {
    case "mul":
    case "div":
      expectToken(expr.a, "operand a");
      expectToken(expr.b, "operand b");
      break;
    case "simplify":
    case "mixedToImproper":
      expectToken(expr.a, "operand");
      break;
    case "missingFactor":
      expectToken(expr.factor, "factor");
      expectToken(expr.result, "result");
      break;
    case "missingDivisor":
      expectToken(expr.dividend, "dividend");
      expectToken(expr.result, "result");
      break;
    case "missingDividend":
      expectToken(expr.divisor, "divisor");
      expectToken(expr.result, "result");
      break;
    case "visual":
      break;
    default:
      break;
  }
  return issues;
};

const validateVisual = (task: Task): string[] => {
  const issues: string[] = [];
  if (!task.visual) {
    return ["Visual task missing visual spec"];
  }
  const visual = task.visual;
  if (!visual.type) {
    issues.push("Visual spec missing type");
    return issues;
  }
  const total =
    visual.type === "grid"
      ? (visual.rows ?? 0) * (visual.cols ?? 0)
      : visual.sectors ?? 0;
  if (total <= 0) {
    issues.push("Visual total parts must be > 0");
    return issues;
  }
  if (visual.mode === "read") {
    if (typeof visual.shaded !== "number") {
      issues.push("Visual read mode missing shaded");
    } else if (visual.shaded < 0 || visual.shaded > total) {
      issues.push("Visual shaded out of range");
    }
  }
  if (visual.mode === "shade") {
    if (typeof visual.target !== "number") {
      issues.push("Visual shade mode missing target");
    } else if (visual.target < 0 || visual.target > total) {
      issues.push("Visual target out of range");
    }
  }
  if (task.expr.op === "visual") {
    const expectedTotal = task.expr.total;
    if (expectedTotal !== total) {
      issues.push("Expr total does not match visual total");
    }
    const expectedShaded = task.expr.shaded;
    const visualValue = visual.mode === "shade" ? visual.target : visual.shaded;
    if (typeof visualValue === "number" && expectedShaded !== visualValue) {
      issues.push("Expr shaded does not match visual spec");
    }
  }
  return issues;
};

const verifyTask = (task: Task): string[] => {
  const issues: string[] = [];
  if (!task.expr) {
    issues.push("Missing expr");
    return issues;
  }
  const expected = evalExpr(task.expr);
  let actual: Fraction;

  try {
    actual = toFraction(task.answer);
  } catch (error) {
    issues.push(`Answer invalid: ${(error as Error).message}`);
    return issues;
  }

  if (expected.num !== actual.num || expected.den !== actual.den) {
    issues.push(
      `Answer mismatch: expected ${expected.num.toString()}/${expected.den.toString()}`
    );
  }

  const prompts = [task.prompt, task.promptEn, task.promptEs, task.promptFr].filter(
    Boolean
  ) as string[];
  if (task.expr.op !== "visual") {
    for (const prompt of prompts) {
      issues.push(...checkPromptMatchesExpr(prompt, task.expr));
    }
  }
  if (task.type === "visual") {
    issues.push(...validateVisual(task));
  }

  if (task.type === "mc" && task.distractors) {
    for (const distractor of task.distractors) {
      try {
        const distractorFraction = toFraction(distractor);
        if (
          distractorFraction.num === actual.num &&
          distractorFraction.den === actual.den
        ) {
          issues.push("Distractor equals answer");
        }
      } catch (error) {
        issues.push(`Distractor invalid: ${(error as Error).message}`);
      }
    }
  }

  return issues;
};

const run = (): void => {
  const filePath = resolve("src/data/seed-tasks.json");
  const raw = readFileSync(filePath, "utf-8");
  const tasks = JSON.parse(raw) as Task[];

  const failures: string[] = [];

  for (const task of tasks) {
    const issues = verifyTask(task);
    if (issues.length > 0) {
      failures.push(`${task.id}: ${issues.join(", ")}`);
    }
  }

  if (failures.length > 0) {
    console.error("Task verification failed:");
    for (const failure of failures) {
      console.error(`- ${failure}`);
    }
    process.exit(1);
  }

  console.log(`Verified ${tasks.length} tasks successfully.`);
};

run();
