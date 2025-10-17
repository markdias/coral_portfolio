const normalizeString = (value = '') => value.toLowerCase();

const includesAny = (value, needles = []) =>
  needles.some((needle) => value.includes(needle));

const stripProtocol = (value = '') => value.replace(/^[a-z]+:\/\//i, '');

const ICON_PROPS = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  'aria-hidden': 'true',
  focusable: 'false'
};

const MailIcon = () => (
  <svg {...ICON_PROPS} fill="none" stroke="currentColor" strokeWidth="1.6">
    <rect x="3.2" y="5" width="17.6" height="14" rx="2.4" />
    <path d="M4.5 7.4 12 12l7.5-4.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PhoneIcon = () => (
  <svg {...ICON_PROPS} fill="none" stroke="currentColor" strokeWidth="1.6">
    <path
      d="M8.7 3.6H6.6a1.8 1.8 0 0 0-1.8 1.9c0 6.5 5.2 11.7 11.7 11.7 1 0 1.9-0.8 1.9-1.8v-2.2c0-0.5-0.3-1-0.8-1.2l-2.6-1.1a1.3 1.3 0 0 0-1.6 0.5l-0.8 1.3a0.5 0.5 0 0 1-0.6 0.2 8.4 8.4 0 0 1-4-4 0.5 0.5 0 0 1 0.2-0.6l1.3-0.8c0.5-0.3 0.7-1 0.5-1.6L9.9 4.4a1.4 1.4 0 0 0-1.2-0.8z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const LinkedInIcon = () => (
  <svg {...ICON_PROPS} fill="none" stroke="currentColor" strokeWidth="1.6">
    <rect x="3" y="3" width="18" height="18" rx="2.8" />
    <path d="M8.1 17v-6.3M8.1 8.2a0.8 0.8 0 1 1 0-1.6 0.8 0.8 0 0 1 0 1.6ZM16 17v-3.7a2.1 2.1 0 0 0-4.2 0V17" strokeLinecap="round" />
  </svg>
);

const InstagramIcon = () => (
  <svg {...ICON_PROPS} fill="none" stroke="currentColor" strokeWidth="1.6">
    <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
    <circle cx="12" cy="12" r="3.4" />
    <circle cx="16.7" cy="7.3" r="0.8" fill="currentColor" stroke="none" />
  </svg>
);

const GlobeIcon = () => (
  <svg {...ICON_PROPS} fill="none" stroke="currentColor" strokeWidth="1.6">
    <circle cx="12" cy="12" r="8.5" />
    <path d="M3.6 12h16.8M12 3.5c2.5 2.6 3.8 5.6 3.8 8.5S14.5 17 12 20.5C9.5 17.9 8.2 14.9 8.2 12S9.5 6 12 3.5Z" />
  </svg>
);

const MessageIcon = () => (
  <svg {...ICON_PROPS} fill="none" stroke="currentColor" strokeWidth="1.6">
    <path
      d="M5.2 5.5h13.6c1.3 0 2.4 1 2.4 2.3v6.2c0 1.3-1.1 2.3-2.4 2.3h-3.2l-3.6 3.2-3.6-3.2H5.2c-1.3 0-2.4-1-2.4-2.3V7.8c0-1.3 1.1-2.3 2.4-2.3z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ICON_MAP = {
  email: MailIcon,
  phone: PhoneIcon,
  linkedin: LinkedInIcon,
  instagram: InstagramIcon,
  message: MessageIcon,
  website: GlobeIcon
};

const detectContactType = (entry) => {
  const value = normalizeString(entry?.value || '');
  const label = normalizeString(entry?.label || '');

  if (value.startsWith('mailto:') || value.includes('@')) {
    return 'email';
  }

  const digits = (entry?.value || '').replace(/[\s().-]/g, '');
  if (value.startsWith('tel:') || (/^[+\d][\d().\s-]+$/.test(entry?.value || '') && digits.replace(/\D/g, '').length >= 7)) {
    return 'phone';
  }

  if (includesAny(value, ['linkedin.com', 'lnkd.in']) || includesAny(label, ['linkedin'])) {
    return 'linkedin';
  }

  if (includesAny(value, ['instagram.com', 'instagr.am']) || includesAny(label, ['instagram'])) {
    return 'instagram';
  }

  if (includesAny(value, ['whatsapp.com', 'wa.me']) || includesAny(label, ['whatsapp', 'message'])) {
    return 'message';
  }

  return 'website';
};

export const getContactIcon = (entry) => {
  const type = detectContactType(entry);
  const Icon = ICON_MAP[type] || ICON_MAP.website;
  return { Icon, type };
};

export const resolveContactHref = (value = '') => {
  const trimmed = value.trim();
  if (!trimmed) return '#';
  if (/^(mailto:|tel:)/i.test(trimmed)) {
    return trimmed;
  }
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  if (trimmed.includes('@') && !trimmed.includes(' ')) {
    return `mailto:${trimmed}`;
  }

  const phoneCandidate = trimmed.replace(/[\s().-]/g, '');
  if (/^[+\d][\d().\s-]+$/.test(trimmed) && phoneCandidate.replace(/\D/g, '').length >= 7) {
    return `tel:${phoneCandidate}`;
  }

  if (trimmed.startsWith('www.')) {
    return `https://${trimmed}`;
  }

  if (trimmed.includes('.') && !trimmed.includes(' ')) {
    return `https://${trimmed}`;
  }

  return trimmed;
};

export const formatDisplayValue = (entry) => {
  if (!entry) return '';
  if (entry.displayValue) return entry.displayValue;
  const raw = entry.value || '';
  if (/^mailto:/i.test(raw)) {
    return raw.replace(/^mailto:/i, '');
  }
  if (/^tel:/i.test(raw)) {
    return raw.replace(/^tel:/i, '').replace(/(\d{3})(?=\d)/g, '$1 ').trim();
  }
  if (raw.startsWith('www.')) {
    return raw;
  }
  return stripProtocol(raw);
};

export const shouldOpenInNewTab = (href) => /^https?:/i.test(href);

export const getAssistiveLabel = (entry) => {
  const { type } = getContactIcon(entry);
  const label = entry?.label || 'Contact link';
  switch (type) {
    case 'email':
      return `${label}: email`;
    case 'phone':
      return `${label}: phone`;
    case 'linkedin':
      return `${label}: LinkedIn`;
    case 'instagram':
      return `${label}: Instagram`;
    case 'message':
      return `${label}: messaging`;
    default:
      return `${label}: website`;
  }
};

export const getContactDescription = (entry) => entry?.note || '';
