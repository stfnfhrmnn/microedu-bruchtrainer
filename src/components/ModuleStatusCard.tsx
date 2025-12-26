import React from "react";
import type { ModuleStatus } from "../logic/models";

const ModuleStatusCard: React.FC<{
  title: string;
  status: ModuleStatus;
  onPractice?: () => void;
  practiceLabel: string;
  correctLabel: string;
  confidenceLabel: string;
}> = ({ title, status, onPractice, practiceLabel, correctLabel, confidenceLabel }) => {
  const accuracy = Math.round(status.correctnessRate * 100);
  const confidence = Math.round(status.confidenceRate * 100);
  const accuracyHue = Math.round((accuracy / 100) * 120);
  return (
    <div className={`status-card ${status.color}`}>
      <h3>{title}</h3>
      <p className="status-label">
        <span className={`status-dot ${status.color}`} aria-hidden="true" />
      </p>
      <div className="subskill-metrics">
        <div className="metric">
          <span className="metric-label">
            {correctLabel} {accuracy}%
          </span>
          <div className="metric-bar">
            <div
              className="metric-fill"
              style={{
                width: `${accuracy}%`,
                backgroundColor: `hsl(${accuracyHue}, 70%, 45%)`,
              }}
            />
          </div>
        </div>
        <div className="metric metric-inline">
          <span className="metric-label">{confidenceLabel}</span>
          <div className="confidence-dots" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, index) => (
              <span
                key={`${title}-conf-${index}`}
                className={`dot ${index < Math.round(confidence / 20) ? "active" : ""}`}
              />
            ))}
          </div>
        </div>
      </div>
      {onPractice ? (
        <button type="button" className="status-button" onClick={onPractice}>
          {practiceLabel}
        </button>
      ) : null}
    </div>
  );
};

export default ModuleStatusCard;
