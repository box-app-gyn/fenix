import { useState } from 'react';

export const useRateLimit = (maxAttempts: number = 5, windowMs: number = 60000) => {
  const [attempts, setAttempts] = useState(0);
  const [lastAttempt, setLastAttempt] = useState(0);

  const checkRateLimit = (): boolean => {
    const now = Date.now();
    if (now - lastAttempt > windowMs) setAttempts(0);
    if (attempts >= maxAttempts) return false;
    setAttempts((prev) => prev + 1);
    setLastAttempt(now);
    return true;
  };

  return { checkRateLimit, attempts, maxAttempts };
}; 