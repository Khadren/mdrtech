import { Helmet } from "react-helmet-async";

export default function SEO({
  title,
  description,
  url,
  image = "https://mdrtech.ca/og-image.png"
}) {
  const fullTitle = title ? `${title} | MDR Tech` : "MDR Tech";
  const fullUrl = url ? `https://mdrtech.ca${url}` : "https://mdrtech.ca";

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}