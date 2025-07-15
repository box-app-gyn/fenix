import React, { useState, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
// import Image from 'next/image';
import { useAnalytics } from '@/hooks/useAnalytics';
import SEOHead from '@/components/SEOHead';
import { 
  FirestoreAudiovisual, 
  AudiovisualTipo, 
  ApprovalStatus,
  createTimestamp,
  validateAudiovisualData,
  sanitizeAudiovisualData
} from '@/types/firestore';

// Tipos para o formulário
interface AudiovisualFormData {
  nome: string;
  email: string;
  telefone: string;
  cidade: string;
  estado: string;
  tipo: AudiovisualTipo;
  experiencia: string;
  portfolio: string;
  equipamentos: string;
  especialidades: string;
  disponibilidade: string;
  motivacao: string;
  termosAceitos: boolean;
}

// Validação do formulário
const validateForm = (data: AudiovisualFormData): string[] => {
  const errors: string[] = [];
  
  if (!data.nome.trim()) errors.push('Nome é obrigatório');
  if (!data.email.trim()) errors.push('Email é obrigatório');
  if (!data.email.includes('@')) errors.push('Email inválido');
  if (!data.telefone.trim()) errors.push('Telefone é obrigatório');
  if (!data.cidade.trim()) errors.push('Cidade é obrigatória');
  if (!data.estado.trim()) errors.push('Estado é obrigatório');
  if (!data.tipo) errors.push('Área de atuação é obrigatória');
  if (!data.experiencia.trim()) errors.push('Experiência é obrigatória');
  if (!data.portfolio.trim()) errors.push('Portfólio é obrigatório');
  if (!data.equipamentos.trim()) errors.push('Equipamentos são obrigatórios');
  if (!data.especialidades.trim()) errors.push('Especialidades são obrigatórias');
  if (!data.disponibilidade.trim()) errors.push('Disponibilidade é obrigatória');
  if (!data.motivacao.trim()) errors.push('Motivação é obrigatória');
  if (!data.termosAceitos) errors.push('Você deve aceitar os termos');
  
  return errors;
};

// Estado inicial do formulário
const initialFormData: AudiovisualFormData = {
  nome: '',
  email: '',
  telefone: '',
  cidade: '',
  estado: '',
  tipo: 'fotografo',
  experiencia: '',
  portfolio: '',
  equipamentos: '',
  especialidades: '',
  disponibilidade: '',
  motivacao: '',
  termosAceitos: false
};

// Opções de área de atuação
const AREA_ATUACAO_OPTIONS: { value: AudiovisualTipo; label: string; description: string }[] = [
  { value: 'fotografo', label: 'Fotógrafo', description: 'Fotografia de eventos esportivos' },
  { value: 'videomaker', label: 'Videomaker', description: 'Produção de vídeos e filmagens' },
  { value: 'editor', label: 'Editor', description: 'Edição de vídeos e fotos' },
  { value: 'drone', label: 'Piloto de Drone', description: 'Filmagens aéreas com drone' },
  { value: 'audio', label: 'Técnico de Áudio', description: 'Captação e edição de áudio' },
  { value: 'iluminacao', label: 'Técnico de Iluminação', description: 'Iluminação para filmagens' }
];

// Estados brasileiros
const ESTADOS_BRASIL = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export default function AudiovisualFormPage() {
  const [formData, setFormData] = useState<AudiovisualFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const { trackPage, trackFormSubmit, trackAudiovisual } = useAnalytics();

  useEffect(() => {
    trackPage('audiovisual_form');
    trackAudiovisual('view_form', 'candidatura_audiovisual');
  }, [trackPage, trackAudiovisual]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpar erro do campo quando usuário começa a digitar
    if (formErrors.length > 0) {
      setFormErrors(prev => prev.filter(error => 
        !error.toLowerCase().includes(name.toLowerCase())
      ));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFormErrors([]);

    // Validar formulário
    const errors = validateForm(formData);
    if (errors.length > 0) {
      setFormErrors(errors);
      setLoading(false);
      return;
    }

    try {
      // Sanitizar dados
      const sanitizedData = sanitizeAudiovisualData(formData);
      
      // Criar documento Firestore
      const audiovisualData: Omit<FirestoreAudiovisual, 'id'> = {
        userId: `temp_${Date.now()}`, // Será atualizado quando usuário fizer login
        userEmail: sanitizedData.email,
        nome: sanitizedData.nome,
        telefone: sanitizedData.telefone,
        tipo: sanitizedData.tipo,
        portfolio: {
          urls: sanitizedData.portfolio.split('\n').filter((url: string) => url.trim()),
          descricao: sanitizedData.motivacao,
          experiencia: sanitizedData.experiencia,
          equipamentos: sanitizedData.equipamentos.split('\n').filter((item: string) => item.trim()),
          especialidades: sanitizedData.especialidades.split('\n').filter((esp: string) => esp.trim())
        },
        termosAceitos: true,
        termosAceitosEm: createTimestamp(),
        status: 'pending' as ApprovalStatus,
        createdAt: createTimestamp(),
        updatedAt: createTimestamp(),
        metadata: {
          source: 'app',
          ipAddress: '', // Será preenchido pelo backend
          userAgent: navigator.userAgent,
          referrer: document.referrer
        },
        credentials: {
          accessLevel: 'basic',
          areas: [sanitizedData.tipo],
          schedule: []
        },
        payment: {
          required: false
        },
        communication: {
          emailNotifications: true,
          smsNotifications: false,
          whatsappNotifications: false
        }
      };

      // Validar dados antes de salvar
      const validationErrors = validateAudiovisualData(audiovisualData);
      if (validationErrors.length > 0) {
        throw new Error(`Erro de validação: ${validationErrors.join(', ')}`);
      }

      // Salvar no Firestore
      const docId = `${Date.now()}-${sanitizedData.email.replace(/[^a-zA-Z0-9]/g, '')}`;
      await setDoc(doc(db, 'audiovisual', docId), audiovisualData);

      // Analytics
      trackFormSubmit('formulario_audiovisual');
      trackAudiovisual('submit_form', `${sanitizedData.tipo}_${sanitizedData.cidade}`);

      setSuccess(true);
      
      // Fechar janela após 3 segundos
      setTimeout(() => {
        window.close();
      }, 3000);
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setError(`Erro ao enviar formulário: ${errorMessage}`);
      console.error('Erro ao enviar formulário:', error);
      trackAudiovisual('form_error', 'erro_envio');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setError('');
    setFormErrors([]);
    setSuccess(false);
  };

  return (
    <>
      <SEOHead 
        title="Candidatura Audiovisual - CERRADØ INTERBOX 2025"
        description="Candidate-se para fazer parte da equipe audiovisual do CERRADØ INTERBOX 2025. Eternize a intensidade do maior evento de times da América Latina."
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
            {/* Header do formulário */}
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
                  width: 'auto' 
                }}
              />
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 tracking-tight glitch-text">
                Formulário de Candidatura
              </h2>
              <p className="text-gray-600 mb-2">
                Preencha seus dados para participar do time audiovisual da CERRADØ 𝗜𝗡𝗧𝗘𝗥𝗕𝗢𝗫.
              </p>
            </div>

            {/* Card do formulário */}
            <div className="bg-gray-50 border border-pink-300 rounded-2xl shadow-[0_8px_32px_0_rgba(236,72,153,0.25)] p-8 text-left relative grunge-card">
              {success ? (
                <div className="text-center py-8">
                  <div className="text-green-600 text-6xl mb-4">✓</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Candidatura Enviada!
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Sua candidatura foi recebida com sucesso. Entraremos em contato em breve.
                  </p>
                  <p className="text-sm text-gray-500">
                    Esta janela será fechada automaticamente...
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Mensagens de erro */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-800 text-sm">{error}</p>
                    </div>
                  )}
                  
                  {formErrors.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h4 className="text-red-800 font-semibold mb-2">Erros no formulário:</h4>
                      <ul className="text-red-700 text-sm space-y-1">
                        {formErrors.map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Dados pessoais */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                      Dados Pessoais
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                          Nome Completo *
                        </label>
                        <input
                          type="text"
                          id="nome"
                          name="nome"
                          value={formData.nome}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          placeholder="Seu nome completo"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          placeholder="seu@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">
                          Telefone *
                        </label>
                        <input
                          type="tel"
                          id="telefone"
                          name="telefone"
                          value={formData.telefone}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          placeholder="(11) 99999-9999"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="cidade" className="block text-sm font-medium text-gray-700 mb-1">
                          Cidade *
                        </label>
                        <input
                          type="text"
                          id="cidade"
                          name="cidade"
                          value={formData.cidade}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          placeholder="Sua cidade"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
                          Estado *
                        </label>
                        <select
                          id="estado"
                          name="estado"
                          value={formData.estado}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        >
                          <option value="">Selecione...</option>
                          {ESTADOS_BRASIL.map(estado => (
                            <option key={estado} value={estado}>{estado}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Área de atuação */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                      Área de Atuação
                    </h3>
                    
                    <div>
                      <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-1">
                        Área de Atuação *
                      </label>
                      <select
                        id="tipo"
                        name="tipo"
                        value={formData.tipo}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      >
                        {AREA_ATUACAO_OPTIONS.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label} - {option.description}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Experiência e portfólio */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                      Experiência e Portfólio
                    </h3>
                    
                    <div>
                      <label htmlFor="experiencia" className="block text-sm font-medium text-gray-700 mb-1">
                        Experiência Profissional *
                      </label>
                      <textarea
                        id="experiencia"
                        name="experiencia"
                        value={formData.experiencia}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="Descreva sua experiência na área..."
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="portfolio" className="block text-sm font-medium text-gray-700 mb-1">
                        Links do Portfólio * (um por linha)
                      </label>
                      <textarea
                        id="portfolio"
                        name="portfolio"
                        value={formData.portfolio}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="https://instagram.com/seuperfil&#10;https://behance.net/seuperfil&#10;https://vimeo.com/seuperfil"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="equipamentos" className="block text-sm font-medium text-gray-700 mb-1">
                        Equipamentos * (um por linha)
                      </label>
                      <textarea
                        id="equipamentos"
                        name="equipamentos"
                        value={formData.equipamentos}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="Canon EOS R5&#10;DJI Mavic 3 Pro&#10;Rode NTG5"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="especialidades" className="block text-sm font-medium text-gray-700 mb-1">
                        Especialidades * (uma por linha)
                      </label>
                      <textarea
                        id="especialidades"
                        name="especialidades"
                        value={formData.especialidades}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="Fotografia esportiva&#10;Retratos&#10;Eventos corporativos"
                      />
                    </div>
                  </div>

                  {/* Disponibilidade e motivação */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                      Disponibilidade e Motivação
                    </h3>
                    
                    <div>
                      <label htmlFor="disponibilidade" className="block text-sm font-medium text-gray-700 mb-1">
                        Disponibilidade para o Evento *
                      </label>
                      <textarea
                        id="disponibilidade"
                        name="disponibilidade"
                        value={formData.disponibilidade}
                        onChange={handleChange}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="Descreva sua disponibilidade para o evento..."
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="motivacao" className="block text-sm font-medium text-gray-700 mb-1">
                        Por que você quer participar? *
                      </label>
                      <textarea
                        id="motivacao"
                        name="motivacao"
                        value={formData.motivacao}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="Conte-nos sua motivação para participar do time audiovisual..."
                      />
                    </div>
                  </div>

                  {/* Termos e condições */}
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="termosAceitos"
                        name="termosAceitos"
                        checked={formData.termosAceitos}
                        onChange={handleChange}
                        className="mt-1 h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                      />
                      <label htmlFor="termosAceitos" className="ml-2 block text-sm text-gray-700">
                        Aceito os termos e condições da candidatura audiovisual *
                      </label>
                    </div>
                  </div>

                  {/* Botões */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-pink-700 focus:ring-4 focus:ring-pink-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {loading ? 'Enviando...' : 'Enviar Candidatura'}
                    </button>
                    
                    <button
                      type="button"
                      onClick={handleReset}
                      disabled={loading}
                      className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 focus:ring-4 focus:ring-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      Limpar Formulário
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </main>
        
        <Footer />
        
        <style>{`
          .glitch-text {
            position: relative;
            color: #111;
            letter-spacing: 0.04em;
          }
          .glitch-text:after {
            content: attr(data-text);
            position: absolute;
            left: 2px;
            top: 2px;
            color: #ec4899;
            opacity: 0.4;
            z-index: -1;
            filter: blur(1px);
          }
          .grunge-card {
            border-radius: 1.25rem 2.5rem 1.5rem 2.25rem/2rem 1.25rem 2.5rem 1.5rem;
            border-width: 2.5px;
          }
          .logo-grunge {
            transition: transform 0.3s;
          }
          @media (min-width: 768px) {
            .logo-grunge {
              transform: translateX(26%);
            }
          }
        `}</style>
      </div>
    </>
  );
} 