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

const summariseValue = (value) => {
  if (typeof value !== 'string') {
    return '';
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return '';
  }

  return trimmed.length > 80 ? `${trimmed.slice(0, 77)}…` : trimmed;
};

const buildHomeTargets = (data) => {
  const home = data?.home ?? {};
  const fields = [
    { key: 'home.eyebrow', label: 'Eyebrow', hint: summariseValue(home.eyebrow) },
    { key: 'home.title', label: 'Title', hint: summariseValue(home.title) },
    { key: 'home.description', label: 'Description', hint: summariseValue(home.description) },
    { key: 'home.ribbonText', label: 'Ribbon text', hint: summariseValue(home.ribbonText) },
    { key: 'home.primaryCta.label', label: 'Primary CTA label', hint: summariseValue(home.primaryCta?.label) },
    { key: 'home.secondaryCta.label', label: 'Secondary CTA label', hint: summariseValue(home.secondaryCta?.label) }
  ];

  return fields.filter(Boolean);
};

const buildAboutTargets = (data) => {
  const about = data?.about ?? {};
  const fields = [
    { key: 'about.eyebrow', label: 'Eyebrow', hint: summariseValue(about.eyebrow) },
    { key: 'about.title', label: 'Title', hint: summariseValue(about.title) }
  ];

  (about.paragraphs ?? []).forEach((paragraph, index) => {
    fields.push({
      key: `about.paragraphs.${index}`,
      label: `Paragraph ${index + 1}`,
      hint: summariseValue(paragraph)
    });
  });

  (about.capabilities ?? []).forEach((capability, index) => {
    fields.push({
      key: `about.capabilities.${index}`,
      label: `Capability ${index + 1}`,
      hint: summariseValue(capability)
    });
  });

  (about.stats ?? []).forEach((stat, index) => {
    if (!stat?.id) return;
    fields.push({
      key: `about.stats.${stat.id}.value`,
      label: `Stat ${index + 1} value`,
      hint: summariseValue(stat.value)
    });
    fields.push({
      key: `about.stats.${stat.id}.label`,
      label: `Stat ${index + 1} label`,
      hint: summariseValue(stat.label)
    });
    fields.push({
      key: `about.stats.${stat.id}.description`,
      label: `Stat ${index + 1} description`,
      hint: summariseValue(stat.description)
    });
  });

  return fields;
};

const buildPortfolioTargets = (data) => {
  const portfolio = data?.portfolio ?? {};
  return [
    { key: 'portfolio.introTitle', label: 'Intro title', hint: summariseValue(portfolio.introTitle) },
    {
      key: 'portfolio.introDescription',
      label: 'Intro description',
      hint: summariseValue(portfolio.introDescription)
    },
    { key: 'portfolio.filtersLabel', label: 'Filter label', hint: summariseValue(portfolio.filtersLabel) }
  ];
};

const buildContactTargets = (data) => {
  const contact = data?.contact ?? {};
  const fields = [
    { key: 'contact.eyebrow', label: 'Eyebrow', hint: summariseValue(contact.eyebrow) },
    { key: 'contact.title', label: 'Title', hint: summariseValue(contact.title) },
    { key: 'contact.description', label: 'Description', hint: summariseValue(contact.description) }
  ];

  (contact.entries ?? []).forEach((entry, index) => {
    if (!entry?.id) return;
    fields.push({
      key: `contact.entries.${entry.id}.label`,
      label: `Entry ${index + 1} label`,
      hint: summariseValue(entry.label)
    });
    fields.push({
      key: `contact.entries.${entry.id}.value`,
      label: `Entry ${index + 1} value`,
      hint: summariseValue(entry.value)
    });
    fields.push({
      key: `contact.entries.${entry.id}.displayValue`,
      label: `Entry ${index + 1} display value`,
      hint: summariseValue(entry.displayValue || entry.value)
    });
    fields.push({
      key: `contact.entries.${entry.id}.note`,
      label: `Entry ${index + 1} note`,
      hint: summariseValue(entry.note)
    });
  });

  return fields;
};

export const buildFontTargets = (data) => {
  const sections = [
    { key: 'home', label: 'Home', fields: buildHomeTargets(data) },
    { key: 'about', label: 'About', fields: buildAboutTargets(data) },
    { key: 'portfolio', label: 'Portfolio', fields: buildPortfolioTargets(data) },
    { key: 'contact', label: 'Contact', fields: buildContactTargets(data) }
  ];

  return sections.filter((section) => section.fields.length > 0);
};

export const getFontOptionByValue = (value) => FONT_OPTIONS.find((option) => option.value === value);

export const getFontLabel = (value) => getFontOptionByValue(value)?.label || 'Default';

