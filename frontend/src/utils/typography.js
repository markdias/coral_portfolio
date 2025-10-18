export const FONT_OPTIONS = [
  {
    value: 'display',
    label: 'Playfair Display',
    family: "'Playfair Display', 'Times New Roman', serif"
  },
  {
    value: 'sans',
    label: 'Plus Jakarta Sans',
    family: "'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  },
  {
    value: 'serif',
    label: 'Georgia',
    family: "'Georgia', 'Times New Roman', serif"
  },
  {
    value: 'poppins',
    label: 'Poppins',
    family: "'Poppins', 'Segoe UI', sans-serif"
  },
  {
    value: 'cormorant',
    label: 'Cormorant Garamond',
    family: "'Cormorant Garamond', 'Times New Roman', serif"
  },
  {
    value: 'workSans',
    label: 'Work Sans',
    family: "'Work Sans', 'Segoe UI', sans-serif"
  },
  {
    value: 'crimson',
    label: 'Crimson Text',
    family: "'Crimson Text', 'Times New Roman', serif"
  }
];

export const FONT_FAMILIES = FONT_OPTIONS.reduce((acc, option) => {
  acc[option.value] = option.family;
  return acc;
}, {});

export const getFontFamily = (value, fallback = 'display') =>
  FONT_FAMILIES[value] || FONT_FAMILIES[fallback] || 'inherit';

export const getFontLabel = (value) => FONT_OPTIONS.find((option) => option.value === value)?.label || 'Default';

