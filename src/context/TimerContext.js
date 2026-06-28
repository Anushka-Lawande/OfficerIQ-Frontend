import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

const TimerContext = createContext(null);

export function TimerProvider({ children }) {
  const [durationSeconds, setDurationSeconds] = useState(25 * 60);
  const [remaining, setRemaining] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  // hasStarted stays true even when paused, so the global bar keeps showing
  // until the user explicitly stops / finishes the session.
  const [hasStarted, setHasStarted] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => intervalRef.current && clearInterval(intervalRef.current);
  }, [isRunning]);

  // Called from the editable minutes/seconds fields.
  const setCustomDuration = (mins, secs) => {
    const safeMins = Number.isFinite(mins) ? Math.max(0, Math.floor(mins)) : 0;
    const safeSecs = Number.isFinite(secs) ? Math.max(0, Math.min(59, Math.floor(secs))) : 0;
    const total = safeMins * 60 + safeSecs;
    setDurationSeconds(total);
    setRemaining(total);
    setIsRunning(false);
    setHasStarted(false);
  };

  const start = () => {
    if (durationSeconds <= 0) return;
    setRemaining((prev) => (prev <= 0 ? durationSeconds : prev));
    setIsRunning(true);
    setHasStarted(true);
  };

  const pause = () => setIsRunning(false);

  const resume = () => {
    if (remaining <= 0) return;
    setIsRunning(true);
  };

  const restart = () => {
    setRemaining(durationSeconds);
    setIsRunning(true);
    setHasStarted(true);
  };

  const stop = () => {
    setIsRunning(false);
    setHasStarted(false);
    setRemaining(durationSeconds);
  };

  const progressFraction =
    durationSeconds > 0 ? (durationSeconds - remaining) / durationSeconds : 0;

  return (
    <TimerContext.Provider
      value={{
        durationSeconds,
        remaining,
        isRunning,
        hasStarted,
        setCustomDuration,
        start,
        pause,
        resume,
        restart,
        stop,
        progressFraction,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const ctx = useContext(TimerContext);
  if (!ctx) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return ctx;
}
