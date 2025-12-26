import {
  Fraction,
  FractionError,
  gcd,
  normalize,
  parseFractionRaw,
} from "../engine/fractions";

export type EvaluationResult = {
  isCorrect: boolean;
  errorType?: string;
};

export const evaluateAnswer = (
  input: string,
  expected: Fraction
): EvaluationResult => {
  try {
    const raw = parseFractionRaw(input);
    const normalizedExpected = normalize(expected.num, expected.den);

    const isCorrect =
      raw.normalized.num === normalizedExpected.num &&
      raw.normalized.den === normalizedExpected.den;

    if (isCorrect) {
      if (raw.rawDen !== 1n && gcd(raw.rawNum, raw.rawDen) > 1n) {
        return { isCorrect: true, errorType: "E_SIM_NONE" };
      }
      return { isCorrect: true };
    }

    return { isCorrect: false, errorType: "E_UNKNOWN" };
  } catch (error) {
    if (error instanceof FractionError) {
      return { isCorrect: false, errorType: "E_PARSE" };
    }
    return { isCorrect: false, errorType: "E_PARSE" };
  }
};
