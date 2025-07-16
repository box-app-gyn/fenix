import { useState, useEffect } from 'react'
import { onAuthStateChanged, signOut, User } from 'firebase/auth'
import { auth } from '../lib/firebase'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)
  const { user: authUser } = useAuth()

  // Verificar se usuário tem acesso ao dashboard
  const hasDashboardAccess = authUser && (
    authUser.role === 'admin'
    || authUser.role === 'jurado'
    || authUser.role === 'midia'
    || authUser.role === 'fotografo'
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
              <a href="/home" className="text-white hover:text-pink-400 transition-all duration-300 font-medium text-sm">Home</a>
              <a href="/hub" className="text-white hover:text-pink-400 transition-all duration-300 font-medium text-sm">Hub</a>

              <a href="/leaderboard" className="text-white hover:text-pink-400 transition-all duration-300 font-medium text-sm">Leaderboard</a>
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
                <a href="/login" className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-200 font-medium text-sm">Entrar</a>
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
                    href="/home"
                    className="text-white hover:text-pink-400 transition-all duration-300 font-medium text-lg py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </a>
                  <a
                    href="/hub"
                    className="text-white hover:text-pink-400 transition-all duration-300 font-medium text-lg py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Hub
                  </a>

                  <a
                    href="/leaderboard"
                    className="text-white hover:text-pink-400 transition-all duration-300 font-medium text-lg py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Leaderboard
                  </a>
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
                    <a
                      href="/login"
                      className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-200 font-medium text-lg text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Entrar
                    </a>
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
