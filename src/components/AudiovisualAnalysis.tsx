

import { useAnalytics } from '../hooks/useAnalytics';
import OptimizedImage from './OptimizedImage.tsx';

export default function AudiovisualAnalysis() {
  const { trackCTA } = useAnalytics();

  const handleParticipateClick = () => trackCTA('QUERO PARTICIPAR', '/audiovisual');
  return (
    <div className="max-w-4xl mx-auto text-center text-white py-16">
      <h1 className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
        Audiovisual & Creators
      </h1>

      <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
        Faça parte da equipe audiovisual do maior evento de times da América Latina
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-pink-500/20">
          <h3 className="text-xl font-bold text-pink-400 mb-4">Fotografia</h3>
          <p className="text-gray-300">Capture momentos épicos dos atletas</p>
        </div>

        <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-pink-500/20">
          <h3 className="text-xl font-bold text-pink-400 mb-4">Vídeo</h3>
          <p className="text-gray-300">Produza conteúdo cinematográfico</p>
        </div>

        <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-pink-500/20">
          <h3 className="text-xl font-bold text-pink-400 mb-4">Social Media</h3>
          <p className="text-gray-300">Gerencie redes sociais do evento</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-pink-600 to-purple-600 p-8 rounded-lg mb-8">
        <h2 className="text-2xl font-bold mb-4">Quer fazer parte?</h2>
        <p className="text-lg mb-6">
          Candidate-se para nossa equipe audiovisual e seja parte de algo histórico
        </p>
      </div>

      {/* Botão com fita rosa */}
      <div className="relative inline-block group">
        {/* Fita rosa como botão */}
        <a 
          href="/audiovisual/form" 
          onClick={handleParticipateClick}
          className="relative inline-block transform transition-all duration-300 hover:scale-105 hover:rotate-1 group"
          style={{ cursor: 'pointer' }}
        >
          <OptimizedImage
            src="/images/pngtree-light-gray-old-paper.png"
            alt="Fita decorativa"
            className="h-16 w-auto object-contain"
          />
          
          {/* Texto sobre a fita */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <span className="text-2xl font-bold text-white">
              Quero participar
            </span>
          </div>
        </a>
      </div>
    </div>
  )
}
