import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { FirestoreUser } from '../types/firestore';
import { useNavigate } from 'react-router-dom';
import imageCompression from 'browser-image-compression';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Mock de visibilidade (em produção, virá do Firestore)
// Removido pois não está sendo utilizado no novo layout

export default function Perfil() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState<FirestoreUser | null>(null);
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    telefone: '',
    box: '',
    categoria: 'atleta' as const,
    cidade: ''
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
            cidade: data.cidade || ''
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

  // Handle file selection
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Arquivo muito grande. Máximo 5MB.' });
        return;
      }
      try {
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 800,
          useWebWorker: true,
        });
        setPhotoFile(compressedFile);
        const reader = new FileReader();
        reader.onload = () => {
          // setPhotoPreview(e.target?.result as string); // This line is removed
        };
        reader.readAsDataURL(compressedFile);
      } catch (err) {
        setMessage({ type: 'error', text: 'Erro ao comprimir imagem.' });
      }
    }
  };

  // Handle form changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Save changes
  const handleSave = async () => {
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
        updatedAt: serverTimestamp() as any
      };

      await updateDoc(doc(db, 'users', user.uid), updateData);

      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
      setPhotoFile(null);
      
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-white">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

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
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Overlay gradiente */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60"></div>
        
        {/* Conteúdo principal */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Meu Perfil</h1>
            <p className="mt-2 text-gray-300">Gerencie suas informações pessoais</p>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-md ${
              message.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {message.text}
            </div>
          )}

          <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-lg border border-white/20">
            <div className="px-6 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <div className="text-center">
                    <div className="relative inline-block">
                      <div className="w-32 h-32 bg-gradient-to-r from-pink-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                        {userData?.photoURL ? (
                          <img 
                            src={userData.photoURL} 
                            alt={userData.displayName || 'Usuário'} 
                            className="w-28 h-28 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-4xl text-white">
                            {userData?.displayName?.charAt(0) || 'U'}
                          </span>
                        )}
                      </div>
                      
                      <label className="mt-4 inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-600 to-blue-600 text-white text-sm font-medium rounded-md hover:from-pink-700 hover:to-blue-700 transition-all duration-300 cursor-pointer">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Alterar Foto
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoChange}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Informações do usuário */}
                    <div className="mt-6 text-center">
                      <h2 className="text-xl font-semibold text-gray-800">
                        {userData?.displayName || 'Usuário'}
                      </h2>
                      <p className="text-gray-600">{userData?.email}</p>
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {userData?.role || 'Usuário'}
                        </span>
                      </div>
                    </div>

                    {/* Tokens $BOX */}
                    {userData?.gamification?.tokens?.box && (
                      <div className="mt-6 p-4 bg-gradient-to-r from-pink-500/10 to-blue-500/10 rounded-lg border border-pink-200/20">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-pink-600">
                            {userData.gamification.tokens.box.balance} ₿
                          </div>
                          <div className="text-sm text-gray-600">Saldo $BOX</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nome Completo
                        </label>
                        <input
                          type="text"
                          name="displayName"
                          value={formData.displayName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Email não pode ser alterado</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Telefone
                        </label>
                        <input
                          type="tel"
                          name="telefone"
                          value={formData.telefone}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Box/Academia
                        </label>
                        <input
                          type="text"
                          name="box"
                          value={formData.box}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Categoria
                        </label>
                        <select
                          name="categoria"
                          value={formData.categoria}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                        >
                          <option value="atleta">Atleta</option>
                          <option value="jurado">Jurado</option>
                          <option value="midia">Mídia</option>
                          <option value="espectador">Espectador</option>
                          <option value="publico">Público Geral</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cidade
                        </label>
                        <input
                          type="text"
                          name="cidade"
                          value={formData.cidade}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={() => navigate('/hub')}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-2 bg-gradient-to-r from-pink-600 to-blue-600 text-white rounded-md hover:from-pink-700 hover:to-blue-700 disabled:bg-gray-400 transition-all duration-300 font-medium"
                      >
                        {saving ? 'Salvando...' : 'Salvar Alterações'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
} 