import { describe, expect, it } from "vitest";
import {
  compare,
  div,
  formatFraction,
  gcd,
  mul,
  normalize,
  parseFraction,
  parseFractionRaw,
} from "../src/engine/fractions";

describe("fraction engine", () => {
  it("normalizes signs and reduces", () => {
    const fraction = normalize(6n, -15n);
    expect(fraction).toEqual({ num: -2n, den: 5n });
  });

  it("computes gcd", () => {
    expect(gcd(18n, 24n)).toBe(6n);
  });

  it("parses mixed numbers", () => {
    const fraction = parseFraction("-2 3/5");
    expect(fraction).toEqual({ num: -13n, den: 5n });
  });

  it("rejects mixed numbers with reducible fraction part", () => {
    expect(() => parseFraction("1 2/4")).toThrowError("MixedInvalid");
  });

  it("parses fractions with spaces", () => {
    const fraction = parseFraction(" 3 / 4 ");
    expect(fraction).toEqual({ num: 3n, den: 4n });
  });

  it("parses integers", () => {
    expect(parseFraction("7")).toEqual({ num: 7n, den: 1n });
  });

  it("multiplies with cross cancellation", () => {
    const result = mul({ num: 2n, den: 3n }, { num: 3n, den: 5n });
    expect(result).toEqual({ num: 2n, den: 5n });
  });

  it("divides fractions", () => {
    const result = div({ num: 3n, den: 4n }, { num: 2n, den: 5n });
    expect(result).toEqual({ num: 15n, den: 8n });
  });

  it("formats proper fractions", () => {
    const text = formatFraction({ num: 13n, den: 5n }, "proper");
    expect(text).toBe("2 3/5");
  });

  it("compares fractions", () => {
    expect(compare({ num: 1n, den: 2n }, { num: 3n, den: 4n })).toBe(-1);
  });

  it("tracks raw fraction input", () => {
    const raw = parseFractionRaw("6/15");
    expect(raw.rawNum).toBe(6n);
    expect(raw.rawDen).toBe(15n);
    expect(raw.normalized).toEqual({ num: 2n, den: 5n });
  });
});
