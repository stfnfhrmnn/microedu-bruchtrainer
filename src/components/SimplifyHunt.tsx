import React, { useMemo, useState } from "react";
import { divisors } from "../engine/fractions";
import FormattedText from "./FormattedText";

const fractionFromPrompt = (prompt: string): { num: bigint; den: bigint } | null => {
  const match = prompt.match(/(\d+)\s*\/\s*(\d+)/);
  if (!match) {
    return null;
  }
  return { num: BigInt(match[1]), den: BigInt(match[2]) };
};

type SimplifyHuntProps = {
  prompt: string;
  onApply: (value: string) => void;
  title: string;
  promptLabel: (value: string) => string;
  promptLabelCross: (first: string, second: string) => string;
  goodLabel: (value: string, reduced: string) => string;
  badLabel: (value: string) => string;
  applyLabel: string;
};

const SimplifyHunt: React.FC<SimplifyHuntProps> = ({
  prompt,
  onApply,
  title,
  promptLabel,
  promptLabelCross,
  goodLabel,
  badLabel,
  applyLabel,
}) => {
  const fraction = useMemo(() => fractionFromPrompt(prompt), [prompt]);
  const fractions = useMemo(() => {
    const matches = [...prompt.matchAll(/(\d+)\s*\/\s*(\d+)/g)];
    return matches.map((match) => ({
      num: BigInt(match[1]),
      den: BigInt(match[2]),
      text: `${match[1]}/${match[2]}`,
    }));
  }, [prompt]);
  const [message, setMessage] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<string | null>(null);

  if (!fraction && fractions.length < 2) {
    return null;
  }

  const isCross = fractions.length >= 2;
  const primary = fraction ?? fractions[0];
  const { num, den } = primary;
  const divs = isCross
    ? []
    : divisors(num)
        .filter((value) => value > 1n)
        .filter((value) => den % value === 0n)
        .slice(0, 6);

  const applyDivisor = (value: bigint): void => {
    if (num % value === 0n && den % value === 0n) {
      const reduced = `${(num / value).toString()}/${(den / value).toString()}`;
      setSuggestion(reduced);
      setMessage(goodLabel(value.toString(), reduced));
    } else {
      setSuggestion(null);
      setMessage(badLabel(value.toString()));
    }
  };

  const crossPairs = isCross
    ? [
        {
          left: fractions[0],
          right: fractions[1],
          label: `${fractions[0].num.toString()} ↔ ${fractions[1].den.toString()}`,
        },
        {
          left: { num: fractions[1].num, den: fractions[1].den },
          right: { num: fractions[0].num, den: fractions[0].den },
          label: `${fractions[1].num.toString()} ↔ ${fractions[0].den.toString()}`,
        },
      ]
    : [];

  return (
    <div className="mini-game">
      <h3>{title}</h3>
      <p>
        <FormattedText
          text={
            isCross
              ? promptLabelCross(fractions[0].text, fractions[1].text)
              : promptLabel(`${num.toString()}/${den.toString()}`)
          }
        />
      </p>
      {isCross ? (
        <div className="mini-row">
          {crossPairs.map((pair) => (
            <span key={pair.label} className="chip disabled">
              {pair.label}
            </span>
          ))}
        </div>
      ) : (
        <div className="mini-row">
          {divs.map((value) => (
            <button
              key={value.toString()}
              type="button"
              className="chip"
              onClick={() => applyDivisor(value)}
            >
              {value.toString()}
            </button>
          ))}
        </div>
      )}
      {message ? (
        <p className="mini-message">
          <FormattedText text={message} />
        </p>
      ) : null}
      {!isCross && suggestion ? (
        <button type="button" className="secondary" onClick={() => onApply(suggestion)}>
          {applyLabel}
        </button>
      ) : null}
    </div>
  );
};

export default SimplifyHunt;
