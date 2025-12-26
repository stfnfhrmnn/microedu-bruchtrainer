import React from "react";

type TaskCardProps = {
  title: string;
  theme?: string;
  prompt: React.ReactNode;
  inputValue: string;
  onInputChange: (value: string) => void;
  onCheck: () => void;
  placeholder: string;
  checkLabel: string;
  feedback?: React.ReactNode;
  disabled?: boolean;
  diagnostics?: React.ReactNode;
  muted?: boolean;
};

const TaskCard: React.FC<TaskCardProps> = ({
  title,
  theme,
  prompt,
  inputValue,
  onInputChange,
  onCheck,
  placeholder,
  checkLabel,
  feedback,
  disabled,
  diagnostics,
  muted,
}) => {
  return (
    <section className={`card task-card${muted ? " muted" : ""}`}>
      <header className="task-header">
        {theme ? <p className="task-theme">{theme}</p> : null}
        <h2>{title}</h2>
      </header>
      <p className="task-prompt">{prompt}</p>
      <div className="task-input">
        <input
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={(event) => onInputChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !disabled && inputValue.trim()) {
              onCheck();
            }
          }}
          disabled={disabled}
        />
        <button type="button" onClick={onCheck} disabled={disabled}>
          {checkLabel}
        </button>
      </div>
      {feedback ? <div className="task-feedback">{feedback}</div> : null}
      {diagnostics ? <div className="task-diagnostics">{diagnostics}</div> : null}
    </section>
  );
};

export default TaskCard;
