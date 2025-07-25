import { useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import AudiovisualAnalysis from '../components/AudiovisualAnalysis'
import { useAnalytics } from '../hooks/useAnalytics'

export default function Audiovisual() {
  const { trackPage, trackScroll } = useAnalytics()

  useEffect(() => { trackPage('audiovisual') }, [trackPage])
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const pageHeight = document.documentElement.scrollHeight - window.innerHeight
      const percent = Math.round((scrollY / pageHeight) * 100)
      if (percent > 0 && percent % 25 === 0) trackScroll('audiovisual_page', percent)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [trackScroll])



  return (
    <>
      {/* Meta fake ou usa React Helmet */}
      <head>
        <title>Audiovisual & Creators - CERRADO INTERBØX 2025</title>
        <meta name="description" content="Faça parte da equipe audiovisual..." />
        <meta property="og:image" content="/images/og-interbox.png" />
      </head>

      <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0a1a] to-[#0038d0]">
        <Header />
        <main className="pt-24 pb-16 px-4 relative overflow-hidden">
          {/* BG + textual hero sem next/image */}
          {/* ...mesma estrutura, trocando <Image> por <img> ou div bg */}

          {/* Resto do conteúdo… */}
          <AudiovisualAnalysis />
        </main>
        <Footer />
      </div>
    </>
  )
}
