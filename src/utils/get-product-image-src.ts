import type { Product } from '@/types/entities.ts'

const categoryLabelMap: Record<Product['category'], string> = {
  bouquet: 'Букет',
  flower: 'Цветы',
  gift: 'Подарок',
}

const categoryColorMap: Record<Product['category'], { accent: string; base: string }> = {
  bouquet: {
    accent: '#d97b7b',
    base: '#f7e2dc',
  },
  flower: {
    accent: '#6f9d6d',
    base: '#edf6e8',
  },
  gift: {
    accent: '#b38752',
    base: '#f6ecdd',
  },
}

function createFallbackSvg(product: Product) {
  const palette = categoryColorMap[product.category]
  const title = product.title.replace(/&/g, '&amp;')
  const categoryLabel = categoryLabelMap[product.category]

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${palette.base}" />
          <stop offset="100%" stop-color="#ffffff" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#g)" />
      <circle cx="670" cy="120" r="92" fill="${palette.accent}" fill-opacity="0.12" />
      <circle cx="130" cy="480" r="120" fill="${palette.accent}" fill-opacity="0.10" />
      <rect x="52" y="56" rx="28" ry="28" width="158" height="48" fill="${palette.accent}" fill-opacity="0.18" />
      <text x="80" y="88" font-family="Segoe UI, Arial, sans-serif" font-size="24" fill="${palette.accent}">${categoryLabel}</text>
      <text x="52" y="390" font-family="Georgia, 'Times New Roman', serif" font-size="54" fill="#2f3426">${title}</text>
      <text x="52" y="440" font-family="Segoe UI, Arial, sans-serif" font-size="24" fill="#5d6757">Flora Boutique</text>
    </svg>
  `.trim()

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

export function getProductImageSrc(product: Product) {
  if (product.image.startsWith('http://') || product.image.startsWith('https://')) {
    return product.image
  }

  if (product.image.startsWith('/')) {
    return product.image
  }

  return createFallbackSvg(product)
}

