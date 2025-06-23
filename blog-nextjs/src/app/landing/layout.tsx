import Script from 'next/script'

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Base.Tube",
    "description": "The platform that pays creators first. Turn your content into tradeable assets.",
    "url": "https://base.tube",
    "applicationCategory": "Multimedia",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "name": "Genesis Pass",
      "description": "First 500 founding members get unlimited access to all content forever",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/LimitedAvailability"
    },
    "creator": {
      "@type": "Organization",
      "name": "Base.Tube",
      "url": "https://base.tube"
    }
  }

  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {children}
    </>
  )
} 