import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { doc, onSnapshot, collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';

interface TempoRealData {
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

interface FotografoData {
  id: string;
  displayName: string;
  email: string;
  tipo: string;
  aprovado: boolean | null; // null = pendente, true = aprovado, false = rejeitado
  createdAt: any;
}

const DashboardEvento: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<TempoRealData>({
    token: {
      box: {
        total: 0,
        media: 0,
        holders: 0,
        marketCap: 0
      }
    }
  });
  const [fotografos, setFotografos] = useState<FotografoData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Escutar dados em tempo real do Firestore
    const unsubscribe = onSnapshot(
      doc(db, 'config', 'tempo_real'),
      (doc) => {
        if (doc.exists()) {
          const firestoreData = doc.data() as TempoRealData;
          setData({
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

    // Carregar dados de fotógrafos
    const loadFotografos = async () => {
      try {
        const audiovisualSnapshot = await getDocs(collection(db, 'audiovisual'));
        const fotografosData = audiovisualSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as FotografoData[];
        
        setFotografos(fotografosData);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar fotógrafos:', error);
        setLoading(false);
      }
    };

    loadFotografos();
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-pink-500 mx-auto mb-4"></div>
          <p>Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  // Calcular estatísticas de fotógrafos
  const totalFotografos = fotografos.length;
  const aprovados = fotografos.filter(f => f.aprovado === true).length;
  const rejeitados = fotografos.filter(f => f.aprovado === false).length;
  const pendentes = fotografos.filter(f => f.aprovado === null).length;

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Fotógrafos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-purple-200"
          >
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">📸 Fotógrafos</p>
              <p className="text-2xl font-bold text-purple-600 mb-1">
                {totalFotografos}
              </p>
              <p className="text-xs text-gray-500">
                {aprovados} aprovados • {pendentes} pendentes
              </p>
            </div>
          </motion.div>

          {/* Tokens $BOX */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
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

          {/* Market Cap */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-green-200"
          >
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">💰 Market Cap</p>
              <p className="text-2xl font-bold text-green-600 mb-1">
                ${data.token.box.marketCap?.toLocaleString() || '0'}
              </p>
              <p className="text-xs text-gray-500">
                Valor total em circulação
              </p>
            </div>
          </motion.div>
        </div>

        {/* Seção Detalhada de Fotógrafos */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-lg mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">📸 Status dos Fotógrafos</h2>
          
          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <span className="text-green-600 text-2xl mr-3">✅</span>
                <div>
                  <p className="text-sm text-green-600 font-medium">Aprovados</p>
                  <p className="text-2xl font-bold text-green-700">{aprovados}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center">
                <span className="text-yellow-600 text-2xl mr-3">⏳</span>
                <div>
                  <p className="text-sm text-yellow-600 font-medium">Pendentes</p>
                  <p className="text-2xl font-bold text-yellow-700">{pendentes}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center">
                <span className="text-red-600 text-2xl mr-3">❌</span>
                <div>
                  <p className="text-sm text-red-600 font-medium">Rejeitados</p>
                  <p className="text-2xl font-bold text-red-700">{rejeitados}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de Fotógrafos */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profissional
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {fotografos.map((fotografo) => (
                  <tr key={fotografo.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {fotografo.displayName || 'Sem nome'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {fotografo.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {fotografo.tipo || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        fotografo.aprovado === true 
                          ? 'bg-green-100 text-green-800' 
                          : fotografo.aprovado === false 
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {fotografo.aprovado === true ? '✅ Aprovado' : 
                         fotografo.aprovado === false ? '❌ Rejeitado' : '⏳ Em Aprovação'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {fotografo.createdAt ? new Date(fotografo.createdAt.toDate()).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Seção de Tokens $BOX */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">💰 Tokens $BOX</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Distribuição</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Distribuído:</span>
                  <span className="font-semibold">{data.token.box.total.toLocaleString()} $BOX</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Média por Usuário:</span>
                  <span className="font-semibold">{data.token.box.media} $BOX</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total de Holders:</span>
                  <span className="font-semibold">{data.token.box.holders}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Valor de Mercado</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Market Cap:</span>
                  <span className="font-semibold text-green-600">
                    ${data.token.box.marketCap?.toLocaleString() || '0'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Preço por $BOX:</span>
                  <span className="font-semibold">
                    ${data.token.box.marketCap && data.token.box.total > 0 
                      ? (data.token.box.marketCap / data.token.box.total).toFixed(4) 
                      : '0.0000'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardEvento; 