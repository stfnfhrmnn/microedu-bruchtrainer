import React from "react";

type ProgressBarProps = {
  current: number;
  total: number;
};

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percent = total === 0 ? 0 : Math.round((current / total) * 100);
  return (
    <div className="progress">
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
      <span className="progress-label">
        {current}/{total}
      </span>
    </div>
  );
};

export default ProgressBar;
