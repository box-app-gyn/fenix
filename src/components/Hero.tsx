import { motion } from 'framer-motion'
import GamifiedCTA from './GamifiedCTA.tsx'
import OptimizedImage from './OptimizedImage.tsx'
import { useEffect, useRef, useState } from 'react'
import { useAnalytics } from '../hooks/useAnalytics'

function useDeviceParallax(ref: React.RefObject<HTMLDivElement>) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    function handleOrientation(event: DeviceOrientationEvent) {
      if (!el) return
      const x = event.gamma || 0
      const y = event.beta || 0
      el.style.transform = `translate3d(${x * 0.8}px, ${y * 0.5}px, 0)`
    }
    window.addEventListener('deviceorientation', handleOrientation)
    return () => window.removeEventListener('deviceorientation', handleOrientation)
  }, [ref])
}

export default function Hero() {
  const logoRef = useRef<HTMLDivElement>(null)
  const { trackPage, trackScroll } = useAnalytics()
  const [strobeActive, setStrobeActive] = useState(false)

  useDeviceParallax(logoRef)

  useEffect(() => {
    const strobeInterval = setInterval(() => {
      setStrobeActive(true)
      setTimeout(() => setStrobeActive(false), 200)
    }, 400000)

    return () => clearInterval(strobeInterval)
  }, [])

  useEffect(() => {
    trackPage('home')
  }, [trackPage])

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const heroHeight = window.innerHeight

      if (scrollY > heroHeight * 0.5) {
        trackScroll('hero_section', Math.round((scrollY / heroHeight) * 100))
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [trackScroll])

  return (
    <section className="relative min-h-[80vh] flex flex-col justify-center items-center text-center px-6 text-white">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/images/bg_main.webp)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#0a0a1a]/80" />

      <div className="relative z-10">
        <motion.div
          ref={logoRef}
          className="mx-auto mt-20 mb-8 w-90 h-90 flex items-center justify-center will-change-transform"
          style={{ transition: 'transform 0.2s cubic-bezier(.25,.46,.45,.94)' }}
          animate={{
            rotate: [0, 1, -1, 0],
            scale: [1, 1.02, 0.98, 1],
            filter: strobeActive
              ? ['brightness(1)', 'brightness(2)', 'brightness(1)']
              : ['brightness(1)', 'brightness(1.1)', 'brightness(1)'],
          }}
          transition={{
            rotate: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
            scale: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
            filter: {
              duration: strobeActive ? 0.2 : 4,
              repeat: strobeActive ? 0 : Infinity,
              ease: 'easeInOut',
            },
          }}
        >
          <motion.div
            transition={{
              duration: strobeActive ? 0.2 : 3,
              repeat: strobeActive ? 0 : Infinity,
              ease: 'easeInOut',
            }}
            className="rounded-full"
          >
            <OptimizedImage
              src="/logos/oficial_logo.webp"
              alt="Logo Oficial"
              width={560}
              height={560}
              className="rounded-full"
              style={{ width: 'auto', height: 'auto' }}
            />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 10 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-20 max-w-2xl"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white headline-glow">
            <span className="text-pink-500">
              O MAIOR EVENTO <span className="whitespace-nowrap">DE TIMES</span>
            </span>
            <br /> DA AMÉRICA LATINA
          </h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="mt-6"
          >
            <p className="text-xl md:text-2xl font-bold text-pink-400 drop-shadow-neon-pink">
              24, 25 e 26 de OUTUBRO
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-12 mb-4"
        >
          <GamifiedCTA
            href="https://chat.whatsapp.com/FHTqm0l36kc7RWYWMw1Kiz"
            tooltipText="O PORTAL ESTÁ ABERTO"
            className="btn-neon-pulse px-8 py-3"
          >
            ACESSAR A COMUNIDADE
          </GamifiedCTA>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="mb-24"
        >
          <p className="mt-20 text-base md:text-lg text-neutral-200 font-semibold drop-shadow-lg">
            Aqui você não se inscreve. Você assume seu chamado.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
