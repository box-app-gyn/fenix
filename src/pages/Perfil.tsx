import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { FirestoreUser } from '../types/firestore';
import { useTransitionNavigate } from '../hooks/useTransitionNavigate';
import imageCompression from 'browser-image-compression';
import Header from '../components/Header';
import Footer from '../components/Footer';
import UserGamificationCards from '../components/UserGamificationCards';

const CATEGORIAS = [
  { value: 'atleta', label: 'Atleta', icon: '🏃‍♂️' },
  { value: 'jurado', label: 'Jurado', icon: '⚖️' },
  { value: 'midia', label: 'Mídia', icon: '📺' },
  { value: 'espectador', label: 'Espectador', icon: '👀' },
  { value: 'publico', label: 'Público Geral', icon: '👥' }
];

// Componente Toast para notificações
const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 flex items-center p-4 rounded-lg shadow-lg backdrop-blur-sm border transition-all duration-300 ${
      type === 'success'
        ? 'bg-emerald-500/90 border-emerald-400 text-white'
        : 'bg-red-500/90 border-red-400 text-white'
    }`}>
      <div className="flex items-center">
        {type === 'success' ? (
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18l8.586-8.586a2 2 0 012.828 0L20 14" />
          </svg>
        )}
        <span className="text-sm font-medium">{message}</span>
      </div>
      <button onClick={onClose} className="ml-4 hover:bg-white/20 rounded-full p-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  );
};

// Componente Avatar com upload
const ProfileAvatar = ({ 
  userData, 
  photoPreview, 
  photoLoading, 
  onPhotoChange 
}: {
  userData: FirestoreUser | null;
  photoPreview: string | null;
  photoLoading: boolean;
  onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // eslint-disable-line no-unused-vars
}) => {
  const avatarContent = () => {
    if (photoLoading) {
      return (
        <div className="w-full h-full rounded-full bg-white/20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-white border-t-transparent"></div>
        </div>
      );
    }
    
    if (photoPreview) {
      return (
        <img
          src={photoPreview}
          alt="Preview da foto"
          className="w-full h-full rounded-full object-cover"
        />
      );
    }
    
    if (userData?.photoURL) {
      return (
        <img
          src={userData.photoURL}
          alt={userData.displayName || 'Usuário'}
          className="w-full h-full rounded-full object-cover"
        />
      );
    }
    
    return (
      <div className="w-full h-full rounded-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center">
        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7" />
        </svg>
      </div>
    );
  };

  return (
    <div className="relative group">
      <div className="w-32 h-32 mx-auto relative">
        <div className="w-full h-full bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-full p-1 shadow-2xl">
          {avatarContent()}
        </div>
        
        {/* Overlay de hover */}
        <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 01.664.898l1.22.22A2 2 0 0110 7.43V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0" />
          </svg>
        </div>
        
        {/* Botão de upload */}
        <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-lg">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 01.664.898l1.22.22A2 2 0 0110 7.43V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0" />
          </svg>
          <input
            type="file"
            accept="image/*"
            onChange={onPhotoChange}
            className="hidden"
            disabled={photoLoading}
          />
        </label>
      </div>
      
      {/* Dicas de upload */}
      <div className="mt-4 text-center">
        <div className="text-xs text-gray-400 space-y-1">
          <p>�� Ideal: 400x40px</p>
          <p>⚖️ Máx: 5MB</p>
        </div>
      </div>
    </div>
  );
};

// Componente de Tokens
const TokensCard = ({ tokens }: { tokens: any }) => (
  <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl p-6 border border-pink-500/30">
    <div className="text-center">
      <svg className="w-8 h-8 text-pink-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0 0.895 0 2 3 .895 3 2-1.343 2-3 2-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0 10c-10.11 0-2.08-0.402-2.599-1" />
      </svg>
      <div className="text-3xl font-bold text-white mb-1">
        {tokens?.box?.balance || 0} ₿
      </div>
      <div className="text-sm text-gray-300">Saldo $BOX</div>
    </div>
  </div>
);

// Componente de campo do formulário
const FormField = ({ 
  label, 
  icon: Icon, 
  children, 
  error 
}: {
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  children: React.ReactNode;
  error?: string;
}) => (
  <div className="space-y-2">
    <label className="flex items-center text-sm font-medium text-gray-200">
      <Icon size={16} className="mr-2 text-pink-400" />
      {label}
    </label>
    {children}
    {error && <p className="text-sm text-red-400">{error}</p>}
  </div>
);

// Ícones SVG como componentes
const UserIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg className={className} width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7" />
  </svg>
);

const PhoneIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg className={className} width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498.493 1-.502.21-2.257 1.132 2.57a1 1 0 01-.21.502l4.493 10.498a1 1 0 01-.684.949V19a2 2 0 01-2 2H6a2 2 0 01-2-2v-1C9.716 21 14.284 36 14.284 36" />
  </svg>
);

const MapPinIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg className={className} width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13 20.9a10.998 10.998 0 01-2.827 0l-4.244-4.243a8.011 8.011 0 01-1.314-11.314" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0" />
  </svg>
);

const BuildingIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg className={className} width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h14-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0" />
  </svg>
);

const AwardIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg className={className} width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12 2 4M7.165 4.697 0.42.42 001946-0.806.42 30.42 0014.438 0.423.420 01.946.806.42342 00130.138 31383.42.420 000.806 1.946 3.42 30.42 0010 4438.42342 000-0.806 1946342 3.42 001-30.138 3138342.420 00-1.946806342 3.42 0 1-4.438 0342342 000-1946-.806342 3.42 001-30.138-3138.42342 000-0.806-1.946 3.42 30.42 0010-44383.42.420 000.806-1.946.42342013.1383138" />
  </svg>
);

const EditIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg className={className} width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2V9a2 2 0 00-2-2h-5m-1.414.414 2 2L19 9" />
  </svg>
);

const SaveIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg className={className} width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 0 3 0" />
  </svg>
);

export default function Perfil() {
  const { user } = useAuth();
  const navigate = useTransitionNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState<FirestoreUser | null>(null);
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    telefone: '',
    box: '',
    categoria: 'atleta' as const,
    cidade: '',
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string | undefined>>({});

  // Redirecionar se não estiver logado
  useEffect(() => {
    if (!user && !loading) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  // Carregar dados do usuário
  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.uid) return;

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data() as FirestoreUser;
          setUserData(data);
          setFormData({
            displayName: data.displayName || '',
            email: data.email || '',
            telefone: data.telefone || '',
            box: data.box || '',
            categoria: data.role === 'atleta' ? 'atleta' : 'publico' as any,
            cidade: data.cidade || '',
          });
          if (data.photoURL) {
            // setPhotoPreview(data.photoURL); // This line is removed
          }
          // Carregar visibilidade se existir
          if ((data as any).visibility) {
            // This block is removed as visibility state is removed
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        setMessage({ type: 'error', text: 'Erro ao carregar dados do perfil' });
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user?.uid]);

  // Validação do formulário
  const validateForm = useCallback(() => {
    const errors: Record<string, string> = {};
    
    if (!formData.displayName.trim()) {
      errors.displayName = 'Nome é obrigatório';
    }
    
    if (formData.telefone && !/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(formData.telefone)) {
      errors.telefone = 'Formato inválido. Use: (11) 999999999';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  // Formatação do telefone
  const formatPhone = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length <= 11) {
      return cleanValue
        .replace(/^(\d{2})(\d{4,5})(\d{4})$/, '($1) $2-$3')
        .replace(/^(\d{2})(\d{4,5})$/, '($1) $2')
        .replace(/^(\d{2})$/, '($1');
    }
    return value;
  };

  // Handle file selection
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Arquivo muito grande. Máximo 5MB.' });
      return;
    }

    setPhotoLoading(true);
    setMessage(null);

    try {
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 400, // Tamanho ideal para 1:1
        useWebWorker: true,
      });

      setPhotoFile(compressedFile);

      const reader = new FileReader();
      reader.onload = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(compressedFile);

      setMessage({ type: 'success', text: 'Foto selecionada! Clique em "Salvar Alterações" para aplicar.' });
    } catch (_err) {
      setMessage({ type: 'error', text: 'Erro ao processar imagem.' });
    } finally {
      setPhotoLoading(false);
    }
  };

  // Handle form changes
  const handleInputChange = (_e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = _e.target;
    
    let formattedValue = value;
    if (name === 'telefone') {
      formattedValue = formatPhone(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: formattedValue,
    }));
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // Save changes
  const handleSave = async () => {
    if (!validateForm()) return;
    if (!user?.uid) return;

    setSaving(true);
    setMessage(null);

    try {
      let photoURL = userData?.photoURL;

      if (photoFile) {
        const photoRef = ref(storage, `users/${user.uid}/profile-photo`);
        await uploadBytes(photoRef, photoFile);
        photoURL = await getDownloadURL(photoRef);
      }

      const updateData: Partial<FirestoreUser> = {
        displayName: formData.displayName,
        telefone: formData.telefone,
        box: formData.box,
        role: formData.categoria,
        cidade: formData.cidade,
        photoURL,
        updatedAt: serverTimestamp() as any,
      };

      await updateDoc(doc(db, 'users', user.uid), updateData);

      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
      setPhotoFile(null);
      setPhotoPreview(null);

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data() as FirestoreUser);
      }
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      setMessage({ type: 'error', text: 'Erro ao salvar alterações' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const selectedCategory = CATEGORIAS.find(cat => cat.value === formData.categoria);

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header />

      {/* Toast Messages */}
      {message && (
        <Toast
          message={message.text}
          type={message.type}
          onClose={() => setMessage(null)}
        />
      )}

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
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/80"></div>

        {/* Conteúdo principal */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
          {/* Header da página */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-2">Meu Perfil</h1>
            <p className="text-gray-300 text-lg">Gerencie suas informações pessoais</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar - Informações do usuário */}
            <div className="lg:col-span-1">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="text-center space-y-6">
                  <ProfileAvatar
                    userData={userData}
                    photoPreview={photoPreview}
                    photoLoading={photoLoading}
                    onPhotoChange={handlePhotoChange}
                  />

                  <div>
                    <h2 className="text-2xl font-semibold text-white mb-1">
                      {userData?.displayName || 'Usuário'}
                    </h2>
                    <p className="text-gray-300 text-sm mb-3">{userData?.email}</p>
                    
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30">
                      <span className="text-xl mr-2">{selectedCategory?.icon}</span>
                      <span className="text-sm font-medium text-white">
                        {selectedCategory?.label}
                      </span>
                    </div>
                  </div>

                  {/* Tokens $BOX */}
                  {userData?.gamification?.tokens?.box && (
                    <TokensCard tokens={userData.gamification.tokens} />
                  )}

                  {/* Cards de Gamificação */}
                  <UserGamificationCards />

                  {/* Informações adicionais */}
                  <div className="space-y-3 pt-6 border-t border-white/20">
                    {userData?.box && (
                      <div className="flex items-center text-gray-300">
                        <BuildingIcon size={16} className="mr-2 text-pink-400" />
                        <span className="text-sm">{userData.box}</span>
                      </div>
                    )}
                    {userData?.cidade && (
                      <div className="flex items-center text-gray-300">
                        <MapPinIcon size={16} className="mr-2 text-pink-400" />
                        <span className="text-sm">{userData.cidade}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Formulário */}
            <div className="lg:col-span-2">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="flex items-center mb-8">
                  <EditIcon size={24} className="text-pink-400 mr-3" />
                  <h3 className="text-2xl font-semibold text-white">Editar Informações</h3>
                </div>

                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Nome Completo" icon={UserIcon} error={formErrors.displayName}>
                      <input
                        type="text"
                        name="displayName"
                        value={formData.displayName}
                        onChange={handleInputChange}
                        className="w-full px-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                        placeholder="Digite seu nome completo"
                      />
                    </FormField>

                    <FormField label="Email" icon={UserIcon}>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        disabled
                        className="w-full px-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-gray-400 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-400 mt-1">Email não pode ser alterado</p>
                    </FormField>

                    <FormField label="Telefone" icon={PhoneIcon} error={formErrors.telefone}>
                      <input
                        type="tel"
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleInputChange}
                        className="w-full px-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                        placeholder="(11) 99999-9999"
                      />
                    </FormField>

                    <FormField label="Box/Academia" icon={BuildingIcon}>
                      <input
                        type="text"
                        name="box"
                        value={formData.box}
                        onChange={handleInputChange}
                        className="w-full px-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                        placeholder="Nome do seu box ou academia"
                      />
                    </FormField>

                    <FormField label="Categoria" icon={AwardIcon}>
                      <select
                        name="categoria"
                        value={formData.categoria}
                        onChange={handleInputChange}
                        className="w-full px-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                      >
                        {CATEGORIAS.map(cat => (
                          <option key={cat.value} value={cat.value} className="bg-gray-800">
                            {cat.icon} {cat.label}
                          </option>
                        ))}
                      </select>
                    </FormField>

                    <FormField label="Cidade" icon={MapPinIcon}>
                      <input
                        type="text"
                        name="cidade"
                        value={formData.cidade}
                        onChange={handleInputChange}
                        className="w-full px-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                        placeholder="Sua cidade"
                      />
                    </FormField>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-8">
                    <button
                      type="button"
                      onClick={() => navigate('/home')}
                      className="flex-1 py-3 border border-white/20 rounded-xl text-white hover:bg-white/10 transition-all duration-300 font-medium backdrop-blur-sm"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl text-white hover:from-pink-600 hover:to-purple-600 disabled:from-gray-600 disabled:to-gray-700 transition-all duration-300 font-medium flex items-center justify-center"
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                          Salvando...
                        </>
                      ) : (
                        <>
                          <SaveIcon size={16} className="mr-2" />
                          Salvar Alterações
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
