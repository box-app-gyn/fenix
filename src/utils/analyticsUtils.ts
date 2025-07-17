// Utilitários para Google Analytics e Cookies

export const initializeAnalytics = (measurementId: string) => {
  try {
    // Verificar se estamos em um ambiente válido
    if (typeof window === 'undefined') {
      console.log('ℹ️ Analytics: Ambiente não suportado (SSR)');
      return false;
    }

    // Verificar se o gtag está disponível
    if (!(window as any).gtag) {
      console.log('ℹ️ Analytics: gtag não disponível');
      return false;
    }

    // Configurar Analytics com configurações otimizadas
    (window as any).gtag('config', measurementId, {
      cookie_domain: window.location.hostname,
      cookie_flags: 'SameSite=None;Secure',
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      // Configurações adicionais para evitar problemas
      send_page_view: true,
      page_title: document.title,
      page_location: window.location.href,
    });

    console.log('✅ Analytics inicializado com sucesso');
    return true;
  } catch (error) {
    console.warn('⚠️ Erro ao inicializar Analytics:', error);
    return false;
  }
};

export const trackPageView = (page: string) => {
  try {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', import.meta.env.VITE_FIREBASE_MEASUREMENT_ID, {
        page_title: page,
        page_location: window.location.href,
      });
      console.log('📊 Page view tracked:', page);
    }
  } catch (error) {
    console.warn('⚠️ Erro ao trackear page view:', error);
  }
};

export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  try {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      });
      console.log('📊 Event tracked:', action, category, label);
    }
  } catch (error) {
    console.warn('⚠️ Erro ao trackear evento:', error);
  }
};

export const trackLogin = (method: string) => {
  trackEvent('login', 'authentication', method);
};

export const trackLogout = () => {
  trackEvent('logout', 'authentication');
};

export const trackError = (errorMessage: string, context?: string) => {
  trackEvent('error', 'system', context, 1);
  console.error('❌ Error tracked:', errorMessage, context);
};

// Utilitários para cookies
export const setCookie = (name: string, value: string, days: number = 30) => {
  try {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));

    const cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=None;Secure`;
    document.cookie = cookie;

    console.log('🍪 Cookie definido:', name);
  } catch (error) {
    console.warn('⚠️ Erro ao definir cookie:', error);
  }
};

export const getCookie = (name: string): string | null => {
  try {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null;
    }
    return null;
  } catch (error) {
    console.warn('⚠️ Erro ao ler cookie:', error);
    return null;
  }
};

export const deleteCookie = (name: string) => {
  try {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    console.log('🍪 Cookie removido:', name);
  } catch (error) {
    console.warn('⚠️ Erro ao remover cookie:', error);
  }
};

// Verificar se cookies são suportados
export const areCookiesEnabled = (): boolean => {
  try {
    const testCookie = 'test_cookie_support';
    setCookie(testCookie, '1', 1);
    const exists = getCookie(testCookie) !== null;
    deleteCookie(testCookie);
    return exists;
  } catch (error) {
    console.warn('⚠️ Cookies não suportados:', error);
    return false;
  }
};

// Configuração de privacidade - apenas verifica consentimento
export const configurePrivacySettings = (): boolean => {
  try {
    // Verificar se o usuário aceitou cookies
    const cookiesAccepted = getCookie('cookies_accepted');

    if (!cookiesAccepted) {
      console.log('ℹ️ Aguardando aceitação de cookies para Analytics');
      return false;
    }

    // Verificar se cookies são suportados
    if (!areCookiesEnabled()) {
      console.log('ℹ️ Cookies não suportados neste navegador');
      return false;
    }

    // Se chegou até aqui, pode inicializar analytics
    return true;
  } catch (error) {
    console.warn('⚠️ Erro ao configurar privacidade:', error);
    return false;
  }
};
