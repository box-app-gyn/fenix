import Hero from '../components/Hero'
import Comunidade from '../components/Comunidade'
import TempoReal from '../components/TempoReal'
import HomeGamification from '../components/HomeGamification'
import ReferralLinkGenerator from '../components/ReferralLinkGenerator'
import CallToAction from '../components/CallToAction'
import Parceiros from '../components/Parceiros'

function LinhaDelicada() {
  return (
    <div className="flex justify-center">
      <img
        src="/images/liner.png"
        alt=""
        className="h-0.5 w-full max-w-[400px] object-cover select-none pointer-events-none"
        draggable="false"
      />
    </div>
  )
}

export default function Home() {
  return (
    <>
      {/* Fake SEOHead substituindo temporariamente */}
      <head>
        <title>CERRADØ INTERBOX 2025 - O Maior Evento de Times da América Latina</title>
        <meta
          name="description"
          content="24, 25 e 26 de outubro. O CERRADØ INTERBOX vai além da arena. Aqui você não se inscreve. Você assume seu chamado."
        />
        <meta property="og:image" content="/images/og-interbox.png" />
        <meta property="og:type" content="website" />
        <meta name="keywords" content="CERRADØ INTERBOX, competição de times, crossfit competition, fitness event, Brasil, América Latina, 2025" />
        <link rel="canonical" href="https://cerradointerbox.com.br" />
      </head>

      <div>
        <LinhaDelicada />
        <Hero />
        <LinhaDelicada />
        <Comunidade />
        <LinhaDelicada />
        <TempoReal isPublic={true} />
        <LinhaDelicada />
        <HomeGamification />
        <LinhaDelicada />
        <ReferralLinkGenerator />
        <LinhaDelicada />
        <Parceiros />
        <LinhaDelicada />
        <CallToAction />
      </div>
    </>
  )
}
