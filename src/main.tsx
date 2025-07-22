import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

// --- Função para aguardar estilos carregarem ---
const waitForStylesheets = (): Promise<void> => {
  return new Promise((resolve) => {
    let attempts = 0
    const maxAttempts = 200

    const check = () => {
      attempts++
      const allLoaded = Array.from(document.styleSheets).every((sheet) => {
        try {
          return sheet.cssRules.length > 0 || sheet.href === null
        } catch {
          return false
        }
      })
      allLoaded || attempts >= maxAttempts ? resolve() : setTimeout(check, 50)
    }

    document.readyState === 'loading'
      ? document.addEventListener('DOMContentLoaded', check)
      : check()
  })
}

// --- Remover loading visual ---
const removeLoadingFallback = () => {
  const el = document.getElementById('loading-fallback')
  if (el) {
    el.style.opacity = '0'
    setTimeout(() => (el.style.display = 'none'), 300)
  }
}

// --- Inicializar aplicação ---
const boot = async () => {
  console.log('🚀 Iniciando Interbox...')
  await Promise.race([waitForStylesheets(), new Promise(res => setTimeout(res, 5000))])
  removeLoadingFallback()

  // Tentar registrar Service Worker com fallback silencioso
  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none',
      })
      console.log('🔒 Service Worker ativo:', reg)
      reg.update()
    } catch (err) {
      console.warn('❌ Falha ao registrar Service Worker:', err)
    }
  }

  // Renderização protegida
  const root = document.getElementById('root')
  if (root) {
    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>
    )
    console.log('✅ App montado com sucesso')
  } else {
    console.error('🚨 #root não encontrado no HTML')
  }
}

boot()
