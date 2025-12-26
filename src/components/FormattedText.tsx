import React from "react";
import FractionDisplay from "./FractionDisplay";

const stripParens = (value: string): string => {
  const trimmed = value.trim();
  if (trimmed.startsWith("(") && trimmed.endsWith(")")) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
};

const normalizeExpr = (value: string): string => {
  return stripParens(value).replace(/\s+/g, "").replace(/\*/g, "·");
};

const prettifyMathSymbols = (value: string): string => {
  return value.replace(/->|=>/g, "→").replace(/\*/g, "·");
};

const injectPlaceholders = (nodes: React.ReactNode[]): React.ReactNode[] => {
  const withPlaceholders: React.ReactNode[] = [];
  nodes.forEach((node, index) => {
    if (typeof node === "string") {
      const parts = prettifyMathSymbols(node).split("□");
      parts.forEach((part, partIndex) => {
        if (part) {
          withPlaceholders.push(part);
        }
        if (partIndex < parts.length - 1) {
          withPlaceholders.push(
            <span key={`placeholder-${index}-${partIndex}`} className="placeholder">
              □
            </span>
          );
        }
      });
    } else {
      withPlaceholders.push(node);
    }
  });
  return withPlaceholders;
};

const renderTextWithFractions = (text: string): React.ReactNode[] => {
  const pattern =
    /(-?\d+)\s+(\d+)\s*\/\s*(\d+)|(\(\s*\d+(?:\s*[*·]\s*\d+)+\s*\)|-?\d+)\s*\/\s*(\(\s*\d+(?:\s*[*·]\s*\d+)+\s*\)|\d+)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (match[1]) {
      const whole = match[1];
      const numerator = match[2];
      const denominator = match[3];
      parts.push(
        <span key={`m-${match.index}`} className="mixed-number">
          <span className="whole">{whole}</span>
          <FractionDisplay
            numerator={numerator}
            denominator={denominator}
            className="inline"
          />
        </span>
      );
    } else {
      const numerator = normalizeExpr(match[4]);
      const denominator = normalizeExpr(match[5]);
      parts.push(
        <FractionDisplay
          key={`f-${match.index}`}
          numerator={numerator}
          denominator={denominator}
          className="inline"
        />
      );
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return injectPlaceholders(parts);
};

type FormattedTextProps = {
  text: string;
  className?: string;
};

const FormattedText: React.FC<FormattedTextProps> = ({ text, className }) => {
  return <span className={className}>{renderTextWithFractions(text)}</span>;
};

export default FormattedText;
