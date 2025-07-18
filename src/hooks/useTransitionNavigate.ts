import { useNavigate } from 'react-router-dom';
import { startTransition } from 'react';

export const useTransitionNavigate = () => {
  const navigate = useNavigate();

  const transitionNavigate = (to: string, options?: { replace?: boolean; state?: any }) => {
    startTransition(() => {
      navigate(to, options);
    });
  };

  return transitionNavigate;
}; 