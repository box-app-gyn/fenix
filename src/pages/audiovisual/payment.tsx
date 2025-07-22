import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getFunctions, httpsCallable } from 'firebase/functions';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import OptimizedImage from '../../components/OptimizedImage';
import { useAnalytics } from '../../hooks/useAnalytics';
import { useAuth } from '../../hooks/useAuth';
import SEOHead from '../../components/SEOHead';
import LoadingScreen from '../../components/LoadingScreen';

interface PaymentData {
  correlationID: string;
  checkoutUrl: string;
  isSimulated: boolean;
  amount: number;
  description: string;
}

export default function AudiovisualPaymentPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { trackPage, trackAudiovisual } = useAnalytics();
  const functions = getFunctions();
  
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  // Dados do formulário passados via URL
  const formData = {
    userEmail: searchParams.get('email'),
    userName: searchParams.get('nome'),
    whatsapp: searchParams.get('whatsapp'),
    tipo: searchParams.get('tipo'),
    comentariosOutro: searchParams.get('comentariosOutro'),
    experiencia: searchParams.get('experiencia'),
    portfolio: searchParams.get('portfolio'),
    equipamentos: searchParams.get('equipamentos'),
    especialidades: searchParams.get('especialidades'),
    disponibilidade: searchParams.get('disponibilidade'),
    motivacao: searchParams.get('motivacao'),
    cidade: searchParams.get('cidade'),
    estado: searchParams.get('estado'),
  };

  useEffect(() => {
    trackPage('audiovisual_payment');
    trackAudiovisual('view_payment_page', 'flowpay_checkout');
  }, [trackPage, trackAudiovisual]);

  useEffect(() => {
    const initializePayment = async () => {
      try {
        setLoading(true);
        setError('');

        // Verificar se temos todos os dados necessários
        if (!formData.userEmail || !formData.userName) {
          throw new Error('Dados do formulário incompletos. Por favor, preencha o formulário novamente.');
        }

        if (!user) {
          throw new Error('Usuário não autenticado. Por favor, faça login para continuar.');
        }

        // Criar checkout na OpenPix (mas mostrar como FlowPay)
        const criarCheckoutFlowPay = httpsCallable(functions, 'criarCheckoutFlowPay');
        const result = await criarCheckoutFlowPay(formData);
        const checkoutResult = result.data as any;

        if (checkoutResult.success) {
          setPaymentData({
            correlationID: checkoutResult.correlationID,
            checkoutUrl: checkoutResult.checkoutUrl,
            isSimulated: checkoutResult.isSimulated || false,
            amount: 29.90,
            description: 'Taxa de Inscrição - Candidatura Audiovisual INTERBOX 2025'
          });

          // Analytics
          trackAudiovisual('payment_initialized', 'flowpay_checkout_created');
        } else {
          throw new Error('Erro ao criar checkout de pagamento');
        }
      } catch (error: any) {
        console.error('Erro ao inicializar pagamento:', error);
        setError(error.message || 'Erro ao processar pagamento');
        trackAudiovisual('payment_error', 'flowpay_checkout_error');
      } finally {
        setLoading(false);
      }
    };

    initializePayment();
  }, [user, formData, functions, trackAudiovisual]);

  const handlePayment = () => {
    if (!paymentData?.checkoutUrl) {
      setError('URL de pagamento não disponível');
      return;
    }

    try {
      setProcessing(true);
      
      // Abrir checkout em nova aba
      window.open(paymentData.checkoutUrl, '_blank');
      
      // Analytics
      trackAudiovisual('payment_redirected', 'flowpay_checkout_opened');
      
      // Redirecionar para página de sucesso após um delay
      setTimeout(() => {
        navigate('/audiovisual/success', { 
          replace: true,
          state: { 
            correlationID: paymentData.correlationID,
            isSimulated: paymentData.isSimulated 
          }
        });
      }, 2000);
      
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      setError('Erro ao abrir página de pagamento');
      setProcessing(false);
    }
  };

  const handleCancel = () => {
    trackAudiovisual('payment_cancelled', 'flowpay_checkout_cancelled');
    navigate('/audiovisual/form', { replace: true });
  };

  if (loading) {
    return <LoadingScreen message="Preparando pagamento..." />;
  }

  if (error) {
    return (
      <>
        <SEOHead
          title="Erro no Pagamento - CERRADO INTERBØX 2025"
          description="Erro ao processar pagamento da candidatura audiovisual."
          image="/images/og-interbox.png"
          type="website"
        />
        <div className="min-h-screen bg-white">
          <Header />
          <main className="pt-24 pb-16 px-4">
            <div className="max-w-md mx-auto text-center">
              <div className="text-red-600 text-6xl mb-4">❌</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Erro no Pagamento</h1>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={() => navigate('/audiovisual/form')}
                className="bg-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-pink-700 transition-all duration-200"
              >
                Voltar ao Formulário
              </button>
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead
        title="Pagamento Seguro - FlowPay | CERRADO INTERBØX 2025"
        description="Finalize sua candidatura audiovisual com pagamento seguro via FlowPay."
        image="/images/og-interbox.png"
        type="website"
      />
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
        <Header />
        
        <main className="pt-24 pb-16 px-4">
          <div className="max-w-2xl mx-auto">
            {/* Header com logo FlowPay */}
            <div className="text-center mb-8">
              <OptimizedImage
                src="/logos/FLOWPAY_trans.png"
                alt="FlowPay - Pagamento Seguro"
                width={200}
                height={80}
                className="mx-auto mb-6"
                style={{
                  maxWidth: '200px',
                  height: 'auto',
                }}
              />
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
                Pagamento Seguro
              </h1>
              <p className="text-gray-600">
                Complete sua candidatura audiovisual com segurança
              </p>
            </div>

            {/* Card de Pagamento */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-pink-200">
              {/* Resumo da Candidatura */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Resumo da Candidatura</h2>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nome:</span>
                    <span className="font-semibold">{formData.userName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-semibold">{formData.userEmail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">WhatsApp:</span>
                    <span className="font-semibold">{formData.whatsapp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Área:</span>
                    <span className="font-semibold capitalize">{formData.tipo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cidade:</span>
                    <span className="font-semibold">{formData.cidade}, {formData.estado}</span>
                  </div>
                </div>
              </div>

              {/* Detalhes do Pagamento */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Detalhes do Pagamento</h2>
                <div className="bg-pink-50 rounded-lg p-6 border border-pink-200">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold text-gray-900">Taxa de Inscrição</span>
                    <span className="text-2xl font-bold text-pink-600">R$ 29,90</span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Pagamento 100% seguro via FlowPay
                    </div>
                    <div className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Processamento instantâneo
                    </div>
                    <div className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Certificado SSL
                    </div>
                  </div>

                  {paymentData?.isSimulated && (
                    <div className="mt-4 p-3 bg-yellow-100 rounded-lg border border-yellow-300">
                      <p className="text-yellow-800 text-sm">
                        🧪 <strong>Modo de Teste:</strong> Pagamento simulado para desenvolvimento
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="space-y-4">
                <button
                  onClick={handlePayment}
                  disabled={processing}
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-pink-700 hover:to-purple-700 focus:ring-4 focus:ring-pink-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                >
                  {processing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processando...
                    </>
                  ) : (
                    <>
                      <span className="mr-2">💳</span>
                      Pagar com FlowPay
                    </>
                  )}
                </button>

                <button
                  onClick={handleCancel}
                  disabled={processing}
                  className="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 focus:ring-4 focus:ring-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Cancelar
                </button>
              </div>

              {/* Informações de Segurança */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <span className="text-green-500 mr-1">🔒</span>
                    SSL Seguro
                  </div>
                  <div className="flex items-center">
                    <span className="text-blue-500 mr-1">🛡️</span>
                    Proteção de Dados
                  </div>
                  <div className="flex items-center">
                    <span className="text-purple-500 mr-1">⚡</span>
                    Processamento Rápido
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
} 