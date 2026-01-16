export function generatePlaceholderDataURL(width: number, height: number): string {
  // Base64 encoded 1x1 pixel transparent image
  const shimmer = `
    <svg width="${width}" height="${height}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <linearGradient id="g">
          <stop stop-color="#f0f0f0" offset="20%" />
          <stop stop-color="#e0e0e0" offset="50%" />
          <stop stop-color="#f0f0f0" offset="70%" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="#f0f0f0" />
      <rect id="r" width="${width}" height="${height}" fill="url(#g)" />
      <animate xlink:href="#r" attributeName="x" from="-${width}" to="${width}" dur="1s" repeatCount="indefinite"  />
    </svg>
  `

  const toBase64 = (str: string) =>
    typeof window === 'undefined'
      ? Buffer.from(str).toString('base64')
      : window.btoa(str)

  return `data:image/svg+xml;base64,${toBase64(shimmer)}`
}

// Önceden tanımlı placeholder'lar
export const placeholders = {
  product: generatePlaceholderDataURL(400, 533), // 3:4 aspect ratio
  category: generatePlaceholderDataURL(400, 533),
  hero: generatePlaceholderDataURL(1920, 1080),
  square: generatePlaceholderDataURL(400, 400),
}
