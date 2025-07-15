// import React from 'react';
import { motion } from 'framer-motion';
import LinkShortener from '../components/LinkShortener';
import InitialLinkCreator from '../components/InitialLinkCreator';
import SEOHead from '../components/SEOHead';

export default function LinkShortenerPage() {
  return (
    <>
      <SEOHead
        title="Encurtador de Links - CERRADØ INTERBOX 2025"
        description="Crie links curtos e acompanhe suas estatísticas. Ferramenta gratuita para encurtar URLs do evento CERRADØ INTERBOX 2025."
        image="/images/og-interbox.png"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              🔗 Encurtador de Links
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Crie links curtos e acompanhe suas estatísticas em tempo real. 
              Ferramenta gratuita para o CERRADØ INTERBOX 2025.
            </p>
          </motion.div>

          <InitialLinkCreator className="mb-8" />
          <LinkShortener />
        </div>
      </div>
    </>
  );
} 