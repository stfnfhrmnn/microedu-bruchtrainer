export type Fraction = {
  num: bigint;
  den: bigint;
};

export class FractionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FractionError";
  }
}

export const absBig = (value: bigint): bigint => (value < 0n ? -value : value);

export const gcd = (a: bigint, b: bigint): bigint => {
  let x = absBig(a);
  let y = absBig(b);
  while (y !== 0n) {
    const temp = y;
    y = x % y;
    x = temp;
  }
  return x;
};

export const normalize = (num: bigint, den: bigint): Fraction => {
  if (den === 0n) {
    throw new FractionError("DivisionByZeroDenominator");
  }
  if (den < 0n) {
    num = -num;
    den = -den;
  }
  if (num === 0n) {
    return { num: 0n, den: 1n };
  }
  const divisor = gcd(absBig(num), den);
  return { num: num / divisor, den: den / divisor };
};

export const simplify = (fraction: Fraction): Fraction => {
  return normalize(fraction.num, fraction.den);
};

export const mul = (a: Fraction, b: Fraction): Fraction => {
  const g1 = gcd(absBig(a.num), b.den);
  const g2 = gcd(absBig(b.num), a.den);
  const num = (a.num / g1) * (b.num / g2);
  const den = (a.den / g2) * (b.den / g1);
  return normalize(num, den);
};

export const div = (a: Fraction, b: Fraction): Fraction => {
  if (b.num === 0n) {
    throw new FractionError("DivisionByZero");
  }
  return normalize(a.num * b.den, a.den * b.num);
};

export const equals = (a: Fraction, b: Fraction): boolean => {
  return a.num === b.num && a.den === b.den;
};

export const compare = (a: Fraction, b: Fraction): number => {
  const left = a.num * b.den;
  const right = b.num * a.den;
  if (left === right) {
    return 0;
  }
  return left > right ? 1 : -1;
};

export const formatFraction = (
  fraction: Fraction,
  mode: "improper" | "proper" = "improper"
): string => {
  if (fraction.den === 1n) {
    return fraction.num.toString();
  }
  if (mode === "improper") {
    return `${fraction.num.toString()}/${fraction.den.toString()}`;
  }

  const sign = fraction.num < 0n ? -1n : 1n;
  const absNum = absBig(fraction.num);
  if (absNum < fraction.den) {
    return `${fraction.num.toString()}/${fraction.den.toString()}`;
  }
  const whole = absNum / fraction.den;
  const remainder = absNum % fraction.den;
  const signedWhole = whole * sign;
  if (remainder === 0n) {
    return signedWhole.toString();
  }
  return `${signedWhole.toString()} ${remainder.toString()}/${
    fraction.den.toString()
  }`;
};

const normalizeWhitespace = (input: string): string => {
  return input
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const parseInteger = (value: string): bigint => {
  if (!/^[-]?\d+$/.test(value)) {
    throw new FractionError("ParseError");
  }
  return BigInt(value);
};

const parsePositiveInteger = (value: string): bigint => {
  if (!/^\d+$/.test(value)) {
    throw new FractionError("ParseError");
  }
  return BigInt(value);
};

export const parseFraction = (input: string): Fraction => {
  return parseFractionRaw(input).normalized;
};

export const parseFractionRaw = (input: string): {
  rawNum: bigint;
  rawDen: bigint;
  normalized: Fraction;
} => {
  const cleaned = normalizeWhitespace(input);
  if (cleaned.length === 0) {
    throw new FractionError("ParseError");
  }

  const hasSlash = cleaned.includes("/");
  const mixedPattern = /^-?\d+ \d+\/\d+$/;

  if (mixedPattern.test(cleaned)) {
    const parts = cleaned.split(" ");
    const whole = parseInteger(parts[0]);
    const fracParts = parts[1].split("/");
    const numPart = parsePositiveInteger(fracParts[0]);
    const denPart = parsePositiveInteger(fracParts[1]);
    if (denPart === 0n || numPart === 0n || numPart >= denPart) {
      throw new FractionError("MixedInvalid");
    }
    if (gcd(numPart, denPart) !== 1n) {
      throw new FractionError("MixedInvalid");
    }
    const sign = whole < 0n ? -1n : 1n;
    const absWhole = absBig(whole);
    const rawNum = sign * (absWhole * denPart + numPart);
    const rawDen = denPart;
    return {
      rawNum,
      rawDen,
      normalized: normalize(rawNum, rawDen),
    };
  }

  if (hasSlash) {
    const compact = cleaned.replace(/\s*\/\s*/g, "/").replace(/\s+/g, "");
    const fracParts = compact.split("/");
    if (fracParts.length !== 2) {
      throw new FractionError("ParseError");
    }
    const rawNum = parseInteger(fracParts[0]);
    const rawDen = parseInteger(fracParts[1]);
    if (rawDen === 0n) {
      throw new FractionError("ParseError");
    }
    if (rawDen < 0n) {
      throw new FractionError("ParseError");
    }
    return {
      rawNum,
      rawDen,
      normalized: normalize(rawNum, rawDen),
    };
  }

  const rawNum = parseInteger(cleaned);
  const rawDen = 1n;
  return {
    rawNum,
    rawDen,
    normalized: normalize(rawNum, rawDen),
  };
};

export const isDivisible = (value: bigint, divisor: bigint): boolean => {
  if (divisor === 0n) {
    return false;
  }
  return value % divisor === 0n;
};

export const reducePair = (value: bigint, divisor: bigint): bigint => {
  if (!isDivisible(value, divisor)) {
    throw new FractionError("NotDivisible");
  }
  return value / divisor;
};

export const divisors = (value: bigint): bigint[] => {
  const absValue = absBig(value);
  if (absValue === 0n) {
    return [];
  }
  const results: bigint[] = [];
  for (let i = 1n; i * i <= absValue; i += 1n) {
    if (absValue % i === 0n) {
      results.push(i);
      const pair = absValue / i;
      if (pair !== i) {
        results.push(pair);
      }
    }
  }
  return results.sort((a, b) => (a < b ? -1 : 1));
};
