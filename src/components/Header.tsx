import { useState, useEffect } from 'react'
import { onAuthStateChanged, signOut, User, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { auth } from '../lib/firebase'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const { user: authUser } = useAuth()

  // Verificar se usuário tem acesso ao dashboard (apenas admin, dev, marketing)
  const hasDashboardAccess = authUser && (
    authUser.role === 'admin'
    || authUser.role === 'dev'
    || authUser.role === 'marketing'
  )

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      unsubscribe()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      window.location.href = '/'
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      setIsLoggingIn(true)
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({
        prompt: 'select_account',
        ux_mode: 'popup',
        scope: 'email profile',
      })
      
      await signInWithPopup(auth, provider)
      console.log('✅ Login com Google realizado com sucesso!')
    } catch (error) {
      console.error('❌ Erro no login com Google:', error)
    } finally {
      setIsLoggingIn(false)
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [isMenuOpen])

  if (loading) {
    return (
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-pink-500/20"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="w-32 h-8 bg-gray-700 animate-pulse rounded"></div>
            <div className="w-8 h-8 bg-gray-700 animate-pulse rounded"></div>
          </div>
        </div>
      </motion.header>
    )
  }

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
          isScrolled
            ? 'bg-black/95 backdrop-blur-lg border-b border-pink-500/30 shadow-lg'
            : 'bg-black/80 backdrop-blur-md border-b border-pink-500/20'
        }`}
      >
        <motion.div
          className="container mx-auto px-4 transition-all duration-300"
          animate={{
            paddingTop: isScrolled ? '0.5rem' : '1rem',
            paddingBottom: isScrolled ? '0.5rem' : '1rem',
          }}
        >
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center space-x-2 group">
              <motion.div
                whileHover={{
                  scale: 1.05,
                  filter:
                    'brightness(1.2) drop-shadow(0 0 10px rgba(236, 72, 153, 0.6))',
                }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="relative overflow-hidden rounded-lg"
              >
                <img
                  src="/logos/nome_hrz.png"
                  alt="Interbox 2025"
                  className="transition-all duration-300"
                  style={{ width: isScrolled ? 60 : 80, height: 'auto' }}
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-400/20 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                />
              </motion.div>
            </a>

            {/* Menu Desktop */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-white hover:text-pink-400 transition-all duration-300 font-medium text-sm">Home</a>
              <a href="/sobre" className="text-white hover:text-pink-400 transition-all duration-300 font-medium text-sm">Sobre</a>
              {(authUser?.role === 'atleta' || authUser?.role === 'jurado') && (
                <a href="/hub" className="text-white hover:text-pink-400 transition-all duration-300 font-medium text-sm">Hub</a>
              )}
              <a href="/audiovisual" className="text-pink-400 hover:text-pink-300 transition-all duration-300 font-medium text-sm">Audiovisual</a>
              {user && (
                <>
                  <a href="/perfil" className="text-white hover:text-pink-400 transition-all duration-300 font-medium text-sm">Perfil</a>
                  {hasDashboardAccess && (
                    <a href="/dashboard-evento" className="text-white hover:text-pink-400 transition-all duration-300 font-medium text-sm">📊 Dashboard</a>
                  )}
                  <button onClick={handleLogout} className="text-white hover:text-pink-400 transition-all duration-300 font-medium text-sm">Sair</button>
                </>
              )}
              {!user && (
                <motion.button
                  onClick={handleGoogleLogin}
                  disabled={isLoggingIn}
                  className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-200 font-medium text-sm flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isLoggingIn ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Entrando...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span>Entrar com Google</span>
                    </>
                  )}
                </motion.button>
              )}
            </nav>

            {/* Menu Mobile (Hambúrguer) */}
            <motion.button
              onClick={toggleMenu}
              className="md:hidden hamburger-button flex flex-col justify-center items-center w-8 h-8 text-white hover:text-pink-400 transition-colors duration-300"
              whileTap={{ scale: 0.95 }}
              aria-label="Abrir menu"
            >
              <motion.span
                className="absolute w-6 h-0.5 hamburger-line transform transition-all duration-300"
                animate={{ rotate: isMenuOpen ? 45 : 0, y: isMenuOpen ? 0 : -6 }}
              />
              <motion.span
                className="absolute w-6 h-0.5 hamburger-line transform transition-all duration-300"
                animate={{ opacity: isMenuOpen ? 0 : 1, scale: isMenuOpen ? 0 : 1 }}
              />
              <motion.span
                className="absolute w-6 h-0.5 hamburger-line transform transition-all duration-300"
                animate={{ rotate: isMenuOpen ? -45 : 0, y: isMenuOpen ? 0 : 6 }}
              />
            </motion.button>
          </div>
        </motion.div>
      </motion.header>

      {/* Menu Mobile Fullscreen */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden menu-mobile-overlay backdrop-blur-fallback"
              style={{
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
              }}
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="md:hidden menu-mobile-container border-l border-pink-500/20 backdrop-blur-fallback menu-mobile-fix"
              style={{
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
              }}
            >
              <div className="flex flex-col h-full p-6">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-bold text-white">Menu</h2>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="text-white hover:text-pink-400 transition-colors duration-300"
                  >
                    ✕
                  </button>
                </div>

                <nav className="flex flex-col space-y-4">
                  <a
                    href="/"
                    className="text-white hover:text-pink-400 transition-all duration-300 font-medium text-lg py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </a>
                  <a
                    href="/sobre"
                    className="text-white hover:text-pink-400 transition-all duration-300 font-medium text-lg py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sobre
                  </a>
                  {(authUser?.role === 'atleta' || authUser?.role === 'jurado') && (
                    <a
                      href="/hub"
                      className="text-white hover:text-pink-400 transition-all duration-300 font-medium text-lg py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Hub
                    </a>
                  )}
                  <a
                    href="/audiovisual"
                    className="text-pink-400 hover:text-pink-300 transition-all duration-300 font-medium text-lg py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Audiovisual
                  </a>
                  {user && (
                    <>
                      <a
                        href="/perfil"
                        className="text-white hover:text-pink-400 transition-all duration-300 font-medium text-lg py-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Perfil
                      </a>
                      {hasDashboardAccess && (
                        <a
                          href="/dashboard-evento"
                          className="text-white hover:text-pink-400 transition-all duration-300 font-medium text-lg py-2"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          📊 Dashboard
                        </a>
                      )}
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        className="text-white hover:text-pink-400 transition-all duration-300 font-medium text-lg py-2 text-left"
                      >
                        Sair
                      </button>
                    </>
                  )}
                  {!user && (
                    <motion.button
                      onClick={() => {
                        handleGoogleLogin();
                        setIsMenuOpen(false);
                      }}
                      disabled={isLoggingIn}
                      className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-200 font-medium text-lg text-center flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isLoggingIn ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Entrando...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                          </svg>
                          <span>Entrar com Google</span>
                        </>
                      )}
                    </motion.button>
                  )}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
