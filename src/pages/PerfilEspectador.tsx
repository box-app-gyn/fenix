import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { FirestoreUser } from '../types/firestore';
import { useNavigate } from 'react-router-dom';
import imageCompression from 'browser-image-compression';

const USER_TYPE = { color: '#6B7280', icon: '👥', label: 'Espectador' };

export default function PerfilEspectador() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState<FirestoreUser | null>(null);
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    telefone: '',
    cidade: ''
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    if (!user && !loading) navigate('/login');
  }, [user, loading, navigate]);

  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.uid) return;
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data() as FirestoreUser;
          if (data.role !== 'espectador') {
            setAccessDenied(true);
            setLoading(false);
            return;
          }
          setUserData(data);
          setFormData({
            displayName: data.displayName || '',
            email: data.email || '',
            telefone: data.telefone || '',
            cidade: data.cidade || ''
          });
          if (data.photoURL) setPhotoPreview(data.photoURL);
        } else {
          setAccessDenied(true);
        }
      } catch (error) {
        setAccessDenied(true);
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, [user?.uid]);

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
        reader.onload = (e) => setPhotoPreview(e.target?.result as string);
        reader.readAsDataURL(compressedFile);
      } catch (err) {
        setMessage({ type: 'error', text: 'Erro ao comprimir imagem.' });
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

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
        cidade: formData.cidade,
        photoURL,
        updatedAt: serverTimestamp() as any
      };
      await updateDoc(doc(db, 'users', user.uid), updateData);
      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
      setPhotoFile(null);
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) setUserData(userDoc.data() as FirestoreUser);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao salvar alterações' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Carregando perfil...</p>
      </div>
    </div>
  );
  if (accessDenied) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-5xl mb-4">{USER_TYPE.icon}</div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: USER_TYPE.color }}>Acesso Negado</h1>
        <p className="text-gray-600">Você não tem permissão para acessar esta página.</p>
      </div>
    </div>
  );
  if (!user) return null;
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-4">
          <span className="text-3xl" style={{ color: USER_TYPE.color }}>{USER_TYPE.icon}</span>
          <h1 className="text-3xl font-bold text-gray-900">Perfil {USER_TYPE.label}</h1>
        </div>
        {message && (
          <div className={`mb-6 p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>{message.text}</div>
        )}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-8">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mb-4">
                {photoPreview ? (
                  <img src={photoPreview} alt="Foto de perfil" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl text-gray-400">{USER_TYPE.icon}</div>
                )}
              </div>
              <label className="mt-2 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                <input type="file" accept="image/*" onChange={handlePhotoChange} className="sr-only" />
                {photoFile ? 'Foto selecionada' : 'Alterar foto'}
              </label>
              {photoFile && (
                <p className="mt-2 text-sm text-gray-500">{photoFile.name} ({(photoFile.size / 1024 / 1024).toFixed(2)} MB)</p>
              )}
            </div>
            <form className="space-y-6 mt-8">
              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">Nome completo</label>
                <input type="text" id="displayName" name="displayName" value={formData.displayName} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:text-sm" placeholder="Seu nome completo" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" id="email" name="email" value={formData.email} disabled className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 sm:text-sm" />
                <p className="mt-1 text-xs text-gray-500">Email não pode ser alterado</p>
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telefone</label>
                <input type="tel" id="phone" name="phone" value={formData.telefone} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:text-sm" placeholder="(11) 99999-9999" />
              </div>
              <div>
                <label htmlFor="cidade" className="block text-sm font-medium text-gray-700">Cidade</label>
                <input type="text" id="cidade" name="cidade" value={formData.cidade} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:text-sm" placeholder="Sua cidade" />
              </div>
              <div className="flex justify-end pt-6 border-t border-gray-200">
                <button type="button" onClick={handleSave} disabled={saving} className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white" style={{ background: USER_TYPE.color }}>
                  {saving ? (<><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>Salvando...</>) : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 