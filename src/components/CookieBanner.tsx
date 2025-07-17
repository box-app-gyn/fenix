import { useState, useEffect } from 'react';
import { setCookie, getCookie } from '../utils/analyticsUtils';
import { initializeAnalyticsManually } from '../lib/firebase';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Verificar se o usuário já aceitou os cookies
    const cookiesAccepted = getCookie('cookies_accepted');
    if (!cookiesAccepted) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = async () => {
    setCookie('cookies_accepted', 'true', 365); // 1 ano
    setIsVisible(false);

    // Inicializar analytics manualmente
    try {
      await initializeAnalyticsManually();
      console.log('✅ Analytics inicializado após aceitação de cookies');
    } catch (error) {
      console.warn('⚠️ Erro ao inicializar analytics:', error);
    }
  };

  const handleDecline = () => {
    setCookie('cookies_accepted', 'false', 365);
    setIsVisible(false);
    console.log('ℹ️ Cookies recusados - Analytics não será inicializado');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-xl w-[95vw] 
                  bg-black/70 backdrop-blur-md rounded-xl shadow-2xl border border-white/10 p-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-1 text-center sm:text-left">
          <h3 className="font-semibold text-lg mb-1">🍪 Política de Cookies</h3>
          <p className="text-sm text-gray-300">
            Usamos cookies para melhorar sua experiência. Ao continuar, você concorda com nossa política.
          </p>
        </div>
        <div className="flex gap-2 mt-3 sm:mt-0">
          <button
            onClick={handleDecline}
            className="px-4 py-2 text-sm border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Recusar
          </button>
          <button
            onClick={handleAccept}
            className="px-6 py-2 text-sm bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-200 font-medium"
          >
            Aceitar Todos
          </button>
        </div>
      </div>
    </div>
  );
}
