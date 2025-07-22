import { useState } from 'react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';
import LoadingSpinner from './LoadingSpinner';

interface CNHUploadProps {
  userId: string;
  onComplete: () => void;
}

export default function CNHUpload({ userId, onComplete }: CNHUploadProps) {
  const [frenteFile, setFrenteFile] = useState<File | null>(null);
  const [versoFile, setVersoFile] = useState<File | null>(null);
  const [frentePreview, setFrentePreview] = useState<string>('');
  const [versoPreview, setVersoPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (file: File | null, type: 'frente' | 'verso') => {
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione apenas arquivos de imagem (JPG, PNG)');
      return;
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Arquivo muito grande. Máximo 5MB permitido.');
      return;
    }

    // Criar preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (type === 'frente') {
        setFrentePreview(result);
        setFrenteFile(file);
      } else {
        setVersoPreview(result);
        setVersoFile(file);
      }
    };
    reader.readAsDataURL(file);
    setError('');
  };

  const handleSubmit = async () => {
    if (!frenteFile || !versoFile) {
      setError('Por favor, selecione ambas as imagens (frente e verso)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Upload das imagens para Firebase Storage
      const frenteRef = ref(storage, `cnh/${userId}/frente_${Date.now()}`);
      const versoRef = ref(storage, `cnh/${userId}/verso_${Date.now()}`);

      const [frenteSnapshot, versoSnapshot] = await Promise.all([
        uploadBytes(frenteRef, frenteFile),
        uploadBytes(versoRef, versoFile),
      ]);

      const [frenteUrl, versoUrl] = await Promise.all([
        getDownloadURL(frenteSnapshot.ref),
        getDownloadURL(versoSnapshot.ref),
      ]);

      // Salvar URLs no Firestore
      await updateDoc(doc(db, 'users', userId), {
        'adminVerification.cnh': {
          frente: frenteUrl,
          verso: versoUrl,
          uploadedAt: serverTimestamp(),
          status: 'pending',
        },
        'adminVerification.required': false,
        'adminVerification.completedAt': serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      console.log('✅ CNH enviada com sucesso');
      onComplete();
    } catch (error) {
      console.error('❌ Erro ao enviar CNH:', error);
      setError('Erro ao enviar arquivos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Verificação de Identidade
          </h1>
          <p className="text-gray-600">
            Para completar seu acesso administrativo, envie fotos da sua CNH
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Frente da CNH */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Frente da CNH</h3>

            {frentePreview ? (
              <div className="relative">
                <img
                  src={frentePreview}
                  alt="Frente da CNH"
                  className="w-full h-48 object-cover rounded-lg border-2 border-green-300"
                />
                <button
                  onClick={() => {
                    setFrenteFile(null);
                    setFrentePreview('');
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-pink-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e.target.files?.[0] || null, 'frente')}
                  className="hidden"
                  id="frente-input"
                />
                <label htmlFor="frente-input" className="cursor-pointer">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-gray-600">Clique para selecionar</p>
                  <p className="text-sm text-gray-500">JPG, PNG - Máx 5MB</p>
                </label>
              </div>
            )}
          </div>

          {/* Verso da CNH */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Verso da CNH</h3>

            {versoPreview ? (
              <div className="relative">
                <img
                  src={versoPreview}
                  alt="Verso da CNH"
                  className="w-full h-48 object-cover rounded-lg border-2 border-green-300"
                />
                <button
                  onClick={() => {
                    setVersoFile(null);
                    setVersoPreview('');
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-pink-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e.target.files?.[0] || null, 'verso')}
                  className="hidden"
                  id="verso-input"
                />
                <label htmlFor="verso-input" className="cursor-pointer">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-gray-600">Clique para selecionar</p>
                  <p className="text-sm text-gray-500">JPG, PNG - Máx 5MB</p>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Informações importantes */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-blue-900 mb-2">⚠️ Informações Importantes:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Suas imagens são armazenadas com segurança</li>
            <li>• Apenas administradores autorizados têm acesso</li>
            <li>• As imagens são usadas apenas para verificação de identidade</li>
            <li>• Você pode solicitar a remoção dos dados a qualquer momento</li>
          </ul>
        </div>

        {/* Botão de envio */}
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={loading || !frenteFile || !versoFile}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" />
                Enviando...
              </>
            ) : (
              'Enviar Verificação'
            )}
          </button>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            CERRADO INTERBØX 2025 - Verificação de Identidade
          </p>
        </div>
      </div>
    </div>
  );
}
