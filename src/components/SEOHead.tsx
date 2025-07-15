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
  title = 'CERRADØ INTERBOX 2025',
  description = 'O maior evento de times da América Latina. CERRADØ INTERBOX 2025 - Eternize a intensidade.',
  image = '/images/og-interbox.png',
  type = 'website',
  url,
  noIndex = false
}) => {
  const fullUrl = url ? `${window.location.origin}${url}` : window.location.href;
  const fullImageUrl = image.startsWith('http') ? image : `${window.location.origin}${image}`;

  return (
    <>
      {/* Meta tags básicas */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Favicon */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      
      {/* PWA Manifest */}
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#ec4899" />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content="CERRADØ INTERBOX 2025" />
      <meta property="og:locale" content="pt_BR" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      
      {/* SEO e Indexação */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      <meta name="author" content="CERRADØ INTERBOX" />
      <meta name="keywords" content="crossfit, competição, times, brasil, cerrado, interbox, 2025" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Preconnect para performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Event",
          "name": "CERRADØ INTERBOX 2025",
          "description": "O maior evento de times da América Latina",
          "startDate": "2025-01-01",
          "endDate": "2025-01-01",
          "location": {
            "@type": "Place",
            "name": "Brasil",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "BR"
            }
          },
          "organizer": {
            "@type": "Organization",
            "name": "CERRADØ INTERBOX"
          },
          "url": "https://cerradointerbox.com",
          "image": fullImageUrl
        })}
      </script>
    </>
  );
};

export default SEOHead; 