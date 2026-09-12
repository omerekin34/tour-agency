"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useSuccessMessage(timeoutMs = 5000) {
  const [successMessage, setSuccessMessage] = useState("");
  const timerRef = useRef<number | null>(null);

  const clearSuccess = useCallback(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setSuccessMessage("");
  }, []);

  const showSuccess = useCallback(
    (message: string) => {
      clearSuccess();
      setSuccessMessage(message);
      timerRef.current = window.setTimeout(() => {
        setSuccessMessage("");
        timerRef.current = null;
      }, timeoutMs);
    },
    [clearSuccess, timeoutMs],
  );

  useEffect(() => () => clearSuccess(), [clearSuccess]);

  return { successMessage, showSuccess, clearSuccess };
}
