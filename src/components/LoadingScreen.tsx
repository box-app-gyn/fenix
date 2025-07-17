import { useState, useEffect } from 'react';

interface LoadingScreenProps {
  message?: string;
}

const phrases = [
  'WOD sendo executado...',
  'WOD sendo executado...',
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
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white transition-all">
      <div className="w-24 h-24 animate-pulse mb-6 flex items-center justify-center">
        <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
          <span className="text-2xl font-bold text-white">W</span>
        </div>
      </div>
      <span className="text-sm tracking-widest text-cyan-300 font-medium mb-2">WOD</span>
      <span className="text-lg text-blue-200 font-light text-center max-w-xs">{currentPhrase}</span>
    </div>
  );
}
