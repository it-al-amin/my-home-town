import React, { useState } from 'react';

interface ResponsiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackUrl?: string; // optional custom fallback
}

// Professional image component with graceful fallback handling.
export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({ src, alt, fallbackUrl, ...rest }) => {
  const [hasError, setHasError] = useState(false);

  // Default placeholder – a simple SVG with the alt text.
  const defaultPlaceholder = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23e2e8f0'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='20' fill='%236b7280'>${encodeURIComponent(alt)}</text></svg>`;

  const displaySrc = hasError ? fallbackUrl || defaultPlaceholder : src;

  return (
    <img
      src={displaySrc}
      alt={alt}
      onError={() => setHasError(true)}
      {...rest}
    />
  );
};

