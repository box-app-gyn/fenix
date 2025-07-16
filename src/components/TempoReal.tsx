import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface TempoRealData {
  ingressos: {
    status: 'em_breve' | 'disponivel' | 'esgotado';
    dataAbertura?: string;
    loteAtual?: number;
    vagasRestantes?: number;
  };
  indicacoes: {
    total: number;
    hoje: number;
  };
  fotografos: {
    total: number;
    aprovados: number;
  };
  // 🎯 ATUALIZADO: Sistema de Tokens $BOX
  token: {
    box: {
      total: number;    // Total distribuído de $BOX
      media: number;    // Média de $BOX por usuário
      holders: number;  // Número de holders
      marketCap?: number; // Market cap simulado
    };
  };
  // 🎯 NOVA CONFIGURAÇÃO: Controle do que mostrar na home
  mostrarNaHome?: {
    ingressos: boolean;
    token: boolean;     // Alterado de 'xp' para 'token'
    indicacoes: boolean;
    fotografos: boolean;
  };
}

interface TempoRealProps {
  isPublic?: boolean; // Nova prop para controlar versão pública
}

const TempoReal: React.FC<TempoRealProps> = ({ isPublic = false }) => {
  const [data, setData] = useState<TempoRealData>({
    ingressos: { status: 'em_breve' },
    indicacoes: { total: 0, hoje: 0 },
    fotografos: { total: 0, aprovados: 0 },
    token: {
      box: {
        total: 0,
        media: 0,
        holders: 0,
        marketCap: 0
      }
    },
    mostrarNaHome: {
      ingressos: true,
      token: true,      // Alterado de 'xp' para 'token'
      indicacoes: false, // ❌ REMOVIDO da home
      fotografos: false, // ❌ REMOVIDO da home
    }
  });

  const [countdown, setCountdown] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Data de abertura do Lote 1 (13/07/2025)
  const DATA_ABERTURA_LOTE1 = useMemo(() => new Date('2025-07-13T00:00:00-03:00'), []);

  useEffect(() => {
    // Se for versão pública, não carregar dados sensíveis
    if (isPublic) {
      return;
    }

    // Escutar dados em tempo real do Firestore
    const unsubscribe = onSnapshot(
      doc(db, 'config', 'tempo_real'),
      (doc) => {
        if (doc.exists()) {
          const firestoreData = doc.data() as TempoRealData;
          // 🎯 Aplicar configuração de exibição com fallback
          setData({
            ingressos: {
              status: 'em_breve',
              dataAbertura: firestoreData.ingressos?.dataAbertura,
              loteAtual: firestoreData.ingressos?.loteAtual,
              vagasRestantes: firestoreData.ingressos?.vagasRestantes
            },
            indicacoes: {
              total: firestoreData.indicacoes?.total || 0,
              hoje: firestoreData.indicacoes?.hoje || 0
            },
            fotografos: {
              total: firestoreData.fotografos?.total || 0,
              aprovados: firestoreData.fotografos?.aprovados || 0
            },
            token: {
              box: {
                total: firestoreData.token?.box?.total || 0,
                media: firestoreData.token?.box?.media || 0,
                holders: firestoreData.token?.box?.holders || 0,
                marketCap: firestoreData.token?.box?.marketCap || 0
              }
            },
            mostrarNaHome: {
              ingressos: true,
              token: true,      // Alterado de 'xp' para 'token'
              indicacoes: false, // Sempre false na home
              fotografos: false, // Sempre false na home
              ...firestoreData.mostrarNaHome
            }
          });
        } else {
          // 🎯 Dados padrão se documento não existir
          console.log('📊 Documento config/tempo_real não encontrado. Usando dados padrão.');
          setData({
            ingressos: { status: 'em_breve' },
            indicacoes: { total: 0, hoje: 0 },
            fotografos: { total: 0, aprovados: 0 },
            token: {
              box: {
                total: 0,
                media: 0,
                holders: 0,
                marketCap: 0
              }
            },
            mostrarNaHome: {
              ingressos: true,
              token: true,
              indicacoes: false,
              fotografos: false,
            }
          });
        }
      },
      (error) => {
        console.error('❌ Erro ao carregar dados em tempo real:', error);
        // 🎯 Fallback em caso de erro
        setData({
          ingressos: { status: 'em_breve' },
          indicacoes: { total: 0, hoje: 0 },
          fotografos: { total: 0, aprovados: 0 },
          token: {
            box: {
              total: 0,
              media: 0,
              holders: 0,
              marketCap: 0
            }
          },
          mostrarNaHome: {
            ingressos: true,
            token: true,
            indicacoes: false,
            fotografos: false,
          }
        });
      }
    );

    return () => unsubscribe();
  }, [isPublic]);

  useEffect(() => {
    // Contagem regressiva para abertura dos ingressos
    const timer = setInterval(() => {
      const now = new Date();
      const diff = DATA_ABERTURA_LOTE1.getTime() - now.getTime();

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setCountdown({ days, hours, minutes, seconds });
      } else {
        // Ingressos já estão disponíveis
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [DATA_ABERTURA_LOTE1]);

  const isIngressosDisponiveis = () => {
    return new Date() >= DATA_ABERTURA_LOTE1;
  };

  const getIngressosStatus = () => {
    if (isIngressosDisponiveis()) {
      return data.ingressos.status === 'esgotado' ? 'esgotado' : 'disponivel';
    }
    return 'em_breve';
  };

  const getIngressosText = () => {
    const status = getIngressosStatus();
    
    switch (status) {
      case 'em_breve':
        return {
          title: '🎟️ Ingressos Lote 1',
          subtitle: `Disponível em ${countdown.days} dias`,
          description: '⏳ Em breve – Lote 1 abre em X dias'
        };
      case 'disponivel':
        return {
          title: '🎟️ Ingressos Disponíveis',
          subtitle: `Lote ${data.ingressos.loteAtual || 1}`,
          description: `✅ ${data.ingressos.vagasRestantes || 0} vagas restantes`
        };
      case 'esgotado':
        return {
          title: '🎟️ Ingressos Esgotados',
          subtitle: 'Lote 1',
          description: '❌ Vagas esgotadas'
        };
      default:
        return {
          title: '🎟️ Ingressos',
          subtitle: 'Em breve',
          description: '⏳ Aguarde...'
        };
    }
  };

  const ingressosInfo = getIngressosText();

  // 🎯 FILTRAR CARDS PARA MOSTRAR APENAS OS ESSENCIAIS NA HOME
  const cardsParaMostrar = [
    // ✅ INGRESSOS - SEMPRE MOSTRAR (conversão)
    ...(data.mostrarNaHome?.ingressos ? [{
      id: 'ingressos',
      component: (
        <motion.div
          key="ingressos"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          viewport={{ once: true }}
          className={`rounded-xl p-6 border transition-all duration-300 ${
            getIngressosStatus() === 'em_breve' 
              ? 'opacity-60 border-gray-700 bg-black/40' 
              : getIngressosStatus() === 'disponivel'
              ? 'border-green-500/50 bg-green-500/10'
              : 'border-red-500/50 bg-red-500/10'
          }`}
        >
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-2">{ingressosInfo.title}</p>
            <p className={`text-xl font-bold mb-1 ${
              getIngressosStatus() === 'em_breve' 
                ? 'text-pink-500' 
                : getIngressosStatus() === 'disponivel'
                ? 'text-green-400'
                : 'text-red-400'
            }`}>
              {ingressosInfo.subtitle}
            </p>
            <p className="text-xs text-gray-500">{ingressosInfo.description}</p>
            
            {/* Contagem regressiva detalhada */}
            {getIngressosStatus() === 'em_breve' && countdown.days > 0 && (
              <div className="mt-3 text-xs text-gray-400">
                <div className="flex justify-center space-x-2">
                  <span>{countdown.days}d</span>
                  <span>{countdown.hours}h</span>
                  <span>{countdown.minutes}m</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )
    }] : []),

    // ✅ TOKENS $BOX - MOSTRAR SE GAMIFICAÇÃO ATIVA (engajamento) - APENAS SE NÃO FOR PÚBLICO
    ...(data.mostrarNaHome?.token && !isPublic ? [{
      id: 'token',
      component: (
        <motion.div
          key="token"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="rounded-xl p-6 border border-pink-500/50 bg-pink-500/10"
        >
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-2">🎯 $BOX Distribuído</p>
            <p className="text-2xl font-bold text-pink-400 mb-1">
              {data.token.box.total !== undefined ? data.token.box.total.toLocaleString() : '0'}
            </p>
            <p className="text-xs text-gray-500">
              Média: {data.token.box.media} $BOX • {data.token.box.holders} holders
            </p>
          </div>
        </motion.div>
      )
    }] : []),

    // ❌ INDICAÇÕES - REMOVIDO da home (vai para dashboard)
    // ❌ FOTÓGRAFOS - REMOVIDO da home (vai para dashboard)
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Título */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ⚡ O Cerrado já está em movimento
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Veja quem já começou a jornada rumo ao Interbox 2025.
            {!isIngressosDisponiveis() && ' Fique pronto — a pré-venda abre em poucos dias.'}
          </p>
        </motion.div>

        {/* Cards em tempo real - APENAS ESSENCIAIS */}
        <div className={`grid gap-6 ${
          cardsParaMostrar.length === 1 
            ? 'grid-cols-1 max-w-md mx-auto' 
            : cardsParaMostrar.length === 2 
            ? 'grid-cols-1 md:grid-cols-2 max-w-2xl mx-auto'
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
        }`}>
          {cardsParaMostrar.map(card => card.component)}
        </div>

        {/* Call to Action - FOCO TOTAL NA CONVERSÃO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-xl p-8 border border-pink-500/30">
            <h3 className="text-xl font-bold text-white mb-4">
              {isIngressosDisponiveis() 
                ? '🎯 Ingressos já estão disponíveis!' 
                : '⏰ Prepare-se para a abertura'
              }
            </h3>
            <p className="text-gray-400 mb-6">
              {isIngressosDisponiveis()
                ? 'Não perca a chance de participar do maior evento de times da América Latina.'
                : 'Entre na comunidade oficial e receba notificações em primeira mão.'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isIngressosDisponiveis() ? (
                <a
                  href="/l/ingresso2025"
                  className="bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold py-3 px-8 rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-200"
                >
                  🎫 Comprar Ingresso
                </a>
              ) : (
                <a
                  href="https://chat.whatsapp.com/FHTqm0l36kc7RWYWMw1Kiz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition-all duration-200"
                >
                  📲 Entrar na Comunidade
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TempoReal; 