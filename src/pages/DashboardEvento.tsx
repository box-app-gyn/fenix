import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';

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
}

const DashboardEvento: React.FC = () => {
  const { user } = useAuth();
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
    }
  });

  useEffect(() => {
    // Escutar dados em tempo real do Firestore
    const unsubscribe = onSnapshot(
      doc(db, 'config', 'tempo_real'),
      (doc) => {
        if (doc.exists()) {
          const firestoreData = doc.data() as TempoRealData;
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
            }
          });
        } else {
          // Dados padrão se documento não existir
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
            }
          });
        }
      },
      (error) => {
        console.error('❌ Erro ao carregar dados em tempo real:', error);
        // Fallback em caso de erro
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
          }
        });
      }
    );

    return () => unsubscribe();
  }, []);

  // Verificar se usuário tem acesso (admin ou roles específicos)
  const hasAccess = user && (
        (user as any).role === 'admin' ||
    (user as any).role === 'jurado' ||
    (user as any).role === 'midia' ||
    (user as any).role === 'fotografo'
  );

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acesso Negado</h1>
          <p className="text-gray-600">Você não tem permissão para acessar este dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📊 Dashboard do Evento
          </h1>
          <p className="text-gray-600">
            Dados completos em tempo real do Interbox 2025
          </p>
        </motion.div>

        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          {/* Ingressos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
          >
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">🎟️ Ingressos</p>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {data.ingressos.status === 'disponivel' ? 'Disponível' : 
                 data.ingressos.status === 'esgotado' ? 'Esgotado' : 'Em Breve'}
              </p>
              <p className="text-xs text-gray-500">
                Lote {data.ingressos.loteAtual || 1} • {data.ingressos.vagasRestantes || 0} vagas
              </p>
            </div>
          </motion.div>

          {/* Indicações */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-blue-200"
          >
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">👥 Indicações</p>
              <p className="text-2xl font-bold text-blue-600 mb-1">
                {data.indicacoes.total.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">
                +{data.indicacoes.hoje} hoje
              </p>
            </div>
          </motion.div>

          {/* Fotógrafos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-purple-200"
          >
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">📸 Fotógrafos</p>
              <p className="text-2xl font-bold text-purple-600 mb-1">
                {data.fotografos.total}
              </p>
              <p className="text-xs text-gray-500">
                {data.fotografos.aprovados} aprovados
              </p>
            </div>
          </motion.div>

          {/* Tokens $BOX */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-pink-200"
          >
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">🎯 $BOX Distribuído</p>
              <p className="text-2xl font-bold text-pink-600 mb-1">
                {data.token.box.total.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">
                Média: {data.token.box.media} $BOX • {data.token.box.holders} holders
              </p>
            </div>
          </motion.div>
        </div>

        {/* Seções Detalhadas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Seção de Ingressos */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">🎟️ Status dos Ingressos</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status:</span>
                <span className={`font-semibold ${
                  data.ingressos.status === 'disponivel' ? 'text-green-600' :
                  data.ingressos.status === 'esgotado' ? 'text-red-600' : 'text-yellow-600'
                }`}>
                  {data.ingressos.status === 'disponivel' ? 'Disponível' :
                   data.ingressos.status === 'esgotado' ? 'Esgotado' : 'Em Breve'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Lote Atual:</span>
                <span className="font-semibold">{data.ingressos.loteAtual || 1}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Vagas Restantes:</span>
                <span className="font-semibold">{data.ingressos.vagasRestantes || 0}</span>
              </div>
              {data.ingressos.dataAbertura && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Data de Abertura:</span>
                  <span className="font-semibold">{data.ingressos.dataAbertura}</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Seção de Indicações */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">👥 Análise de Indicações</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total de Indicações:</span>
                <span className="font-semibold text-blue-600">{data.indicacoes.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Indicações Hoje:</span>
                <span className="font-semibold text-green-600">+{data.indicacoes.hoje}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Média Diária:</span>
                <span className="font-semibold">
                  {data.indicacoes.total > 0 ? Math.round(data.indicacoes.total / 30) : 0}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Seção de Fotógrafos */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">📸 Profissionais Audiovisuais</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total de Inscritos:</span>
                <span className="font-semibold text-purple-600">{data.fotografos.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Aprovados:</span>
                <span className="font-semibold text-green-600">{data.fotografos.aprovados}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Taxa de Aprovação:</span>
                <span className="font-semibold">
                  {data.fotografos.total > 0 ? Math.round((data.fotografos.aprovados / data.fotografos.total) * 100) : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pendentes:</span>
                <span className="font-semibold text-yellow-600">
                  {data.fotografos.total - data.fotografos.aprovados}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Seção de Tokens $BOX */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">🎯 Sistema de Tokens $BOX</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">$BOX Total Distribuído:</span>
                <span className="font-semibold text-pink-600">{data.token.box.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Média por Usuário:</span>
                <span className="font-semibold">{data.token.box.media} $BOX</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total de Holders:</span>
                <span className="font-semibold">{data.token.box.holders}</span>
              </div>
              {data.token.box.marketCap && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Market Cap Simulado:</span>
                  <span className="font-semibold text-green-600">
                    ${data.token.box.marketCap.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600">
                  <strong>Token:</strong> Cerrado Interbox Token ($BOX)<br/>
                  <strong>Rede:</strong> BSC Mainnet (BEP-20)<br/>
                  <strong>Contrato:</strong> 0xBc972E10Df612C7d65054BC67aBCA96B3C22a017
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-8 text-center text-gray-500 text-sm"
        >
          <p>Dados atualizados em tempo real • Última atualização: {new Date().toLocaleString('pt-BR')}</p>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardEvento; 