import { useCallback } from 'react'

export function useAnalytics() {
  const trackPage = useCallback((page: string) => {
    // Implementar tracking de página
    console.log('Page tracked:', page)

    // Exemplo com Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: page,
        page_location: window.location.href,
      })
    }
  }, [])

  const trackScroll = useCallback((section: string, percentage: number) => {
    // Implementar tracking de scroll
    console.log('Scroll tracked:', section, percentage)

    // Exemplo com Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'scroll', {
        event_category: 'engagement',
        event_label: section,
        value: percentage,
      })
    }
  }, [])

  const trackEvent = useCallback((action: string, category: string, label?: string, value?: number) => {
    // Implementar tracking de eventos
    console.log('Event tracked:', action, category, label, value)

    // Exemplo com Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      })
    }
  }, [])

  const trackCTA = useCallback((cta: string, page: string) => {
    console.log('CTA tracked:', cta, page)

    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'click', {
        event_category: 'cta',
        event_label: cta,
        page: page,
      })
    }
  }, [])

  const trackFormSubmit = useCallback((formName: string) => {
    console.log('Form submit tracked:', formName)

    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'form_submit', {
        event_category: 'form',
        event_label: formName,
      })
    }
  }, [])

  const trackAudiovisual = useCallback((action: string, label: string) => {
    console.log('Audiovisual tracked:', action, label)

    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', action, {
        event_category: 'audiovisual',
        event_label: label,
      })
    }
  }, [])

  const trackAdmin = useCallback((action: string, userEmail: string) => {
    console.log('Admin tracked:', action, userEmail)

    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', action, {
        event_category: 'admin',
        event_label: userEmail,
      })
    }
  }, [])

  return {
    trackPage,
    trackScroll,
    trackEvent,
    trackCTA,
    trackFormSubmit,
    trackAudiovisual,
    trackAdmin,
  }
}
