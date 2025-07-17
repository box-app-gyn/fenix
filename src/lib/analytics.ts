// Configuração do Google Analytics
declare global {
  interface Window {
    gtag: (command: 'config' | 'event' | 'set' | 'js', targetId: string, config?: any) => void;
    dataLayer: any[];
  }
}

// ID de medição do Google Analytics
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';

// Inicializar Google Analytics
export function initializeAnalytics() {
  if (typeof window === 'undefined') return;

  // Criar script do Google Analytics
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Configurar gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() {
    window.dataLayer.push(arguments);
  };

  // Configuração inicial
  (window as any).gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_title: document.title,
    page_location: window.location.href,
    cookie_domain: 'cerradointerbox.com.br',
    cookie_flags: 'SameSite=None;Secure',
  });
}

// Função para rastrear página
export function trackPage(page: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_title: page,
      page_location: window.location.href,
    });
  }
}

// Função para rastrear eventos
export function trackEvent(action: string, category: string, label?: string, value?: number) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
}

// Função para rastrear CTA
export function trackCTA(cta: string, _page: string) {
  trackEvent('click', 'cta', cta, undefined);
}

// Função para rastrear formulários
export function trackFormSubmit(formName: string) {
  trackEvent('form_submit', 'form', formName, undefined);
}

// Função para rastrear audiovisual
export function trackAudiovisual(action: string, label: string) {
  trackEvent(action, 'audiovisual', label, undefined);
}

// Função para rastrear admin
export function trackAdmin(action: string, userEmail: string) {
  trackEvent(action, 'admin', userEmail, undefined);
} 