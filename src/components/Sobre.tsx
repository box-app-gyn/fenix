import React from 'react'
import { motion } from 'framer-motion'
import { AudiovisualInvite } from './CallToAction'

const Sobre: React.FC = () => {
  return (
    <>
      <section id="sobre" className="bg-white text-gray-900 py-20 px-6 md:px-16">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight"
          >
            Isso não é um evento.
          </motion.h2>
          <div className="w-16 h-1 bg-gradient-to-r from-pink-500 to-cyan-400 mx-auto mb-8 rounded-full" />
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl md:text-2xl text-cyan-600 font-semibold mb-6"
          >
            CERRADØ 𝗜𝗡𝗧𝗘𝗥𝗕𝗢𝗫 é um ecossistema vivo.
          </motion.p>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-12"
          >
            Mais que competição — é comunidade, dados, pertencimento. A arena não começa no dia do evento. Ela começa quando você entra na CERRADØ 𝗜𝗡𝗧𝗘𝗥𝗕𝗢𝗫.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <p className="text-lg md:text-xl text-gray-800 font-medium mb-6">
              Pré-temporada digital. Arena física gamificada. Pós-evento com comunidade em fluxo.
            </p>
          </motion.div>
        </div>
      </section>
      
      <AudiovisualInvite />
    </>
  )
}

export default Sobre 