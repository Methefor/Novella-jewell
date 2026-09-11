export const CREATIVE_PRESET_IDS = [
  'remove-bg-master',
  'product-hero',
  'packshot',
  'luxury-ad',
  'editorial-ad',
  'scroll-stopper',
  'luxury-edition',
  '3d-billboard',
] as const;

export type CreativePresetId = (typeof CREATIVE_PRESET_IDS)[number];
export type CreativeMediaKind = 'studio' | 'model' | 'lifestyle' | 'campaign';

export type CreativeProduct = {
  name: string;
  slug: string;
  category: string;
  material: string;
  description: string;
  story: string;
  features: string[];
};

export const CREATIVE_PRESETS: ReadonlyArray<{
  id: CreativePresetId;
  label: string;
  shortLabel: string;
  kind: CreativeMediaKind;
  direction: string;
}> = [
  {
    id: 'remove-bg-master',
    label: 'Remove BG Master',
    shortLabel: 'Şeffaf ürün ana dosyası',
    kind: 'studio',
    direction:
      'Create a faithful transparent-background product cutout. Remove every environmental element and cast shadow while preserving the exact product geometry, fine edges, openings, material, reflections, and construction.',
  },
  {
    id: 'product-hero',
    label: 'Product Hero',
    shortLabel: 'Ana kampanya karesi',
    kind: 'studio',
    direction:
      'Create a premium ecommerce hero image with one unmistakable focal point, warm champagne light, restrained negative space, and a polished luxury-jewelry finish.',
  },
  {
    id: 'packshot',
    label: 'Packshot',
    shortLabel: 'Temiz ürün çekimi',
    kind: 'studio',
    direction:
      'Create a clean high-end packshot on a seamless warm-ivory background with physically believable contact shadow, crisp edges, and catalog-grade material detail.',
  },
  {
    id: 'luxury-ad',
    label: 'Luxury Ad',
    shortLabel: 'Lüks reklam',
    kind: 'campaign',
    direction:
      'Create a cinematic luxury advertisement with controlled highlights, dark champagne accents, elegant depth, and enough clean space for minimal campaign copy.',
  },
  {
    id: 'editorial-ad',
    label: 'Editorial Ad',
    shortLabel: 'Moda editoryali',
    kind: 'lifestyle',
    direction:
      'Create a fashion-editorial composition with sophisticated styling, tactile surfaces, directional magazine lighting, and an art-directed yet believable scene.',
  },
  {
    id: 'scroll-stopper',
    label: 'Scroll Stopper',
    shortLabel: 'İlk saniye kancası',
    kind: 'campaign',
    direction:
      'Create a bold social-first visual readable in under one second: dramatic scale, high contrast, close product detail, strong center composition, and no visual clutter.',
  },
  {
    id: 'luxury-edition',
    label: 'Luxury Edition',
    shortLabel: 'Koleksiyon kapağı',
    kind: 'lifestyle',
    direction:
      'Create a limited-edition luxury campaign frame using sculptural composition, subtle gold-and-cream brand cues, refined reflections, and gallery-level restraint.',
  },
  {
    id: '3d-billboard',
    label: '3D Billboard',
    shortLabel: 'Anamorfik açıkhava',
    kind: 'campaign',
    direction:
      'Create an anamorphic 3D billboard concept where the product appears to extend beyond the display, with convincing perspective, premium city context, and legible brand space.',
  },
] as const;

const FORMAT_LABELS: Record<string, string> = {
  story: '9:16 vertical Story / Reels',
  feed: '4:5 portrait feed',
  square: '1:1 square',
};

function absoluteAssetUrl(url: string, siteUrl: string) {
  if (!url.startsWith('/')) return url;
  return new URL(url, `${siteUrl.replace(/\/$/, '')}/`).toString();
}

export function getCreativePreset(id: CreativePresetId) {
  return (
    CREATIVE_PRESETS.find((preset) => preset.id === id) ??
    CREATIVE_PRESETS.find((preset) => preset.id === 'product-hero')!
  );
}

export function buildCreativePrompt({
  product,
  imageUrls,
  presetId,
  formats,
  headline,
  subheadline,
  cta,
  siteUrl,
}: {
  product: CreativeProduct;
  imageUrls: string[];
  presetId: CreativePresetId;
  formats: string[];
  headline: string;
  subheadline: string;
  cta: string;
  siteUrl: string;
}) {
  const preset = getCreativePreset(presetId);
  const references = imageUrls
    .map((url, index) => `${index + 1}. ${absoluteAssetUrl(url, siteUrl)}`)
    .join('\n');
  const requestedFormats = formats
    .map((format) => FORMAT_LABELS[format] ?? format)
    .join(', ');
  const features = product.features.filter(Boolean).slice(0, 6).join('; ');

  if (presetId === 'remove-bg-master') {
    return `NOVELLA JEWELL — REMOVE BG MASTER PRODUCTION BRIEF

Use the public reference-image URLs below as the visual source of truth:
${references || 'No reference image selected.'}

PRODUCT
Name: ${product.name}
Category: ${product.category}
Material: ${product.material}
Known features: ${features || 'Use only details visible in the references.'}

EDIT TARGET
Use the first reference as the edit target. The other references, when present, only help verify the exact product identity.

IDENTITY LOCK — NON-NEGOTIABLE
Change only the background. Preserve the exact product geometry, stone count and placement, proportions, metal color, surface texture, closures, engravings, highlights, orientation, and construction visible in the references. Preserve every real opening between chain links or product parts as transparency. Do not redraw, reconstruct, beautify, rotate, crop, simplify, add, or remove any product detail.

OUTPUT
Return exactly one full-resolution RGBA PNG with a genuinely transparent background. Keep only the product, with clean natural edges and comfortable transparent margins. Remove the complete scene, props, hands, fabric, floor, backdrop, reflections outside the product, and cast shadows.

NEGATIVE CONSTRAINTS
No opaque or checkerboard background, white fill, floor, pedestal, shadow, reflection, halo, color fringe, extra jewelry, duplicate product, altered links, warped circles, melted metal, floating stones, fake hallmarks, text, logo, watermark, or third-party branding.`;
  }

  return `NOVELLA JEWELL — ${preset.label.toUpperCase()} PRODUCTION BRIEF

Use the public reference-image URLs below as the visual source of truth:
${references || 'No reference image selected.'}

PRODUCT
Name: ${product.name}
Category: ${product.category}
Material: ${product.material}
Description: ${product.description}
Story: ${product.story}
Known features: ${features || 'Use only details visible in the references.'}

IDENTITY LOCK — NON-NEGOTIABLE
Preserve the exact product geometry, stone count and placement, proportions, metal color, surface texture, closures, engravings, and construction visible in the references. Do not redesign, simplify, add stones, remove parts, change the material, mirror asymmetrical details, or invent a logo. If a hidden detail is uncertain, keep it hidden instead of hallucinating it.

CREATIVE DIRECTION
${preset.direction}
Brand language: modern accessible luxury, warm ivory, champagne gold, soft black, minimal typography, no generic mass-market look.
Requested outputs: ${requestedFormats || '4:5 portrait feed'}.
Campaign copy to reserve space for: “${headline.trim()}” / “${subheadline.trim()}” / CTA “${cta.trim()}”. Do not render text unless it can be perfectly typeset; otherwise leave intentional clean space.

STILL OUTPUT
Create one polished key visual per requested format. Keep the product fully recognizable at thumbnail size. Use realistic optics, jewelry-scale reflections, believable shadows, and premium retouching without plastic skin or melted metal.

AI STORYBOARD — 5 SHOTS
1. Hook: an immediate macro reveal built around the ${preset.label} idea.
2. Form: a controlled camera move that proves the exact silhouette and proportions.
3. Detail: gemstone, texture, clasp, or edge detail taken only from the references.
4. Desire: the product in the premium environment described above, with restrained motion.
5. Close: clean hero frame with copy-safe space and the CTA moment.

Return the still concepts first, then a shot-by-shot video storyboard. For every shot include framing, lens feel, camera motion, lighting, background, duration, and transition. Keep the full sequence between 8 and 12 seconds.

NEGATIVE CONSTRAINTS
No altered product design, extra jewelry, duplicate products, warped circles, melted metal, floating stones, illegible text, fake hallmarks, incorrect anatomy, excessive sparkle, busy props, low-resolution texture, watermark, or third-party branding.`;
}
