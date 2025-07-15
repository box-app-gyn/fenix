import { useState, useEffect } from 'react';

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isTabletDevice = /ipad|android(?=.*\b(?!.*mobile))/i.test(userAgent);
      
      // Verificar também pelo tamanho da tela
      const screenWidth = window.innerWidth;
      const isMobileByScreen = screenWidth <= 768;
      const isTabletByScreen = screenWidth > 768 && screenWidth <= 1024;
      
      setIsMobile(isMobileDevice || isMobileByScreen);
      setIsTablet(isTabletDevice || isTabletByScreen);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return { isMobile, isTablet };
} 