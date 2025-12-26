import React from "react";

type ConfidencePickerProps = {
  onPick: (confidence: "high" | "medium" | "low") => void;
  prompt: string;
  helper: string;
  highLabel: string;
  mediumLabel: string;
  lowLabel: string;
};

const ConfidencePicker: React.FC<ConfidencePickerProps> = ({
  onPick,
  prompt,
  helper,
  highLabel,
  mediumLabel,
  lowLabel,
}) => {
  return (
    <div className="confidence highlight">
      <p>{prompt}</p>
      <p className="confidence-helper">{helper}</p>
      <div className="button-row">
        <button type="button" className="secondary" onClick={() => onPick("high")}>
          {highLabel}
        </button>
        <button type="button" className="secondary" onClick={() => onPick("medium")}>
          {mediumLabel}
        </button>
        <button type="button" className="secondary" onClick={() => onPick("low")}>
          {lowLabel}
        </button>
      </div>
    </div>
  );
};

export default ConfidencePicker;
