import { useState, useEffect } from 'react';

interface LoadingScreenProps {
  message?: string;
}

const phrases = [
  'Acessando ecossistema gamificado...',
  'Acessando seu perfil...',
  'Acessando plataforma INTERBØX...',
  'Carregando experiência imersiva...',
  'Preparando sua jornada...',
];

export default function LoadingScreen({ message }: LoadingScreenProps) {
  const [currentPhrase, setCurrentPhrase] = useState(message || phrases[0]);

  useEffect(() => {
    if (!message) {
      const interval = setInterval(() => {
        setCurrentPhrase((prev) => {
          const currentIndex = phrases.indexOf(prev);
          const nextIndex = (currentIndex + 1) % phrases.length;
          return phrases[nextIndex];
        });
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [message]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 text-white transition-all">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('/images/bg_main.png')] bg-cover bg-center bg-no-repeat"></div>
      </div>
      
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Logo Container */}
        <div className="w-32 h-32 animate-pulse mb-8 flex items-center justify-center">
          <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl shadow-pink-500/30">
            <img 
              src="/logos/logo_circulo.png" 
              alt="InterBox Logo" 
              className="w-16 h-16 object-contain"
            />
          </div>
        </div>
        
        {/* Brand Text */}
        <span className="text-lg tracking-widest text-pink-300 font-bold mb-4">INTERBØX</span>
        
        {/* Loading Message */}
        <span className="text-xl text-blue-200 font-light text-center max-w-sm leading-relaxed">
          {currentPhrase}
        </span>
        
        {/* Loading Dots */}
        <div className="flex space-x-2 mt-6">
          <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
}
