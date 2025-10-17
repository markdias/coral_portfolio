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

const Contact = () => {
  const { data } = useData();
  const contact = data.contact || {};
  const entries = Array.isArray(contact.entries) ? contact.entries : [];

  return (
    <div className={pageStyles.contactShell}>
      <header className={pageStyles.contactIntro}>
        {contact.eyebrow ? <p className={pageStyles.eyebrow}>{contact.eyebrow}</p> : null}
        {contact.title ? <h2 className={pageStyles.title}>{contact.title}</h2> : null}
        {contact.description ? <p className={pageStyles.description}>{contact.description}</p> : null}
      </header>

      <ul className={pageStyles.methods}>
        {entries.map((entry) => {
          const href = resolveContactHref(entry.value || '');
          const { Icon, type } = getContactIcon(entry);
          const displayValue = formatDisplayValue(entry);
          const description = getContactDescription(entry);
          const assistiveLabel = getAssistiveLabel(entry);
          const openInNewTab = shouldOpenInNewTab(href);

          return (
            <li key={entry.id} className={pageStyles.methodCard}>
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
                <span className={pageStyles.methodCopy}>
                  <span className={pageStyles.methodLabel}>{entry.label || 'Contact'}</span>
                  <span className={pageStyles.methodValue}>{displayValue}</span>
                  {description ? <span className={pageStyles.methodNote}>{description}</span> : null}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Contact;
