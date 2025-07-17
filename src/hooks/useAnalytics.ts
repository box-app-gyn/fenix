import { useCallback, useEffect } from 'react'
import { initializeAnalytics, trackPage as trackPageGA, trackEvent as trackEventGA, trackCTA as trackCTAGA, trackFormSubmit as trackFormSubmitGA, trackAudiovisual as trackAudiovisualGA, trackAdmin as trackAdminGA } from '../lib/analytics'

export function useAnalytics() {
  // Inicializar analytics quando o hook for usado
  useEffect(() => {
    initializeAnalytics()
  }, [])

  const trackPage = useCallback((page: string) => {
    console.log('Page tracked:', page)
    trackPageGA(page)
  }, [])

  const trackScroll = useCallback((section: string, percentage: number) => {
    console.log('Scroll tracked:', section, percentage)
    trackEventGA('scroll', 'engagement', section, percentage)
  }, [])

  const trackEvent = useCallback((action: string, category: string, label?: string, value?: number) => {
    console.log('Event tracked:', action, category, label, value)
    trackEventGA(action, category, label, value)
  }, [])

  const trackCTA = useCallback((cta: string, page: string) => {
    console.log('CTA tracked:', cta, page)
    trackCTAGA(cta, page)
  }, [])

  const trackFormSubmit = useCallback((formName: string) => {
    console.log('Form submit tracked:', formName)
    trackFormSubmitGA(formName)
  }, [])

  const trackAudiovisual = useCallback((action: string, label: string) => {
    console.log('Audiovisual tracked:', action, label)
    trackAudiovisualGA(action, label)
  }, [])

  const trackAdmin = useCallback((action: string, userEmail: string) => {
    console.log('Admin tracked:', action, userEmail)
    trackAdminGA(action, userEmail)
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
