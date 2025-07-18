import { useState, useEffect } from 'react'
import { forceWebPImageReload, checkWebPSupport, testAllWebPImages, clearCacheAndReload } from '../utils/forceImageReload'

const imageList = [
  '/images/bg_main.webp',
  '/images/pngtree-light-gray-old-paper.webp',
  '/logos/oficial_logo.webp',
  '/logos/nome_hrz.webp',
  '/images/bg_rounded.webp',
  '/images/twolines.webp'
]

export default function ImageDebugger() {
  const [webpSupport, setWebpSupport] = useState<boolean | null>(null)
  const [imageStatus, setImageStatus] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showDebugger, setShowDebugger] = useState(false)

  useEffect(() => {
    setWebpSupport(checkWebPSupport())
    testImages()
  }, [])

  const testImages = async () => {
    setIsLoading(true)
    const results = await testAllWebPImages()
    setImageStatus(results)
    setIsLoading(false)
  }

  const handleForceReload = () => {
    forceWebPImageReload()
    setTimeout(testImages, 1000)
  }

  const handleClearCache = () => {
    clearCacheAndReload()
  }

  if (!showDebugger) {
    return (
      <button
        onClick={() => setShowDebugger(true)}
        className="fixed bottom-4 right-4 bg-red-500 text-white p-2 rounded-full z-50"
        title="Debug Imagens WebP"
      >
        🐛
      </button>
    )
  }

  return (
    <div className="fixed inset-4 bg-black/90 text-white p-6 rounded-lg z-50 overflow-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">🔍 Debug de Imagens WebP</h2>
        <button
          onClick={() => setShowDebugger(false)}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          ✕ Fechar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status do Navegador */}
        <div className="bg-gray-800 p-4 rounded">
          <h3 className="text-lg font-semibold mb-4">🌐 Status do Navegador</h3>
          <div className="space-y-2">
            <p>
              <strong>User Agent:</strong> {navigator.userAgent}
            </p>
            <p>
              <strong>Suporte WebP:</strong>{' '}
              {webpSupport === null ? 'Testando...' : webpSupport ? '✅ Suportado' : '❌ Não suportado'}
            </p>
            <p>
              <strong>Online:</strong> {navigator.onLine ? '✅ Online' : '❌ Offline'}
            </p>
            <p>
              <strong>Service Worker:</strong> {'serviceWorker' in navigator ? '✅ Disponível' : '❌ Não disponível'}
            </p>
          </div>
        </div>

        {/* Ações */}
        <div className="bg-gray-800 p-4 rounded">
          <h3 className="text-lg font-semibold mb-4">⚡ Ações</h3>
          <div className="space-y-2">
            <button
              onClick={handleForceReload}
              disabled={isLoading}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {isLoading ? '🔄 Testando...' : '🔄 Forçar Reload'}
            </button>
            <button
              onClick={testImages}
              disabled={isLoading}
              className="w-full bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {isLoading ? '🔄 Testando...' : '🧪 Testar Imagens'}
            </button>
            <button
              onClick={handleClearCache}
              className="w-full bg-red-500 text-white px-4 py-2 rounded"
            >
              🗑️ Limpar Cache
            </button>
          </div>
        </div>

        {/* Status das Imagens */}
        <div className="bg-gray-800 p-4 rounded md:col-span-2">
          <h3 className="text-lg font-semibold mb-4">🖼️ Status das Imagens</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {imageList.map((src: string) => (
              <div
                key={src}
                className={`p-3 rounded border ${
                  imageStatus[src] ? 'border-green-500 bg-green-900/20' : 'border-red-500 bg-red-900/20'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={src}
                    alt="Teste"
                    className="w-16 h-16 object-cover rounded"
                    onLoad={() => console.log(`✅ ${src} carregado`)}
                    onError={() => console.error(`❌ ${src} falhou`)}
                  />
                  <div>
                    <p className="font-mono text-sm">{src.split('/').pop()}</p>
                    <p className="text-xs text-gray-400">{src}</p>
                    <p className={`text-sm font-semibold ${imageStatus[src] ? 'text-green-400' : 'text-red-400'}`}>
                      {imageStatus[src] ? '✅ Carregado' : '❌ Falha'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Logs */}
        <div className="bg-gray-800 p-4 rounded md:col-span-2">
          <h3 className="text-lg font-semibold mb-4">📋 Logs</h3>
          <div className="bg-black p-3 rounded font-mono text-sm h-32 overflow-y-auto">
            <p>Console logs aparecerão aqui...</p>
            <p>Abra o DevTools (F12) para ver logs detalhados</p>
          </div>
        </div>
      </div>
    </div>
  )
} 