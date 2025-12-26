import type { Attempt } from "./models";

const ATTEMPTS_KEY = "bruchtrainer.attempts";

export const loadAttempts = (): Attempt[] => {
  if (typeof window === "undefined") {
    return [];
  }
  const raw = window.localStorage.getItem(ATTEMPTS_KEY);
  if (!raw) {
    return [];
  }
  try {
    return JSON.parse(raw) as Attempt[];
  } catch {
    return [];
  }
};

export const saveAttempts = (attempts: Attempt[]): void => {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(attempts));
};
