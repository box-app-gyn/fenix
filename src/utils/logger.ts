// src/utils/logger.ts
const sendToServer = (data: any) => {
  fetch('https://us-central1-interbox-app-8d400.cloudfunctions.net/logError', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  }).catch(() => {});
};

export const logger = {
  info: (...args: any[]) => {
    if (import.meta.env.MODE !== 'production') console.info('[INFO]', ...args);
  },
  warn: (...args: any[]) => {
    if (import.meta.env.MODE !== 'production') console.warn('[WARN]', ...args);
  },
  error: (...args: any[]) => {
    console.error('[ERROR]', ...args);

    const [messageOrError, ...rest] = args;
    const payload = {
      type: 'client-error',
      message:
        messageOrError instanceof Error ? messageOrError.message : messageOrError,
      stack: messageOrError instanceof Error ? messageOrError.stack : null,
      extra: rest,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
    };

    sendToServer(payload);
  },
  log: (...args: any[]) => {
    if (import.meta.env.MODE !== 'production') console.log('[LOG]', ...args);
  },
};
