import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SEOHead from '../../components/SEOHead';
import { useAnalytics } from '../../hooks/useAnalytics';

export default function AudiovisualSuccessPage() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<any>(null);
  const { trackPage, trackAudiovisual } = useAnalytics();

  useEffect(() => {
    trackPage('audiovisual_success');
    trackAudiovisual('payment_success', 'flowpay_return');

    // Simular carregamento dos dados do pagamento
    const orderId = searchParams.get('order_id');
    const status = searchParams.get('status');

    if (orderId && status === 'paid') {
      setPaymentData({
        orderId,
        status,
        amount: '29,90',
        paidAt: new Date().toLocaleString('pt-BR'),
      });
    }

    setLoading(false);
  }, [searchParams, trackPage, trackAudiovisual]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title="Pagamento Confirmado - INTERBØX 2025"
        description="Sua inscrição audiovisual foi confirmada com sucesso! Bem-vindo ao time INTERBØX 2025."
        image="/images/og-interbox.png"
        type="website"
      />
      <div className="min-h-screen bg-white relative overflow-hidden">
        <Header />

        {/* Background com textura */}
        <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
          <div className="w-full h-full bg-[url('/images/bg_grunge.png')] bg-repeat opacity-20 mix-blend-multiply"></div>
        </div>

        <main className="pt-24 pb-16 px-4">
          <div className="max-w-2xl mx-auto relative z-10">
            {/* Header da página */}
            <div className="text-center mb-8">
              <img
                src="/logos/nome_hrz.png"
                alt="CERRADØ 𝗜𝗡𝗧𝗘𝗥𝗕𝗢𝗫 Logo"
                width={320}
                height={90}
                className="mx-auto mb-6 logo-grunge"
                style={{
                  filter: 'brightness(0) invert(0)',
                  maxWidth: '90vw',
                  height: 'auto',
                  width: 'auto',
                }}
              />
            </div>

            {/* Card de sucesso */}
            <div className="bg-gray-50 border border-green-300 rounded-2xl shadow-[0_8px_32px_0_rgba(34,197,94,0.25)] p-8 text-center relative grunge-card">
              <div className="text-green-600 text-8xl mb-6">🎉</div>

              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                Pagamento Confirmado!
              </h1>

              <p className="text-gray-600 mb-8 text-lg">
                Sua inscrição audiovisual foi processada com sucesso.
                Bem-vindo ao time da <span className="font-bold text-pink-600">INTERBØX 2025</span>!
              </p>

              {/* Detalhes do pagamento */}
              {paymentData && (
                <div className="bg-white border border-green-200 rounded-lg p-6 mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Detalhes da Transação
                  </h3>
                  <div className="space-y-3 text-left">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-semibold text-green-600">Pago</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Valor:</span>
                      <span className="font-semibold">R$ {paymentData.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Data:</span>
                      <span className="font-semibold">{paymentData.paidAt}</span>
                    </div>
                    {paymentData.orderId && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">ID da Transação:</span>
                        <span className="font-mono text-sm text-gray-500">{paymentData.orderId}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Próximos passos */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">
                  📋 Próximos Passos
                </h3>
                <ul className="text-blue-800 space-y-2 text-left">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Você receberá um email de confirmação em breve</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Nossa equipe entrará em contato para próximos passos</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Mantenha-se atento às atualizações no app</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Prepare-se para eternizar a intensidade do maior evento!</span>
                  </li>
                </ul>
              </div>

              {/* Informações importantes */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-yellow-900 mb-4">
                  ⚠️ Informações Importantes
                </h3>
                <ul className="text-yellow-800 space-y-2 text-left">
                  <li>• Guarde o comprovante de pagamento</li>
                  <li>• Verifique sua caixa de spam para o email de confirmação</li>
                  <li>• Em caso de dúvidas, entre em contato conosco</li>
                </ul>
              </div>

              {/* Botões de ação */}
              <div className="space-y-4">
                <a
                  href="/hub"
                  className="inline-block bg-pink-600 text-white py-4 px-8 rounded-lg font-semibold hover:bg-pink-700 focus:ring-4 focus:ring-pink-200 transition-all duration-200 text-lg"
                >
                  Voltar ao Hub
                </a>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="/perfil"
                    className="inline-block bg-gray-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-700 transition-all duration-200"
                  >
                    Ver Perfil
                  </a>
                  <a
                    href="/comunidade"
                    className="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-all duration-200"
                  >
                    Comunidade
                  </a>
                </div>
              </div>
            </div>

            {/* Mensagem de agradecimento */}
            <div className="text-center mt-8">
              <p className="text-gray-500 text-sm">
                Obrigado por fazer parte da <span className="font-semibold">CERRADØ INTERBOX 2025</span>!
                Juntos vamos criar algo incrível! 🏆
              </p>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
