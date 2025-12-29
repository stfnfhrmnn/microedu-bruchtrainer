import React, { useMemo, useRef, useState } from "react";
import ConfidencePicker from "./components/ConfidencePicker";
import FormattedText from "./components/FormattedText";
import Glossary from "./components/Glossary";
import ModuleStatusCard from "./components/ModuleStatusCard";
import ProgressBar from "./components/ProgressBar";
import SimplifyHunt from "./components/SimplifyHunt";
import TaskCard from "./components/TaskCard";
import VisualCanvas from "./components/VisualCanvas";
import { formatFraction } from "./engine/fractions";
import { evaluateAnswer } from "./logic/evaluate";
import { generateTask } from "./logic/generators";
import { glossary, strings, type Language, getLanguageLabel, languageOrder } from "./logic/i18n";
import type { Attempt, ModuleStatus, TaskInstance, TaskTemplate } from "./logic/models";
import { modules, subskillById, subskills } from "./logic/modules";
import { evaluateModuleStatus, isSubskillMastered } from "./logic/progress";
import { buildSubskillStats, pickTrainingSubskill } from "./logic/selection";
import { getDiagnosisTasksForModule, getTrainingTask, toInstance } from "./logic/session";
import { loadAttempts, saveAttempts } from "./logic/storage";
import { taskLookupById } from "./logic/tasks";

const DIAGNOSIS_QUEUE_KEY = "bruchtrainer.diagnosisQueue";
const DIAGNOSIS_INDEX_KEY = "bruchtrainer.diagnosisIndex";

const buildDiagnosisQueue = (): TaskInstance[] => {
  const tasks: TaskInstance[] = [];
  for (const moduleItem of modules) {
    tasks.push(...getDiagnosisTasksForModule(moduleItem.id, 5));
  }
  return tasks;
};

const loadDiagnosisQueueFromStorage = (): TaskInstance[] => {
  if (typeof window === "undefined") {
    return [];
  }
  const raw = window.localStorage.getItem(DIAGNOSIS_QUEUE_KEY);
  if (!raw) {
    return [];
  }
  try {
    const ids = JSON.parse(raw);
    if (!Array.isArray(ids)) {
      return [];
    }
    const queue = ids
      .map((id) => (typeof id === "string" ? taskLookupById(id) : undefined))
      .filter((task): task is TaskTemplate => Boolean(task))
      .map((task) => toInstance(task));
    if (queue.length !== ids.length) {
      return [];
    }
    return queue;
  } catch {
    return [];
  }
};

const loadDiagnosisIndexFromStorage = (): number => {
  if (typeof window === "undefined") {
    return 0;
  }
  const raw = window.localStorage.getItem(DIAGNOSIS_INDEX_KEY);
  const parsed = raw ? Number.parseInt(raw, 10) : 0;
  if (!Number.isFinite(parsed) || parsed < 0) {
    return 0;
  }
  return parsed;
};

const persistDiagnosisQueue = (queue: TaskInstance[]): void => {
  if (typeof window === "undefined") {
    return;
  }
  if (queue.length === 0) {
    window.localStorage.removeItem(DIAGNOSIS_QUEUE_KEY);
    return;
  }
  const ids = queue.map((task) => task.id);
  window.localStorage.setItem(DIAGNOSIS_QUEUE_KEY, JSON.stringify(ids));
};

const persistDiagnosisIndex = (index: number): void => {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(DIAGNOSIS_INDEX_KEY, String(index));
};

const clearDiagnosisProgress = (): void => {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.removeItem(DIAGNOSIS_QUEUE_KEY);
  window.localStorage.removeItem(DIAGNOSIS_INDEX_KEY);
};

const loadLanguage = (): Language => {
  if (typeof window === "undefined") {
    return "de";
  }
  const stored = window.localStorage.getItem("bruchtrainer.lang");
  if (stored === "en-GB" || stored === "es-ES" || stored === "fr-FR") {
    return stored;
  }
  return "de";
};

const saveLanguage = (language: Language): void => {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem("bruchtrainer.lang", language);
};

const App: React.FC = () => {
  const [view, setView] = useState<
    "diagnose" | "dashboard" | "training" | "review" | "glossary"
  >("dashboard");
  const [attempts, setAttempts] = useState<Attempt[]>(() => loadAttempts());
  const [language, setLanguage] = useState<Language>(() => loadLanguage());
  const [diagnosisComplete, setDiagnosisComplete] = useState<boolean>(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return window.localStorage.getItem("bruchtrainer.diagnosisComplete") === "true";
  });
  const [diagnosisStarted, setDiagnosisStarted] = useState<boolean>(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return window.localStorage.getItem("bruchtrainer.diagnosisStarted") === "true";
  });
  const [diagnosisQueue, setDiagnosisQueue] = useState<TaskInstance[]>(
    () => loadDiagnosisQueueFromStorage()
  );
  const [diagnosisIndex, setDiagnosisIndex] = useState(() => loadDiagnosisIndexFromStorage());
  const [trainingTask, setTrainingTask] = useState<TaskInstance | null>(null);
  const [trainingRemaining, setTrainingRemaining] = useState(0);
  const [trainingCorrect, setTrainingCorrect] = useState(0);
  const [trainingModuleId, setTrainingModuleId] = useState<string | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [feedback, setFeedback] = useState<React.ReactNode | null>(null);
  const [awaitingConfidence, setAwaitingConfidence] = useState(false);

  const taskRegistry = useRef(new Map<string, TaskInstance>());
  const taskStartRef = useRef<number>(Date.now());
  const t = strings[language];

  const registerTask = (task: TaskInstance): void => {
    taskRegistry.current.set(task.id, task);
  };

  const lookupTask = (taskId: string): TaskTemplate | undefined => {
    return taskRegistry.current.get(taskId) ?? taskLookupById(taskId);
  };

  const moduleStatuses: ModuleStatus[] = useMemo(() => {
    return modules.map((moduleItem) =>
      evaluateModuleStatus(attempts, moduleItem.id, (taskId) =>
        lookupTask(taskId)
      )
    );
  }, [attempts]);

  const startDiagnosis = (): void => {
    setView("diagnose");
    setTrainingTask(null);
    setTrainingRemaining(0);
    setTrainingCorrect(0);
    setTrainingModuleId(null);
    setDiagnosisStarted(true);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("bruchtrainer.diagnosisStarted", "true");
    }
    const storedQueue = loadDiagnosisQueueFromStorage();
    const storedIndex = loadDiagnosisIndexFromStorage();
    const canResume =
      !diagnosisComplete && storedQueue.length > 0 && storedIndex < storedQueue.length;
    if (canResume) {
      taskRegistry.current.clear();
      storedQueue.forEach(registerTask);
      setDiagnosisQueue(storedQueue);
      setDiagnosisIndex(storedIndex);
      setCurrentAnswer("");
      setFeedback(null);
      setAwaitingConfidence(false);
      taskStartRef.current = Date.now();
      return;
    }
    setDiagnosisComplete(false);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("bruchtrainer.diagnosisComplete", "false");
    }
    const queue = buildDiagnosisQueue();
    const ensuredQueue = queue.length > 0 ? queue : [generateTask("S_MUL_01")];
    taskRegistry.current.clear();
    ensuredQueue.forEach(registerTask);
    setDiagnosisQueue(ensuredQueue);
    setDiagnosisIndex(0);
    persistDiagnosisQueue(ensuredQueue);
    persistDiagnosisIndex(0);
    setCurrentAnswer("");
    setFeedback(null);
    setAwaitingConfidence(false);
    taskStartRef.current = Date.now();
  };

  const startTraining = (scopeId?: string): void => {
    const isModule = scopeId
      ? subskills.some((subskill) => subskill.moduleId === scopeId)
      : false;
    const scopedSubskills = scopeId
      ? subskills.filter((subskill) => (isModule ? subskill.moduleId === scopeId : subskill.id === scopeId))
      : subskills;
    setTrainingModuleId(isModule ? scopeId ?? null : null);
    const subskillId = pickTrainingSubskill(attempts, scopedSubskills, (taskId) =>
      lookupTask(taskId)
    );
    const task = getTrainingTask(subskillId) ?? generateTask(subskillId);
    registerTask(task);
    setTrainingTask(task);
    setTrainingRemaining(10);
    setTrainingCorrect(0);
    setCurrentAnswer("");
    setFeedback(null);
    setAwaitingConfidence(false);
    taskStartRef.current = Date.now();
    setView("training");
  };

  const goToDashboard = (): void => {
    setView("dashboard");
  };

  const startTrainingForModule = (moduleId: string): void => {
    startTraining(moduleId);
  };

  const startTrainingForSubskill = (subskillId: string): void => {
    startTraining(subskillId);
  };

  const currentTask = view === "diagnose" ? diagnosisQueue[diagnosisIndex] : trainingTask;
  const currentSubskill = currentTask ? subskillById.get(currentTask.subskillId) : undefined;
  const currentModule = currentSubskill
    ? modules.find((moduleItem) => moduleItem.id === currentSubskill.moduleId)
    : undefined;
  const titleFor = (
    value: { title: string; titleEn?: string; titleEs?: string; titleFr?: string } | undefined
  ): string | undefined => {
    if (!value) {
      return undefined;
    }
    if (language === "en-GB") {
      return value.titleEn ?? value.title;
    }
    if (language === "es-ES") {
      return value.titleEs ?? value.title;
    }
    if (language === "fr-FR") {
      return value.titleFr ?? value.title;
    }
    return value.title;
  };

  const currentSubskillTitle = titleFor(currentSubskill);
  const currentModuleTitle = titleFor(currentModule);

  const promptText =
    language === "en-GB"
      ? currentTask?.promptEn ?? currentTask?.prompt
      : language === "es-ES"
      ? currentTask?.promptEs ?? currentTask?.prompt
      : language === "fr-FR"
      ? currentTask?.promptFr ?? currentTask?.prompt
      : currentTask?.prompt;

  const resolvedSolutions =
    language === "en-GB"
      ? currentTask?.solutionsEn ?? currentTask?.solutions
      : language === "es-ES"
      ? currentTask?.solutionsEs ?? currentTask?.solutions
      : language === "fr-FR"
      ? currentTask?.solutionsFr ?? currentTask?.solutions
      : currentTask?.solutions;

  const resolvedSteps =
    language === "en-GB"
      ? currentTask?.stepsEn ?? currentTask?.steps
      : language === "es-ES"
      ? currentTask?.stepsEs ?? currentTask?.steps
      : language === "fr-FR"
      ? currentTask?.stepsFr ?? currentTask?.steps
      : currentTask?.steps;
  const diagnostics = currentTask ? (
    <details className="diagnostics">
      <summary>{t.diagnosticsTitle}</summary>
      <pre>
        {JSON.stringify(
          {
            id: currentTask.id,
            moduleId: currentTask.moduleId,
            subskillId: currentTask.subskillId,
            prompt: currentTask.prompt,
            promptEn: currentTask.promptEn,
            answer: {
              num: currentTask.answer.num.toString(),
              den: currentTask.answer.den.toString(),
            },
            tags: currentTask.tags ?? [],
          },
          null,
          2
        )}
      </pre>
    </details>
  ) : null;
  const visualSpec = currentTask?.visual;

  const submitAnswer = (): void => {
    if (!currentTask) {
      return;
    }
    if (!currentAnswer.trim()) {
      return;
    }
    const result = evaluateAnswer(currentAnswer, currentTask.answer);
    const answerText = formatFraction(currentTask.answer, "proper");
    const answerNode = <FormattedText text={answerText} className="answer-text" />;
    const userAnswerNode = currentAnswer.trim()
      ? <FormattedText text={currentAnswer.trim()} className="answer-text" />
      : "—";
    const solutions =
      resolvedSolutions ??
      (resolvedSteps ? [{ title: language === "en-GB" ? "Solution" : "Lösung", steps: resolvedSteps }] : []);

    if (result.isCorrect) {
      const needsSimplify = result.errorType === "E_SIM_NONE";
      setFeedback(
        <div className={needsSimplify ? "feedback-partial" : undefined}>
          <strong>{needsSimplify ? t.almostCorrectLabel : t.correctLabel}</strong>
          <p>
            {t.resultLabel} {answerNode}
          </p>
          <p>
            {t.userAnswerLabel} {userAnswerNode}
          </p>
          {needsSimplify ? (
            <p className="feedback-note">{t.notSimplifiedNote}</p>
          ) : null}
          {needsSimplify ? (
            <p>
              {t.fullyCorrectLabel} {answerNode}
            </p>
          ) : null}
          {visualSpec && visualSpec.mode === "shade" ? (
            <VisualCanvas
              visual={{
                ...visualSpec,
                mode: "read",
                shaded: visualSpec.target ?? visualSpec.shaded ?? 0,
              }}
              resetKey={`${currentTask.id}-feedback`}
            />
          ) : null}
          {solutions.length > 0 ? (
            <div className="solution-list">
              {solutions.map((solution, index) => (
                <div key={`${currentTask.id}-solution-${index}`} className="solution-block">
                  <p className="solution-title">
                    {solution.title ?? `Lösung ${String.fromCharCode(65 + index)}`}
                  </p>
            <ol className="math-steps">
              {solution.steps.map((step) => (
                <li key={`${currentTask.id}-step-${index}-${step}`}>
                  <FormattedText text={step} />
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
          ) : null}
        </div>
      );
    } else {
      setFeedback(
        <div>
          <strong>{t.incorrectLabel}</strong>
          <p>
            {t.correctAnswerLabel} {answerNode}
          </p>
          <p>
            {t.userAnswerLabel} {userAnswerNode}
          </p>
          {visualSpec && visualSpec.mode === "shade" ? (
            <VisualCanvas
              visual={{
                ...visualSpec,
                mode: "read",
                shaded: visualSpec.target ?? visualSpec.shaded ?? 0,
              }}
              resetKey={`${currentTask.id}-feedback`}
            />
          ) : null}
          {solutions.length > 0 ? (
            <div className="solution-list">
              {solutions.map((solution, index) => (
                <div key={`${currentTask.id}-solution-${index}`} className="solution-block">
                  <p className="solution-title">
                    {solution.title ?? `Lösung ${String.fromCharCode(65 + index)}`}
                  </p>
            <ol className="math-steps">
              {solution.steps.map((step) => (
                <li key={`${currentTask.id}-step-${index}-${step}`}>
                  <FormattedText text={step} />
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
          ) : null}
        </div>
      );
    }
    setAwaitingConfidence(true);
  };

  const recordAttempt = (confidence: "high" | "medium" | "low"): void => {
    if (!currentTask) {
      return;
    }
    const result = evaluateAnswer(currentAnswer, currentTask.answer);
    const attempt: Attempt = {
      taskId: currentTask.id,
      moduleId: currentTask.moduleId,
      subskillId: currentTask.subskillId,
      isCorrect: result.isCorrect,
      userAnswer: currentAnswer,
      timeMs: Date.now() - taskStartRef.current,
      confidence,
      timestamp: Date.now(),
      errorType: result.errorType,
    };

    const nextAttempts = [...attempts, attempt];
    setAttempts(nextAttempts);
    saveAttempts(nextAttempts);

    setCurrentAnswer("");
    setFeedback(null);
    setAwaitingConfidence(false);
    taskStartRef.current = Date.now();

    if (view === "diagnose") {
      const nextIndex = diagnosisIndex + 1;
      if (nextIndex >= diagnosisQueue.length) {
        setDiagnosisComplete(true);
        setDiagnosisStarted(true);
        if (typeof window !== "undefined") {
          window.localStorage.setItem("bruchtrainer.diagnosisComplete", "true");
          window.localStorage.setItem("bruchtrainer.diagnosisStarted", "true");
        }
        clearDiagnosisProgress();
        setView("dashboard");
      } else {
        setDiagnosisIndex(nextIndex);
        persistDiagnosisIndex(nextIndex);
      }
      return;
    }

    if (view === "training" && trainingTask) {
      const remaining = trainingRemaining - 1;
      setTrainingRemaining(remaining);
      if (result.isCorrect) {
        setTrainingCorrect((prev) => prev + 1);
      }
      if (remaining <= 0) {
        setTrainingTask(null);
        setView("review");
        return;
      }
      const scopedSubskills = trainingModuleId
        ? subskills.filter((subskill) => subskill.moduleId === trainingModuleId)
        : subskills;
      const nextSubskill = pickTrainingSubskill(nextAttempts, scopedSubskills, (taskId) =>
        lookupTask(taskId)
      );
      const nextTask =
        getTrainingTask(nextSubskill, currentTask?.id) ?? generateTask(nextSubskill);
      registerTask(nextTask);
      setTrainingTask(nextTask);
    }
  };

  const subskillMastery = subskills.map((subskill) => ({
    subskill,
    mastered: isSubskillMastered(attempts, subskill.id, (taskId) =>
      lookupTask(taskId)
    ),
  }));
  const diagnosisTotal = diagnosisQueue.length;
  const diagnosisDone = Math.min(diagnosisIndex, diagnosisTotal);
  const showDiagnosisProgress =
    diagnosisStarted && !diagnosisComplete && diagnosisTotal > 0;
  const diagnosisCta = showDiagnosisProgress ? t.diagnosisResumeCta : t.diagnosisNudgeCta;

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="app-kicker">Bruchtrainer</p>
          <h1>{t.appTitle}</h1>
          <p className="app-subtitle">{t.appSubtitle}</p>
        </div>
        <div className="header-actions">
          <nav className="nav">
            <button
              type="button"
              className={`secondary ${view === "dashboard" ? "active" : ""}`}
              onClick={() => setView("dashboard")}
            >
              {t.dashboardTitle}
            </button>
            <button
              type="button"
              className={`secondary ${view === "diagnose" ? "active" : ""} ${
                !diagnosisStarted ? "urgent" : diagnosisComplete ? "" : "attention"
              }`}
              onClick={startDiagnosis}
              title={diagnosisComplete ? undefined : t.navDiagnoseAttention}
            >
              {t.diagnosisTitle}
            </button>
            <button
              type="button"
              className={`secondary ${view === "training" ? "active" : ""}`}
              onClick={() => startTraining()}
            >
              {t.trainingTitle}
            </button>
            <button
              type="button"
              className={`secondary ${view === "glossary" ? "active" : ""}`}
              onClick={() => setView("glossary")}
            >
              {t.glossaryTitle}
            </button>
          </nav>
          <div className="language-picker" role="group" aria-label="Language picker">
            {languageOrder.map((lang) => (
              <button
                key={lang}
                type="button"
                className={`flag-button ${language === lang ? "active" : ""}`}
                onClick={() => {
                  setLanguage(lang);
                  saveLanguage(lang);
                }}
                aria-pressed={language === lang}
                aria-label={getLanguageLabel(lang)}
              >
                {lang === "de" ? "🇩🇪" : lang === "en-GB" ? "🇬🇧" : lang === "es-ES" ? "🇪🇸" : "🇫🇷"}
              </button>
            ))}
          </div>
        </div>
      </header>

      {view === "diagnose" && currentTask ? (
        <main className="app-main">
          <ProgressBar current={diagnosisIndex + 1} total={diagnosisQueue.length} />
          {visualSpec ? (
            <VisualCanvas
              visual={visualSpec}
              resetKey={currentTask.id}
              onSelectionChange={(selected, total) => {
                if (visualSpec.mode === "shade") {
                  setCurrentAnswer(`${selected}/${total}`);
                }
              }}
            />
          ) : null}
          <TaskCard
            title={currentSubskillTitle ?? t.diagnosisTitle}
            theme={currentModuleTitle}
            prompt={<FormattedText text={promptText ?? ""} />}
            inputValue={currentAnswer}
            onInputChange={setCurrentAnswer}
            onCheck={submitAnswer}
            placeholder={t.answerPlaceholder}
            checkLabel={t.checkLabel}
            feedback={feedback}
            disabled={awaitingConfidence}
            muted={awaitingConfidence}
            diagnostics={diagnostics}
          />
          {currentTask.tags?.includes("simplify") ? (
            <details className="hint" key={`${currentTask.id}-hint`}>
              <summary>{t.simplifyHuntSummary}</summary>
              <SimplifyHunt
                prompt={promptText ?? currentTask.prompt}
                onApply={(value) => setCurrentAnswer(value)}
                title={t.simplifyHuntTitle}
                promptLabel={t.simplifyHuntPrompt}
                promptLabelCross={t.simplifyHuntCrossPrompt}
                goodLabel={t.simplifyHuntGood}
                badLabel={t.simplifyHuntBad}
                applyLabel={t.simplifyApply}
              />
            </details>
          ) : null}
          {awaitingConfidence ? (
            <ConfidencePicker
              onPick={recordAttempt}
              prompt={t.confidencePrompt}
              helper={t.confidenceHelper}
              highLabel={t.confidenceHigh}
              mediumLabel={t.confidenceMedium}
              lowLabel={t.confidenceLow}
            />
          ) : null}
        </main>
      ) : null}

      {view === "dashboard" ? (
        <main className="app-main">
          <div className="dashboard-wrapper">
            <div className={`dashboard-shell ${diagnosisStarted ? "" : "muted"}`}>
            <section className="card dashboard-actions">
              <div className="action-block">
                <h2>{t.practiceNudgeTitle}</h2>
                <p>{t.practiceNudgeBody}</p>
              <button type="button" onClick={() => startTraining()}>
                {t.practiceNudgeCta}
              </button>
              </div>
              <div className={`action-block ${diagnosisComplete ? "" : "attention"}`}>
                <h2>{t.diagnosisNudgeTitle}</h2>
                <p>{t.diagnosisNudgeBody}</p>
                {showDiagnosisProgress ? (
                  <p className="action-progress">
                    {t.diagnosisProgress(diagnosisDone, diagnosisTotal)}
                  </p>
                ) : null}
                <button type="button" className="secondary" onClick={startDiagnosis}>
                  {diagnosisCta}
                </button>
              </div>
            </section>
            <section className="card">
              <h2>{t.dashboardTitle}</h2>
              <p>{t.dashboardIntro}</p>
              <div className="status-grid">
                {modules.map((moduleItem) => {
                  const status = moduleStatuses.find(
                    (item) => item.moduleId === moduleItem.id
                  ) as ModuleStatus;
                  const moduleTitle = titleFor(moduleItem) ?? moduleItem.title;
                  return (
                    <ModuleStatusCard
                      key={moduleItem.id}
                      title={moduleTitle}
                      status={status}
                      onPractice={() => startTrainingForModule(moduleItem.id)}
                      practiceLabel={t.modulePractice}
                      correctLabel={t.correctRateLabel}
                      confidenceLabel={t.confidenceRateLabel}
                    />
                  );
                })}
              </div>
            </section>
            <section className="card">
              <h2>{t.subskillsTitle}</h2>
              <div className="subskill-grid">
                {subskillMastery.map(({ subskill, mastered }) => {
                  const stats = buildSubskillStats(attempts, [subskill], (taskId) =>
                    lookupTask(taskId)
                  )[0];
                  const accuracy = Math.round(stats.correctRate * 100);
                  const confidence = Math.round(stats.highConfidenceRate * 100);
                  const accuracyHue = Math.round((accuracy / 100) * 120);
                  const borderColor =
                    accuracy >= 80
                      ? "#6aa84f"
                      : accuracy >= 60
                      ? "#f1c232"
                      : "#cc4125";
                  return (
                    <div key={subskill.id} className="subskill-card" style={{ borderColor }}>
                      <div className={`pill ${mastered ? "ok" : "warn"}`}>
                        {titleFor(subskill) ?? subskill.title}
                      </div>
                      <div className="subskill-metrics">
                        <div className="metric">
                          <span className="metric-label">
                            {t.correctRateLabel} {accuracy}%
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
                          <span className="metric-label">{t.confidenceRateLabel}</span>
                          <div className="confidence-dots" aria-hidden="true">
                            {Array.from({ length: 5 }).map((_, index) => (
                              <span
                                key={`${subskill.id}-conf-${index}`}
                                className={`dot ${index < Math.round(confidence / 20) ? "active" : ""}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="subskill-actions">
                        <button
                          type="button"
                          className="secondary"
                          onClick={() => startTrainingForSubskill(subskill.id)}
                        >
                          {t.subskillPractice}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
            </div>
            {!diagnosisStarted ? (
              <div className="dashboard-overlay">
                <div className="overlay-card">
                  <h2>{t.diagnosisNudgeTitle}</h2>
                  <p>{t.diagnosisNudgeBody}</p>
                  <button type="button" onClick={startDiagnosis}>
                    {t.diagnosisNudgeCta}
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </main>
      ) : null}

      {view === "training" && trainingTask ? (
        <main className="app-main">
          <ProgressBar current={10 - trainingRemaining + 1} total={10} />
          {visualSpec ? (
            <VisualCanvas
              visual={visualSpec}
              resetKey={trainingTask.id}
              onSelectionChange={(selected, total) => {
                if (visualSpec.mode === "shade") {
                  setCurrentAnswer(`${selected}/${total}`);
                }
              }}
            />
          ) : null}
          <TaskCard
            title={currentSubskillTitle ?? t.trainingTaskTitle}
            theme={currentModuleTitle}
            prompt={<FormattedText text={promptText ?? ""} />}
            inputValue={currentAnswer}
            onInputChange={setCurrentAnswer}
            onCheck={submitAnswer}
            placeholder={t.answerPlaceholder}
            checkLabel={t.checkLabel}
            feedback={feedback}
            disabled={awaitingConfidence}
            muted={awaitingConfidence}
            diagnostics={diagnostics}
          />
          {trainingTask.tags?.includes("simplify") ? (
            <details className="hint" key={`${trainingTask.id}-hint`}>
              <summary>{t.simplifyHuntSummary}</summary>
              <SimplifyHunt
                prompt={promptText ?? trainingTask.prompt}
                onApply={(value) => setCurrentAnswer(value)}
                title={t.simplifyHuntTitle}
                promptLabel={t.simplifyHuntPrompt}
                promptLabelCross={t.simplifyHuntCrossPrompt}
                goodLabel={t.simplifyHuntGood}
                badLabel={t.simplifyHuntBad}
                applyLabel={t.simplifyApply}
              />
            </details>
          ) : null}
          {awaitingConfidence ? (
            <ConfidencePicker
              onPick={recordAttempt}
              prompt={t.confidencePrompt}
              helper={t.confidenceHelper}
              highLabel={t.confidenceHigh}
              mediumLabel={t.confidenceMedium}
              lowLabel={t.confidenceLow}
            />
          ) : null}
        </main>
      ) : null}

      {view === "review" ? (
        <main className="app-main">
          <section className="card">
            <h2>{t.sessionDone}</h2>
            <p>{t.sessionSummary(trainingCorrect, 10)}</p>
            <div className="button-row">
              <button type="button" onClick={() => startTraining()}>
                {t.anotherRound}
              </button>
              <button type="button" className="secondary" onClick={goToDashboard}>
                {t.dashboardTitle}
              </button>
            </div>
          </section>
        </main>
      ) : null}

      {view === "glossary" ? (
        <main className="app-main">
          <Glossary title={t.glossaryTitle} intro={t.glossaryIntro} entries={glossary[language]} />
          <div className="button-row">
            <button type="button" className="secondary" onClick={goToDashboard}>
              {t.glossaryBack}
            </button>
          </div>
        </main>
      ) : null}
    </div>
  );
};

export default App;
