

import React from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article';
  url?: string;
  noIndex?: boolean;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = '🔥 CERRADØ INTERBOX 2025 • 24 a 26 OUT • O Maior Campeonato de CrossFit do Brasil',
  description = 'O maior evento de times da América Latina. CrossFit de verdade, com suor, estratégia e adrenalina em Goiânia.',
  image = '/images/og-interbox.png',
  type = 'website',
  url,
  noIndex = false,
}) => {
  const fullUrl = url ? `${window.location.origin}${url}` : window.location.href;
  const fullImageUrl = image.startsWith('http') ? image : `${window.location.origin}${image}`;

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Language" content="pt-br" />
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#ec4899" />

      {/* Canonical */}
      <link rel="canonical" href={fullUrl} />

      {/* OG / Facebook */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content="CERRADØ INTERBOX 2025" />
      <meta property="og:locale" content="pt_BR" />
      <meta property="og:image:alt" content="CERRADØ INTERBOX 2025 - Campeonato de CrossFit Goiânia" />
      <meta property="og:updated_time" content="2025-07-01T12:00:00+00:00" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />

      {/* SEO Local */}
      <meta name="geo.region" content="BR-GO" />
      <meta name="geo.placename" content="Goiânia" />
      <meta name="geo.position" content="-16.6869;-49.2648" />
      <meta name="ICBM" content="-16.6869, -49.2648" />

      {/* Keywords otimizadas */}
      <meta
        name="keywords"
        content="interbox, cerrado, crossfit, goiânia, competição de times, evento fitness, campeonato crossfit 2025, cross training, ginásio rio vermelho, brasil, fitness games, evento esportivo goiânia, time rx, scaled, crossfit brasil"
      />
      <meta name="author" content="CERRADØ INTERBOX" />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Preconnect + DNS */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />

      {/* JSON-LD Rich Snippet para Evento + Ingressos */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'SportsEvent',
          'name': 'CERRADØ INTERBOX 2025',
          'startDate': '2025-10-24',
          'endDate': '2025-10-26',
          'eventAttendanceMode': 'https://schema.org/OfflineEventAttendanceMode',
          'eventStatus': 'https://schema.org/EventScheduled',
          'description': description,
          'image': [fullImageUrl],
          'url': 'https://cerradointerbox.com',
          'location': {
            '@type': 'Place',
            'name': 'Ginásio Rio Vermelho',
            'address': {
              '@type': 'PostalAddress',
              'streetAddress': 'Rua 74, Centro',
              'addressLocality': 'Goiânia',
              'addressRegion': 'GO',
              'postalCode': '74000-000',
              'addressCountry': 'BR',
            },
            'geo': {
              '@type': 'GeoCoordinates',
              'latitude': -16.6869,
              'longitude': -49.2648,
            },
          },
          'organizer': {
            '@type': 'Organization',
            'name': 'CERRADØ INTERBOX',
            'url': 'https://cerradointerbox.com',
          },
          'offers': {
            '@type': 'Offer',
            'url': 'https://cerradointerbox.com/ingressos',
            'price': '385.00',
            'priceCurrency': 'BRL',
            'availability': 'https://schema.org/InStock',
            'validFrom': '2025-07-01',
          },
        })}
      </script>
    </>
  );
};

export default SEOHead;
