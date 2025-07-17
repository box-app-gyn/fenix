import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Hub() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Verificar se usuário tem acesso ao Hub (apenas atletas e jurados)
  useEffect(() => {
    if (user && user.role && !['atleta', 'jurado'].includes(user.role)) {
      // Redirecionar para home se não for atleta ou jurado
      navigate('/home');
    }
  }, [user, navigate]);

  const hubItems = [
    {
      title: '📊 Tempo Real',
      description: 'Acompanhe eventos e dados em tempo real',
      path: '/tempo-real',
      color: 'from-blue-500 to-cyan-500',
      icon: '📊',
      available: true,
    },
    {
      title: '🏆 Leaderboard',
      description: 'Ranking gamificado dos participantes',
      path: '/leaderboard',
      color: 'from-yellow-500 to-orange-500',
      icon: '🏆',
      available: false,
      comingSoon: 'Disponível no dia da competição',
    },
    {
      title: '🎬 Audiovisual',
      description: 'Análise de conteúdo audiovisual',
      path: '/audiovisual',
      color: 'from-purple-500 to-pink-500',
      icon: '🎬',
      available: false,
      comingSoon: 'Disponível em 2 meses',
    },
    {
      title: '👤 Perfil',
      description: 'Gerencie suas informações pessoais',
      path: '/perfil',
      color: 'from-indigo-500 to-blue-500',
      icon: '👤',
      available: true,
    },
    {
      title: 'ℹ️ Sobre',
      description: 'Informações sobre o evento',
      path: '/sobre',
      color: 'from-gray-500 to-slate-500',
      icon: 'ℹ️',
      available: true,
    },
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header />

      {/* Background com imagem principal */}
      <div
        className="flex-1 relative"
        style={{
          backgroundImage: 'url(/images/bg_main.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Overlay gradiente */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60"></div>

        {/* Conteúdo principal */}
        <div className="relative z-10 container mx-auto px-4 py-8">
          {/* Header com informações do usuário */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 mb-8 border border-white/20"
          >
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Usuário'}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-2xl text-white">
                    {user?.displayName?.charAt(0) || 'U'}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-800">
                  Bem-vindo, {user?.displayName || 'Atleta'}!
                </h1>
                <p className="text-gray-600">
                  Categoria: {user?.categoria || 'Não definida'} • Box: {user?.box || 'Não informado'}
                </p>
              </div>
              <div className="text-right">
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {user?.isActive ? '🟢 Ativo' : '🔴 Inativo'}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Grid de funcionalidades */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hubItems.map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: item.available ? 1.02 : 1 }}
                whileTap={{ scale: item.available ? 0.98 : 1 }}
              >
                {item.available ? (
                  <Link to={item.path}>
                    <div className={`bg-gradient-to-br ${item.color} rounded-2xl shadow-lg p-6 h-full cursor-pointer transition-all duration-300 hover:shadow-xl border border-white/10`}>
                      <div className="flex items-center space-x-4">
                        <div className="text-4xl">{item.icon}</div>
                        <div className="flex-1">
                          <h2 className="text-xl font-bold text-white mb-2">
                            {item.title}
                          </h2>
                          <p className="text-white/90 text-sm">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <div className="bg-white/20 rounded-full p-2">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className={`bg-gradient-to-br ${item.color} rounded-2xl shadow-lg p-6 h-full border border-white/10 opacity-60`}>
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl">{item.icon}</div>
                      <div className="flex-1">
                        <h2 className="text-xl font-bold text-white mb-2">
                          {item.title}
                        </h2>
                        <p className="text-white/90 text-sm">
                          {item.description}
                        </p>
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/20 text-white">
                            ⏳ {item.comingSoon}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <div className="bg-white/10 rounded-full p-2">
                        <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Seção de estatísticas rápidas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-white/20"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">📈 Estatísticas Rápidas</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">1,234</div>
                <div className="text-sm text-gray-600">Participantes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">56</div>
                <div className="text-sm text-gray-600">Times</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">12</div>
                <div className="text-sm text-gray-600">Categorias</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">3</div>
                <div className="text-sm text-gray-600">Dias</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
