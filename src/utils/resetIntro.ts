/**
 * Utilitário para resetar a vinheta de abertura
 * Útil para testes e desenvolvimento
 */
export const resetIntro = () => {
  localStorage.removeItem('hasSeenIntro');
  window.location.reload();
};

/**
 * Verifica se o usuário já viu a vinheta
 */
export const hasSeenIntro = (): boolean => {
  return localStorage.getItem('hasSeenIntro') === 'true';
};

/**
 * Força a exibição da vinheta na próxima visita
 */
export const forceShowIntro = () => {
  localStorage.removeItem('hasSeenIntro');
}; 