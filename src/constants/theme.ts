/**
 * AniKings Design Tokens
 * Cinematic dark palette with neon accent highlights.
 */

export const AnimeColors = {
  // Backgrounds
  background: '#0A0A0F',
  surface: '#14141F',
  surfaceLight: '#1C1C2E',
  card: '#1A1A2E',

  // Text
  textPrimary: '#EAEAF0',
  textSecondary: '#9898B0',
  textMuted: '#5A5A78',

  // Accents
  accent: '#FF4D8D',
  accentLight: '#FF6FA3',
  accentDark: '#CC3D70',
  star: '#FFD700',

  // Semantic
  success: '#00E676',
  warning: '#FFB300',
  error: '#FF5252',

  // UI
  border: '#2A2A40',
  tabBar: '#0D0D14',
  tabBarActive: '#FF4D8D',
  tabBarInactive: '#5A5A78',

  // Overlay
  overlay: 'rgba(10, 10, 15, 0.85)',
  gradient: ['rgba(10,10,15,0)', 'rgba(10,10,15,0.8)', '#0A0A0F'],
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 6,
  md: 12,
  lg: 16,
  xl: 24,
  round: 999,
};

// Re-export for backward compat with template code
export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: '#FF4D8D',
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: '#FF4D8D',
  },
  dark: {
    text: '#ECEDEE',
    background: '#0A0A0F',
    tint: '#FF4D8D',
    icon: '#9BA1A6',
    tabIconDefault: '#5A5A78',
    tabIconSelected: '#FF4D8D',
  },
};
