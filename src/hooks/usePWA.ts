import { useState, useEffect } from 'react';

interface PWAState {
  isStandalone: boolean;
  isIOS: boolean;
  isSafari: boolean;
  isInstalled: boolean;
  canInstall: boolean;
  showInstallPrompt: boolean;
  showSplash: boolean;
}

export function usePWA() {
  const [pwaState, setPwaState] = useState<PWAState>({
    isStandalone: false,
    isIOS: false,
    isSafari: false,
    isInstalled: false,
    canInstall: false,
    showInstallPrompt: false,
    showSplash: false
  });

  useEffect(() => {
    const detectPWA = () => {
      const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const safari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
      const standalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;
      const canInstall = !standalone && iOS && safari;
      const isInstalled = localStorage.getItem('pwa-installed') === 'true';
      const showSplash = iOS && safari && !standalone && !isInstalled;

      setPwaState({
        isStandalone: standalone,
        isIOS: iOS,
        isSafari: safari,
        isInstalled: isInstalled || standalone,
        canInstall,
        showInstallPrompt: false,
        showSplash
      });
    };

    detectPWA();
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addEventListener('change', detectPWA);
    window.addEventListener('orientationchange', detectPWA);

    return () => {
      mediaQuery.removeEventListener('change', detectPWA);
      window.removeEventListener('orientationchange', detectPWA);
    };
  }, []);

  const markAsInstalled = () => {
    localStorage.setItem('pwa-installed', 'true');
    setPwaState((prev) => ({ ...prev, isInstalled: true, showSplash: false, showInstallPrompt: false }));
  };

  const showInstallPrompt = () => setPwaState((prev) => ({ ...prev, showInstallPrompt: true }));
  const hideInstallPrompt = () => setPwaState((prev) => ({ ...prev, showInstallPrompt: false }));
  const hideSplash = () => setPwaState((prev) => ({ ...prev, showSplash: false }));

  return { ...pwaState, markAsInstalled, showInstallPrompt, hideInstallPrompt, hideSplash };
} 