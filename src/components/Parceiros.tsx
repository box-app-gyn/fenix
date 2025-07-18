import { motion } from 'framer-motion';

interface Parceiro {
  id: string;
  nome: string;
  logo: string;
  url?: string;
}

const parceiros: Parceiro[] = [
  {
    id: 'move',
    nome: 'Move',
    logo: '/logos/parceiros/move.png',
    url: 'https://move.com.br'
  }
  // Adicionar mais parceiros conforme necessário
];

export default function Parceiros() {
  return (
    <section className="py-16 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background com efeito sutil */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(236,72,153,0.1),transparent_50%)]"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header da seção */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Nossos Parceiros
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Empresas que acreditam no poder da comunidade e apoiam o maior evento de times da América Latina
          </p>
        </motion.div>

        {/* Grid de logos */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 items-center justify-items-center"
        >
          {parceiros.map((parceiro, index) => (
            <motion.div
              key={parceiro.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.6, 
                delay: 0.1 * index,
                type: "spring",
                stiffness: 100
              }}
              viewport={{ once: true }}
              whileHover={{ 
                scale: 1.05,
                filter: "brightness(1.1)",
                transition: { duration: 0.2 }
              }}
              className="group relative"
            >
              {parceiro.url ? (
                <a
                  href={parceiro.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="relative">
                    <div className="w-32 h-32 md:w-40 md:h-40 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 flex items-center justify-center transition-all duration-300 group-hover:bg-white/10 group-hover:border-pink-500/30 group-hover:shadow-[0_0_30px_rgba(236,72,153,0.3)]">
                      <img
                        src={parceiro.logo}
                        alt={`Logo ${parceiro.nome}`}
                        className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                        draggable="false"
                      />
                    </div>
                    
                    {/* Efeito de brilho no hover */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-pink-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    
                    {/* Nome do parceiro */}
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <span className="bg-black/90 text-white text-xs px-3 py-1 rounded-full border border-pink-500/30 whitespace-nowrap">
                        {parceiro.nome}
                      </span>
                    </div>
                  </div>
                </a>
              ) : (
                <div className="relative">
                  <div className="w-32 h-32 md:w-40 md:h-40 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 flex items-center justify-center transition-all duration-300 group-hover:bg-white/10 group-hover:border-pink-500/30 group-hover:shadow-[0_0_30px_rgba(236,72,153,0.3)]">
                    <img
                      src={parceiro.logo}
                      alt={`Logo ${parceiro.nome}`}
                      className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                      draggable="false"
                    />
                  </div>
                  
                  {/* Efeito de brilho no hover */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-pink-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  
                  {/* Nome do parceiro */}
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="bg-black/90 text-white text-xs px-3 py-1 rounded-full border border-pink-500/30 whitespace-nowrap">
                      {parceiro.nome}
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Call to action para novos parceiros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12 pt-8 border-t border-white/10"
        >
          <p className="text-gray-400 mb-4">
            Quer fazer parte desta comunidade?
          </p>
          <a
            href="#patrocinadores"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-medium rounded-xl hover:from-pink-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(236,72,153,0.4)]"
          >
            Seja um Parceiro
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
} 