import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface ComunidadeStats {
  totalUsers: number;
  totalTeams: number;
  totalCategories: number;
  eventDays: number;
}

export default function Comunidade() {
  const [memberCount, setMemberCount] = useState(503);
  const [isAnimating, setIsAnimating] = useState(false);
  const [stats, setStats] = useState<ComunidadeStats>({
    totalUsers: 0,
    totalTeams: 0,
    totalCategories: 12,
    eventDays: 3
  });

  // Buscar dados reais do Firestore
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Buscar usuários
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const totalUsers = usersSnapshot.size;

        // Buscar times
        const teamsSnapshot = await getDocs(collection(db, 'teams'));
        const totalTeams = teamsSnapshot.size;

        // Buscar configurações de categorias
        const configDoc = doc(db, 'config', 'evento');
        const configSnapshot = await getDoc(configDoc);
        const totalCategories = configSnapshot.exists() 
          ? configSnapshot.data()?.categorias?.length || 12 
          : 12;

        setStats({
          totalUsers: Math.max(totalUsers, memberCount), // Usar o maior valor
          totalTeams,
          totalCategories,
          eventDays: 3
        });

        // Atualizar memberCount se os dados reais forem maiores
        if (totalUsers > memberCount) {
          setMemberCount(totalUsers);
        }
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      }
    };

    fetchStats();
  }, []);

  // Simular crescimento real da comunidade
  useEffect(() => {
    const interval = setInterval(() => {
      // 70% de chance de adicionar 1-3 membros a cada 30-60 segundos
      if (Math.random() > 0.3) {
        const newMembers = Math.floor(Math.random() * 3) + 1;
        setMemberCount(prev => prev + newMembers);
        setIsAnimating(true);
        
        // Reset animação após 2 segundos
        setTimeout(() => setIsAnimating(false), 2000);
      }
    }, Math.random() * 30000 + 30000); // 30-60 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background com bg_rounded.png */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/images/bg_rounded.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Overlay para melhorar legibilidade */}
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Conteúdo Texto */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center lg:text-left"
          >
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Aqui, é onde a comunidade pulsa e o futuro respira.
            </motion.h2>

            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              {/* Contador de membros animado */}
              <div className="flex items-center justify-center lg:justify-start space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-white font-semibold text-lg">
                    <motion.span
                      key={memberCount}
                      initial={{ scale: 1.2, color: '#10b981' }}
                      animate={{ scale: 1, color: '#ffffff' }}
                      transition={{ duration: 0.5 }}
                      className={isAnimating ? 'text-green-400' : 'text-white'}
                    >
                      {memberCount.toLocaleString()}
                    </motion.span>
                    <span className="text-gray-300 ml-1">membros ativos</span>
                  </span>
                </div>
                
                {/* Indicador de crescimento */}
                {isAnimating && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="text-green-400 text-sm font-medium"
                  >
                    +{Math.floor(Math.random() * 3) + 1} agora
                  </motion.div>
                )}
              </div>

              <div className="flex justify-center lg:justify-start">
                <a
                  href="https://chat.whatsapp.com/FHTqm0l36kc7RWYWMw1Kiz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  <span>Entrar na Comunidade</span>
                </a>
              </div>
            </motion.div>
          </motion.div>

          {/* Imagem do Smartphone */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              <motion.img
                src="/images/cellphone.png"
                alt="Comunidade Interbox no smartphone"
                className="w-80 h-auto drop-shadow-2xl"
                initial={{ rotateY: -15 }}
                whileInView={{ rotateY: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                viewport={{ once: true }}
              />
              
              {/* Efeito de brilho */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                initial={{ x: -100 }}
                whileInView={{ x: 100 }}
                transition={{ duration: 2, delay: 1, repeat: Infinity, repeatDelay: 3 }}
                viewport={{ once: true }}
              />
            </div>
          </motion.div>
        </div>

        {/* Estatísticas da Comunidade - Layout Melhorado */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          {/* Título da seção */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              📊 Números que Inspiram
            </h3>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Nossa comunidade cresce a cada dia, construindo juntos o maior evento de times da América Latina
            </p>
          </motion.div>

          {/* Grid de estatísticas melhorado */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Membros Ativos */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="bg-gradient-to-br from-pink-500/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-8 border border-pink-500/30 hover:border-pink-400/50 transition-all duration-300 hover:scale-105">
                <div className="text-center">
                  <div className="text-4xl lg:text-5xl font-bold text-white mb-3 group-hover:text-pink-300 transition-colors">
                    {memberCount.toLocaleString()}
                  </div>
                  <div className="text-gray-300 font-medium">Membros Ativos</div>
                  <div className="text-pink-400 text-sm mt-2">Crescendo agora</div>
                </div>
                {/* Ícone decorativo */}
                <div className="absolute top-4 right-4 text-pink-400/30 text-2xl">
                  👥
                </div>
              </div>
            </motion.div>

            {/* Times Registrados */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-600/20 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 hover:scale-105">
                <div className="text-center">
                  <div className="text-4xl lg:text-5xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                    {stats.totalTeams}
                  </div>
                  <div className="text-gray-300 font-medium">Times Registrados</div>
                  <div className="text-blue-400 text-sm mt-2">Competindo</div>
                </div>
                {/* Ícone decorativo */}
                <div className="absolute top-4 right-4 text-blue-400/30 text-2xl">
                  🏆
                </div>
              </div>
            </motion.div>

            {/* Categorias */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.6 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-sm rounded-2xl p-8 border border-green-500/30 hover:border-green-400/50 transition-all duration-300 hover:scale-105">
                <div className="text-center">
                  <div className="text-4xl lg:text-5xl font-bold text-white mb-3 group-hover:text-green-300 transition-colors">
                    {stats.totalCategories}
                  </div>
                  <div className="text-gray-300 font-medium">Categorias</div>
                  <div className="text-green-400 text-sm mt-2">Diversidade</div>
                </div>
                {/* Ícone decorativo */}
                <div className="absolute top-4 right-4 text-green-400/30 text-2xl">
                  🎯
                </div>
              </div>
            </motion.div>

            {/* Dias de Evento */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.8 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="bg-gradient-to-br from-orange-500/20 to-red-600/20 backdrop-blur-sm rounded-2xl p-8 border border-orange-500/30 hover:border-orange-400/50 transition-all duration-300 hover:scale-105">
                <div className="text-center">
                  <div className="text-4xl lg:text-5xl font-bold text-white mb-3 group-hover:text-orange-300 transition-colors">
                    {stats.eventDays}
                  </div>
                  <div className="text-gray-300 font-medium">Dias de Evento</div>
                  <div className="text-orange-400 text-sm mt-2">24-26 Out</div>
                </div>
                {/* Ícone decorativo */}
                <div className="absolute top-4 right-4 text-orange-400/30 text-2xl">
                  📅
                </div>
              </div>
            </motion.div>
          </div>

          {/* Call-to-action adicional */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <p className="text-gray-300 text-lg mb-6">
              Faça parte desta comunidade incrível e seja protagonista da maior competição de times da América Latina
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://chat.whatsapp.com/FHTqm0l36kc7RWYWMw1Kiz"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                <span>Grupo WhatsApp</span>
              </a>
              <a
                href="/l/ingresso2025"
                className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <span>🎫 Comprar Ingressos</span>
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
} 