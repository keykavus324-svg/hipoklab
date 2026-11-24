import { useCallback, useEffect, useRef, useState } from 'react';

export type PomodoroMode = 'work' | 'break';

export const POMODORO_DURATIONS: Record<PomodoroMode, number> = {
  work: 25 * 60,
  break: 5 * 60,
};

export interface PomodoroApi {
  mode: PomodoroMode;
  secondsLeft: number;
  running: boolean;
  progress: number; // 0..1
  toggle: () => void;
  reset: () => void;
  skip: () => void;
}

/**
 * 25 dk çalışma / 5 dk mola döngüsü. Süre dolduğunda mod otomatik geçer
 * ve isteğe bağlı `onPhaseComplete` geri çağrısı tetiklenir.
 */
export function usePomodoro(onPhaseComplete?: (mode: PomodoroMode) => void): PomodoroApi {
  const [mode, setMode] = useState<PomodoroMode>('work');
  const [secondsLeft, setSecondsLeft] = useState(POMODORO_DURATIONS.work);
  const [running, setRunning] = useState(false);
  const callbackRef = useRef(onPhaseComplete);
  callbackRef.current = onPhaseComplete;

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [running]);

  // Süre dolduğunda faz geçişi
  useEffect(() => {
    if (secondsLeft > 0) return;
    const nextMode: PomodoroMode = mode === 'work' ? 'break' : 'work';
    setMode(nextMode);
    setSecondsLeft(POMODORO_DURATIONS[nextMode]);
    callbackRef.current?.(mode);
  }, [secondsLeft, mode]);

  const toggle = useCallback(() => setRunning((r) => !r), []);

  const reset = useCallback(() => {
    setRunning(false);
    setMode('work');
    setSecondsLeft(POMODORO_DURATIONS.work);
  }, []);

  const skip = useCallback(() => {
    const next: PomodoroMode = mode === 'work' ? 'break' : 'work';
    setMode(next);
    setSecondsLeft(POMODORO_DURATIONS[next]);
  }, [mode]);

  const total = POMODORO_DURATIONS[mode];
  return {
    mode,
    secondsLeft,
    running,
    progress: 1 - secondsLeft / total,
    toggle,
    reset,
    skip,
  };
}

export function formatPomodoroTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
