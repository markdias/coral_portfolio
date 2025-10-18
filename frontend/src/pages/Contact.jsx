import pageStyles from '../styles/Contact.module.css';
import { useData } from '../store/DataContext.jsx';
import {
  formatDisplayValue,
  getAssistiveLabel,
  getContactDescription,
  getContactIcon,
  resolveContactHref,
  shouldOpenInNewTab
} from '../utils/contact.jsx';
import Reveal from '../components/Reveal.jsx';
import { getFontFamily } from '../utils/typography.js';

const Contact = () => {
  const { data } = useData();
  const contact = data.contact || {};
  const entries = Array.isArray(contact.entries) ? contact.entries : [];
  const contactFont = getFontFamily(data.typography?.contact);

  return (
    <Reveal as="div" className={pageStyles.contactShell}>
      <Reveal as="header" className={pageStyles.contactIntro}>
        {contact.eyebrow ? (
          <Reveal as="p" className={pageStyles.eyebrow} delay={0.05} style={{ fontFamily: contactFont }}>
            {contact.eyebrow}
          </Reveal>
        ) : null}
        {contact.title ? (
          <Reveal as="h2" className={pageStyles.title} delay={0.1} style={{ fontFamily: contactFont }}>
            {contact.title}
          </Reveal>
        ) : null}
        {contact.description ? (
          <Reveal as="p" className={pageStyles.description} delay={0.18} style={{ fontFamily: contactFont }}>
            {contact.description}
          </Reveal>
        ) : null}
      </Reveal>

      <ul className={pageStyles.methods}>
        {entries.map((entry, index) => {
          const href = resolveContactHref(entry.value || '');
          const { Icon, type } = getContactIcon(entry);
          const displayValue = formatDisplayValue(entry);
          const description = getContactDescription(entry);
          const assistiveLabel = getAssistiveLabel(entry);
          const openInNewTab = shouldOpenInNewTab(href);

          return (
            <Reveal as="li" key={entry.id} className={pageStyles.methodCard} delay={0.1 + index * 0.06}>
              <a
                className={pageStyles.methodLink}
                href={href}
                target={openInNewTab ? '_blank' : undefined}
                rel={openInNewTab ? 'noopener noreferrer' : undefined}
                aria-label={assistiveLabel}
              >
                <span className={`${pageStyles.iconWrap} ${pageStyles[`icon-${type}`] || ''}`.trim()} aria-hidden="true">
                  <Icon />
                </span>
                <span className={pageStyles.methodCopy} style={{ fontFamily: contactFont }}>
                  <span className={pageStyles.methodLabel}>{entry.label || 'Contact'}</span>
                  <span className={pageStyles.methodValue}>{displayValue}</span>
                  {description ? <span className={pageStyles.methodNote}>{description}</span> : null}
                </span>
              </a>
            </Reveal>
          );
        })}
      </ul>
    </Reveal>
  );
};

export default Contact;
