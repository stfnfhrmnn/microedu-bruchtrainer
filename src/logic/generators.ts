import { formatFraction, mul, div, parseFraction, simplify } from "../engine/fractions";
import { moduleIdForSubskill } from "./modules";
import type { TaskInstance } from "./models";

export const generatorSubskills = new Set([
  "S_VIS_01",
  "S_VIS_02",
  "S_MUL_01",
  "S_MUL_02",
  "S_MUL_03",
  "S_DIV_01",
  "S_DIV_02",
  "S_SIM_01",
  "S_MIS_01",
  "S_MIS_02",
  "S_MIS_03",
]);

export const canGenerateTask = (subskillId: string): boolean => {
  return generatorSubskills.has(subskillId);
};

const randInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const makeSeed = (): string => `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;

const fractionString = (num: number, den: number): string => `${num}/${den}`;

const pickFraction = (minNum: number, maxNum: number, minDen: number, maxDen: number) => {
  const num = randInt(minNum, maxNum);
  const den = randInt(minDen, maxDen);
  return { num, den, text: fractionString(num, den) };
};

const buildTask = (
  subskillId: string,
  prompt: string,
  answerText: string,
  tags: string[],
  promptEn?: string,
  promptEs?: string,
  promptFr?: string
): TaskInstance => {
  const answer = parseFraction(answerText);
  return {
    id: `GEN_${subskillId}_${makeSeed()}`,
    moduleId: moduleIdForSubskill(subskillId),
    subskillId,
    type: "free",
    prompt,
    promptEn,
    promptEs,
    promptFr,
    answer,
    tags,
    seed: makeSeed(),
  };
};

const buildVisualTask = (
  subskillId: string,
  prompt: string,
  answerText: string,
  visual: TaskInstance["visual"],
  promptEn?: string,
  promptEs?: string,
  promptFr?: string
): TaskInstance => {
  const answer = parseFraction(answerText);
  return {
    id: `GEN_${subskillId}_${makeSeed()}`,
    moduleId: moduleIdForSubskill(subskillId),
    subskillId,
    type: "visual",
    prompt,
    promptEn,
    promptEs,
    promptFr,
    answer,
    visual,
    seed: makeSeed(),
  };
};

export const generateTask = (subskillId: string): TaskInstance => {
  switch (subskillId) {
    case "S_VIS_01": {
      const cols = 4;
      const rows = 2;
      const shaded = randInt(2, 6);
      const prompt = "Wie viel ist schattiert?";
      const promptEn = "How much is shaded?";
      const promptEs = "¿Cuánto está sombreado?";
      const promptFr = "Quelle part est colorée ?";
      return buildVisualTask(
        subskillId,
        prompt,
        `${shaded}/${rows * cols}`,
        { type: "grid", rows, cols, shaded, mode: "read" },
        promptEn,
        promptEs,
        promptFr
      );
    }
    case "S_VIS_02": {
      const sectors = 12;
      const shaded = randInt(3, 8);
      const prompt = "Wie viel ist schattiert?";
      const promptEn = "How much is shaded?";
      const promptEs = "¿Cuánto está sombreado?";
      const promptFr = "Quelle part est colorée ?";
      return buildVisualTask(
        subskillId,
        prompt,
        `${shaded}/${sectors}`,
        { type: "circle", sectors, shaded, mode: "read" },
        promptEn,
        promptEs,
        promptFr
      );
    }
    case "S_MUL_01": {
      const aNum = randInt(1, 5);
      const aDen = randInt(2, 8);
      const bNum = randInt(1, 5);
      const bDen = randInt(2, 8);
      const prompt = `Berechne: ${fractionString(aNum, aDen)} * ${fractionString(bNum, bDen)}`;
      const promptEn = `Calculate: ${fractionString(aNum, aDen)} * ${fractionString(
        bNum,
        bDen
      )}`;
      const answer = formatFraction(mul(parseFraction(`${aNum}/${aDen}`), parseFraction(`${bNum}/${bDen}`)));
      const promptEs = `Calcula: ${fractionString(aNum, aDen)} * ${fractionString(bNum, bDen)}`;
      const promptFr = `Calcule : ${fractionString(aNum, aDen)} * ${fractionString(
        bNum,
        bDen
      )}`;
      return buildTask(subskillId, prompt, answer, ["multiply"], promptEn, promptEs, promptFr);
    }
    case "S_MUL_02": {
      const aNum = randInt(2, 9);
      const aDen = randInt(3, 12);
      const bNum = randInt(2, 9);
      const bDen = randInt(3, 12);
      const prompt = `Berechne und kürze: ${fractionString(aNum, aDen)} * ${fractionString(
        bNum,
        bDen
      )}`;
      const promptEn = `Calculate and simplify: ${fractionString(
        aNum,
        aDen
      )} * ${fractionString(bNum, bDen)}`;
      const answer = formatFraction(mul(parseFraction(`${aNum}/${aDen}`), parseFraction(`${bNum}/${bDen}`)));
      const promptEs = `Calcula y simplifica: ${fractionString(
        aNum,
        aDen
      )} * ${fractionString(bNum, bDen)}`;
      const promptFr = `Calcule et simplifie : ${fractionString(
        aNum,
        aDen
      )} * ${fractionString(bNum, bDen)}`;
      return buildTask(
        subskillId,
        prompt,
        answer,
        ["multiply", "simplify"],
        promptEn,
        promptEs,
        promptFr
      );
    }
    case "S_MUL_03": {
      const aNum = randInt(2, 12);
      const aDen = randInt(2, 12);
      const factor = randInt(2, 6);
      const bNum = factor * randInt(2, 6);
      const bDen = factor * randInt(2, 6);
      const prompt = `Berechne mit Über-Kreuz-Kürzen: ${fractionString(
        aNum,
        aDen
      )} * ${fractionString(bNum, bDen)}`;
      const promptEn = `Calculate with cross-cancelling: ${fractionString(
        aNum,
        aDen
      )} * ${fractionString(bNum, bDen)}`;
      const answer = formatFraction(mul(parseFraction(`${aNum}/${aDen}`), parseFraction(`${bNum}/${bDen}`)));
      const promptEs = `Calcula con simplificación en cruz: ${fractionString(
        aNum,
        aDen
      )} * ${fractionString(bNum, bDen)}`;
      const promptFr = `Calcule avec réduction en croix : ${fractionString(
        aNum,
        aDen
      )} * ${fractionString(bNum, bDen)}`;
      return buildTask(
        subskillId,
        prompt,
        answer,
        ["multiply", "cross-simplify"],
        promptEn,
        promptEs,
        promptFr
      );
    }
    case "S_DIV_01": {
      const aNum = randInt(1, 8);
      const aDen = randInt(2, 9);
      const bNum = randInt(1, 8);
      const bDen = randInt(2, 9);
      const prompt = `Berechne: ${fractionString(aNum, aDen)} : ${fractionString(bNum, bDen)}`;
      const promptEn = `Calculate: ${fractionString(aNum, aDen)} ÷ ${fractionString(
        bNum,
        bDen
      )}`;
      const answer = formatFraction(div(parseFraction(`${aNum}/${aDen}`), parseFraction(`${bNum}/${bDen}`)));
      const promptEs = `Calcula: ${fractionString(aNum, aDen)} ÷ ${fractionString(bNum, bDen)}`;
      const promptFr = `Calcule : ${fractionString(aNum, aDen)} ÷ ${fractionString(
        bNum,
        bDen
      )}`;
      return buildTask(subskillId, prompt, answer, ["divide"], promptEn, promptEs, promptFr);
    }
    case "S_DIV_02": {
      const aNum = randInt(2, 12);
      const aDen = randInt(3, 12);
      const bNum = randInt(2, 12);
      const bDen = randInt(3, 12);
      const prompt = `Berechne mit Kürzen: ${fractionString(aNum, aDen)} : ${fractionString(
        bNum,
        bDen
      )}`;
      const promptEn = `Calculate with simplification: ${fractionString(
        aNum,
        aDen
      )} ÷ ${fractionString(bNum, bDen)}`;
      const answer = formatFraction(div(parseFraction(`${aNum}/${aDen}`), parseFraction(`${bNum}/${bDen}`)));
      const promptEs = `Calcula con simplificación: ${fractionString(
        aNum,
        aDen
      )} ÷ ${fractionString(bNum, bDen)}`;
      const promptFr = `Calcule avec simplification : ${fractionString(
        aNum,
        aDen
      )} ÷ ${fractionString(bNum, bDen)}`;
      return buildTask(
        subskillId,
        prompt,
        answer,
        ["divide", "cross-simplify"],
        promptEn,
        promptEs,
        promptFr
      );
    }
    case "S_SIM_01": {
      const base = randInt(2, 6);
      const num = base * randInt(2, 9);
      const den = base * randInt(3, 9);
      const prompt = `Kürze vollständig: ${fractionString(num, den)}`;
      const promptEn = `Fully simplify: ${fractionString(num, den)}`;
      const answer = formatFraction(simplify(parseFraction(`${num}/${den}`)));
      const promptEs = `Simplifica completamente: ${fractionString(num, den)}`;
      const promptFr = `Simplifie complètement : ${fractionString(num, den)}`;
      return buildTask(subskillId, prompt, answer, ["simplify"], promptEn, promptEs, promptFr);
    }
    case "S_MIS_01": {
      const factor = pickFraction(1, 5, 2, 9);
      const missing = pickFraction(1, 5, 2, 9);
      const result = mul(parseFraction(missing.text), parseFraction(factor.text));
      const prompt = `Zahl gesucht: □ * ${factor.text} = ${formatFraction(result)}`;
      const promptEn = `Missing number: □ * ${factor.text} = ${formatFraction(result)}`;
      const promptEs = `Número desconocido: □ * ${factor.text} = ${formatFraction(result)}`;
      const promptFr = `Nombre manquant : □ * ${factor.text} = ${formatFraction(result)}`;
      return buildTask(
        subskillId,
        prompt,
        formatFraction(parseFraction(missing.text)),
        ["missing", "multiply"],
        promptEn,
        promptEs,
        promptFr
      );
    }
    case "S_MIS_02": {
      const divisor = pickFraction(1, 5, 2, 9);
      const dividend = pickFraction(1, 6, 2, 9);
      const result = div(parseFraction(dividend.text), parseFraction(divisor.text));
      const prompt = `Zahl gesucht: ${dividend.text} : □ = ${formatFraction(result)}`;
      const promptEn = `Missing number: ${dividend.text} ÷ □ = ${formatFraction(result)}`;
      const promptEs = `Número desconocido: ${dividend.text} ÷ □ = ${formatFraction(result)}`;
      const promptFr = `Nombre manquant : ${dividend.text} ÷ □ = ${formatFraction(result)}`;
      return buildTask(
        subskillId,
        prompt,
        formatFraction(parseFraction(divisor.text)),
        ["missing", "divide"],
        promptEn,
        promptEs,
        promptFr
      );
    }
    case "S_MIS_03": {
      const divisor = pickFraction(1, 5, 2, 9);
      const result = pickFraction(1, 5, 2, 9);
      const missing = mul(parseFraction(result.text), parseFraction(divisor.text));
      const prompt = `Zahl gesucht: □ : ${divisor.text} = ${result.text}`;
      const promptEn = `Missing number: □ ÷ ${divisor.text} = ${result.text}`;
      const promptEs = `Número desconocido: □ ÷ ${divisor.text} = ${result.text}`;
      const promptFr = `Nombre manquant : □ ÷ ${divisor.text} = ${result.text}`;
      return buildTask(
        subskillId,
        prompt,
        formatFraction(missing),
        ["missing", "divide"],
        promptEn,
        promptEs,
        promptFr
      );
    }
    default: {
      return buildTask(
        subskillId,
        "Berechne: 1/2 * 2/3",
        "1/3",
        ["fallback"],
        "Calculate: 1/2 * 2/3",
        "Calcula: 1/2 * 2/3",
        "Calcule : 1/2 * 2/3"
      );
    }
  }
};
