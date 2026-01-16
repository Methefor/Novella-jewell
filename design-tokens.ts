// NOVELLA Design Tokens
// Marka kimliği için tüm tasarım sabitleri

export const colors = {
  // Ana Marka Renkleri
  gold: {
    DEFAULT: '#D4AF37',
    light: '#E5C158',
    dark: '#B8941F',
  },
  roseGold: {
    DEFAULT: '#B76E79',
    light: '#C98E97',
    dark: '#9F5861',
  },
  
  // Nötr Renkler
  black: '#0F0F0F',
  white: '#FFFFFF',
  cream: {
    DEFAULT: '#FDFBF7',
    dark: '#F5F3EF',
  },
  
  // Gri Tonları
  gray: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
  
  // Aksiyon Renkleri
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
} as const;

export const typography = {
  fontFamily: {
    heading: ['Cormorant Garamond', 'serif'],
    body: ['Inter', 'sans-serif'],
  },
  fontSize: {
    // Display (Hero başlıklar)
    'display-lg': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],  // 72px
    'display-md': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }], // 60px
    'display-sm': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],    // 48px
    
    // Heading
    'h1': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],   // 40px
    'h2': ['2rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],     // 32px
    'h3': ['1.5rem', { lineHeight: '1.4', letterSpacing: '0' }],         // 24px
    'h4': ['1.25rem', { lineHeight: '1.4', letterSpacing: '0' }],        // 20px
    'h5': ['1.125rem', { lineHeight: '1.5', letterSpacing: '0' }],       // 18px
    'h6': ['1rem', { lineHeight: '1.5', letterSpacing: '0' }],           // 16px
    
    // Body
    'body-lg': ['1.125rem', { lineHeight: '1.75' }],  // 18px
    'body': ['1rem', { lineHeight: '1.75' }],         // 16px
    'body-sm': ['0.875rem', { lineHeight: '1.6' }],   // 14px
    'body-xs': ['0.75rem', { lineHeight: '1.5' }],    // 12px
    
    // Special
    'price-lg': ['1.875rem', { lineHeight: '1.2', fontWeight: '600' }],  // 30px
    'price': ['1.5rem', { lineHeight: '1.2', fontWeight: '600' }],       // 24px
    'button': ['1rem', { lineHeight: '1.5', fontWeight: '500' }],        // 16px
  },
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;

export const spacing = {
  section: {
    sm: '3rem',    // 48px
    md: '5rem',    // 80px
    lg: '7rem',    // 112px
    xl: '10rem',   // 160px
  },
  container: {
    padding: {
      mobile: '1rem',      // 16px
      tablet: '2rem',      // 32px
      desktop: '4rem',     // 64px
    },
    maxWidth: '1440px',
  },
  grid: {
    gap: {
      sm: '1rem',     // 16px
      md: '1.5rem',   // 24px
      lg: '2rem',     // 32px
    },
  },
} as const;

export const borderRadius = {
  none: '0',
  sm: '0.25rem',    // 4px
  DEFAULT: '0.5rem', // 8px
  md: '0.75rem',    // 12px
  lg: '1rem',       // 16px
  xl: '1.5rem',     // 24px
  '2xl': '2rem',    // 32px
  full: '9999px',
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  gold: '0 4px 14px 0 rgba(212, 175, 55, 0.25)',
  'gold-lg': '0 8px 24px 0 rgba(212, 175, 55, 0.35)',
} as const;

export const transitions = {
  duration: {
    fast: '150ms',
    DEFAULT: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  timing: {
    DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  modal: 30,
  popover: 40,
  tooltip: 50,
  notification: 60,
} as const;

// Özel NOVELLA Tema Değerleri
export const theme = {
  // Marka Mottosu
  tagline: "Her Parça Bir Hikaye",
  
  // Maksimum içerik genişlikleri
  maxWidth: {
    content: '1200px',
    text: '65ch',
  },
  
  // Ürün kartı boyutları
  product: {
    card: {
      aspectRatio: '3/4',
      imageAspectRatio: '3/4',
    },
  },
  
  // Header yükseklikleri
  header: {
    height: {
      mobile: '64px',
      desktop: '80px',
    },
    announcement: {
      height: '40px',
    },
  },
} as const;

// Type exports
export type Color = keyof typeof colors;
export type Spacing = keyof typeof spacing;
export type Shadow = keyof typeof shadows;
