import { useCallback } from "react";

type HapticPattern = "light" | "medium" | "heavy" | "success" | "error" | "celebration";

const PATTERNS: Record<HapticPattern, number | number[]> = {
  light: 10,
  medium: 25,
  heavy: 50,
  success: [10, 50, 30],
  error: [50, 100, 50],
  celebration: [30, 50, 30, 50, 100, 50, 30],
};

function canVibrate(): boolean {
  return typeof navigator !== "undefined" && "vibrate" in navigator;
}

export function useHapticFeedback() {
  const vibrate = useCallback((pattern: HapticPattern = "light") => {
    if (!canVibrate()) return false;

    try {
      const vibrationPattern = PATTERNS[pattern];
      navigator.vibrate(vibrationPattern);
      return true;
    } catch {
      return false;
    }
  }, []);

  const vibrateOnTap = useCallback(() => {
    vibrate("light");
  }, [vibrate]);

  const vibrateOnSelect = useCallback(() => {
    vibrate("medium");
  }, [vibrate]);

  const vibrateOnSuccess = useCallback(() => {
    vibrate("success");
  }, [vibrate]);

  const vibrateOnError = useCallback(() => {
    vibrate("error");
  }, [vibrate]);

  const vibrateOnCelebration = useCallback(() => {
    vibrate("celebration");
  }, [vibrate]);

  return {
    vibrate,
    vibrateOnTap,
    vibrateOnSelect,
    vibrateOnSuccess,
    vibrateOnError,
    vibrateOnCelebration,
    isSupported: canVibrate(),
  };
}
