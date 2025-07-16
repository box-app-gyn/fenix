import { useState } from 'react';
import { motion } from 'framer-motion';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import confetti from 'canvas-confetti';
import imageCompression from 'browser-image-compression';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function SetupProfile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    email: user?.email || '',
    telefone: '',
    whatsapp: '',
    box: '',
    categoria: 'publico',
    cidade: '',
    mensagem: ''
  });

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Arquivo muito grande. Máximo 5MB.');
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
          setPhotoPreview(reader.result as string);
        };
        reader.readAsDataURL(compressedFile);
      } catch (err) {
        alert('Erro ao comprimir imagem.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      let photoURL = null;
      let tokensEarned = 50; // Base: +50 $BOX por completar perfil
      let achievements = ['setup_profile_completo'];

      // Upload da foto se selecionada
      if (photoFile) {
        const photoRef = ref(storage, `users/${user.uid}/profile-photo`);
        await uploadBytes(photoRef, photoFile);
        photoURL = await getDownloadURL(photoRef);
        tokensEarned += 10; // +10 $BOX por foto
        achievements.push('foto_perfil');
      }

      // Verificar se já existe gamificação
      const existingDoc = await getDoc(doc(db, 'users', user.uid));
      const existingData = existingDoc.data();
      const existingGamification = existingData?.gamification;

      await setDoc(doc(db, 'users', user.uid), {
        ...formData,
        uid: user.uid,
        displayName: formData.nome,
        email: formData.email,
        role: formData.categoria,
        photoURL,
        isActive: true,
        profileComplete: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        // Gamificação
        gamification: {
          tokens: {
            box: {
              balance: (existingGamification?.tokens?.box?.balance || 0) + tokensEarned,
              totalEarned: (existingGamification?.tokens?.box?.totalEarned || 0) + tokensEarned,
              totalSpent: existingGamification?.tokens?.box?.totalSpent || 0,
              lastTransaction: serverTimestamp()
            }
          },
          level: existingGamification?.level || 'iniciante',
          totalActions: (existingGamification?.totalActions || 0) + 1,
          lastActionAt: serverTimestamp(),
          achievements: [...(existingGamification?.achievements || []), ...achievements],
          rewards: existingGamification?.rewards || [],
          streakDays: existingGamification?.streakDays || 1,
          lastLoginStreak: existingGamification?.lastLoginStreak || serverTimestamp(),
          referralCode: existingGamification?.referralCode || `REF${user.uid.slice(-6).toUpperCase()}`,
          referrals: existingGamification?.referrals || [],
          referralTokens: existingGamification?.referralTokens || 0,
          weeklyTokens: (existingGamification?.weeklyTokens || 0) + tokensEarned,
          monthlyTokens: (existingGamification?.monthlyTokens || 0) + tokensEarned,
          yearlyTokens: (existingGamification?.yearlyTokens || 0) + tokensEarned,
          bestStreak: existingGamification?.bestStreak || 1,
          badges: [...(existingGamification?.badges || []), ...achievements],
          challenges: existingGamification?.challenges || []
        }
      });

      // Trigger confetti - Entrada oficial no webapp!
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#fb05e4', '#00259f', '#10B981', '#F59E0B', '#FF6B6B', '#4ECDC4'],
        shapes: ['circle', 'square'],
        ticks: 200
      });

      // Segunda explosão após 500ms
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.4, x: 0.3 },
          colors: ['#fb05e4', '#00259f', '#10B981', '#F59E0B'],
          shapes: ['circle'],
          ticks: 150
        });
      }, 500);

      // Terceira explosão após 1s
      setTimeout(() => {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.5, x: 0.7 },
          colors: ['#fb05e4', '#00259f', '#FF6B6B', '#4ECDC4'],
          shapes: ['square'],
          ticks: 120
        });
      }, 1000);

      // Show success message with gamification
      setTimeout(() => {
        const photoMessage = photoFile ? '\n📸 Foto de perfil: +10 ₿' : '';
        alert(`🎉 BEM-VINDO AO INTERBOX 2025! 
        
🏆 Conquistas:
✅ Perfil completo: +50 ₿${photoMessage}

💰 Total ganho: +${tokensEarned} ₿
🎯 Nível: Iniciante
📈 Streak: 1 dia

🚀 Sua jornada no ecossistema Interbox começou!
Acesse o Hub para explorar todas as funcionalidades.`);
        window.location.href = '/home';
      }, 2000);

    } catch (error) {
      console.error('Erro ao configurar perfil:', error);
      alert('Erro ao configurar perfil. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/80"></div>
        
        {/* Conteúdo principal */}
        <div className="relative z-10 flex-1 flex items-center justify-center py-20 px-4">
          <div className="max-w-2xl w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-white/20"
            >
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">⚙️ Configurar Perfil</h1>
                <p className="text-gray-600">Complete seu perfil para acessar o Interbox 2025</p>
                <div className="mt-4 p-4 bg-gradient-to-r from-pink-100 to-blue-100 rounded-lg border border-pink-200">
                  <p className="text-sm text-gray-700">
                    🎁 <strong>Ganhe tokens ₿:</strong><br/>
                    +50 ₿ por completar o perfil<br/>
                    +10 ₿ por adicionar foto
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Upload de Foto */}
                <div className="text-center">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    📸 Foto de Perfil (Opcional)
                  </label>
                  <div className="relative inline-block">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 mx-auto border-4 border-gray-300 shadow-lg">
                      {photoPreview ? (
                        <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    <label className="mt-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="sr-only"
                      />
                      {photoFile ? '📸 Foto selecionada' : '📷 Adicionar foto'}
                    </label>
                  </div>
                  
                  {photoFile && (
                    <p className="mt-2 text-sm" style={{ color: 'rgb(251, 5, 228)' }}>
                      ✅ +10 ₿ garantidos pela foto!
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      WhatsApp
                    </label>
                    <input
                      type="tel"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
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
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cidade *
                    </label>
                    <input
                      type="text"
                      name="cidade"
                      value={formData.cidade}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria *
                  </label>
                  <select
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                  >
                    <option value="publico">Público Geral</option>
                    <option value="atleta">Atleta</option>
                    <option value="jurado">Jurado</option>
                    <option value="midia">Mídia</option>
                    <option value="espectador">Espectador</option>
                    <option value="patrocinador">Patrocinador</option>
                    <option value="apoio">Apoio</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensagem/Motivação
                  </label>
                  <textarea
                    name="mensagem"
                    value={formData.mensagem}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                    placeholder="Conte um pouco sobre sua motivação para participar do evento..."
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-gradient-to-r from-pink-600 to-blue-600 text-white rounded-md hover:from-pink-700 hover:to-blue-700 disabled:bg-gray-400 transition-all duration-300 font-medium"
                  >
                    {loading ? 'Configurando...' : 'Configurar Perfil'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
} 