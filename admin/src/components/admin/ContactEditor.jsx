import PropTypes from 'prop-types';
import styles from '../../styles/Admin.module.css';
import PublishButton from './PublishButton.jsx';

const ContactEditor = ({ contact, onSave, onAddEntry, onUpdateEntry, onRemoveEntry, onMoveEntry }) => {
  const entries = Array.isArray(contact?.entries) ? contact.entries : [];

  return (
    <div className={styles.panelCard}>
      <div className={`${styles.buttonRow} ${styles.panelToolbar}`}>
        <PublishButton label="Publish contact" />
      </div>
      <h2 className={styles.panelTitle}>Contact</h2>
      <p className={styles.panelDescription}>
        Share direct ways to reach you. Icons are inferred automatically from each link or identifier.
      </p>

      <div className={styles.fieldGrid}>
        <div className={styles.fieldGroup}>
          <label htmlFor="contact-eyebrow">Eyebrow</label>
          <div className={styles.inlineFields}>
            <input
              id="contact-eyebrow"
              type="text"
              value={contact?.eyebrow || ''}
              onChange={(event) => onSave({ eyebrow: event.target.value })}
            />
            <button
              type="button"
              className={styles.iconButton}
              aria-label="Clear"
              onClick={() => onSave({ eyebrow: '' })}
            >
              ×
            </button>
          </div>
        </div>
        <div className={styles.fieldGroupFull}>
          <label htmlFor="contact-title">Title</label>
          <div className={styles.inlineFields}>
            <input
              id="contact-title"
              type="text"
              value={contact?.title || ''}
              onChange={(event) => onSave({ title: event.target.value })}
            />
            <button
              type="button"
              className={styles.iconButton}
              aria-label="Clear"
              onClick={() => onSave({ title: '' })}
            >
              ×
            </button>
          </div>
        </div>
        <div className={styles.fieldGroupFull}>
          <label htmlFor="contact-description">Description</label>
          <div className={styles.inlineFields}>
            <textarea
              id="contact-description"
              rows={3}
              value={contact?.description || ''}
              onChange={(event) => onSave({ description: event.target.value })}
            />
            <button
              type="button"
              className={styles.iconButton}
              aria-label="Clear"
              onClick={() => onSave({ description: '' })}
            >
              ×
            </button>
          </div>
        </div>
      </div>

      <div className={styles.listStack}>
        <div className={styles.listHeader}>
          <h3 className={styles.listTitle}>Contact methods</h3>
          <button type="button" className={styles.secondaryButton} onClick={() => onAddEntry({})}>
            <span className={styles.buttonIcon}>➕</span> Add method
          </button>
        </div>
        {entries.length === 0 ? (
          <p className={styles.note}>Add at least one link, phone number, or email so visitors can reach you.</p>
        ) : null}
        {entries.map((entry, index) => (
          <div key={entry.id} className={styles.listCard}>
            <div className={styles.listCardHeader}>
              <strong>{entry.label || 'Contact method'}</strong>
              <div className={styles.listActions}>
                <button
                  type="button"
                  className={styles.iconButtonSmall}
                  onClick={() => onMoveEntry(entry.id, 'up')}
                  disabled={index === 0}
                  aria-label="Move up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  className={styles.iconButtonSmall}
                  onClick={() => onMoveEntry(entry.id, 'down')}
                  disabled={index === entries.length - 1}
                  aria-label="Move down"
                >
                  ↓
                </button>
                <button
                  type="button"
                  className={styles.iconButtonSmall}
                  onClick={() => onRemoveEntry(entry.id)}
                  aria-label="Remove"
                >
                  🗑
                </button>
              </div>
            </div>
            <div className={styles.fieldGrid}>
              <div className={styles.fieldGroup}>
                <label>Label</label>
                <div className={styles.inlineFields}>
                  <input
                    type="text"
                    value={entry.label || ''}
                    onChange={(event) => onUpdateEntry(entry.id, { label: event.target.value })}
                    placeholder="Email, Mobile, LinkedIn …"
                  />
                  <button
                    type="button"
                    className={styles.iconButton}
                    aria-label="Clear label"
                    onClick={() => onUpdateEntry(entry.id, { label: '' })}
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label>Link or value</label>
                <div className={styles.inlineFields}>
                  <input
                    type="text"
                    value={entry.value || ''}
                    onChange={(event) => onUpdateEntry(entry.id, { value: event.target.value })}
                    placeholder="mailto:hello@studio.com, +44 …, https://…"
                  />
                  <button
                    type="button"
                    className={styles.iconButton}
                    aria-label="Clear value"
                    onClick={() => onUpdateEntry(entry.id, { value: '' })}
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label>Display text (optional)</label>
                <div className={styles.inlineFields}>
                  <input
                    type="text"
                    value={entry.displayValue || ''}
                    onChange={(event) => onUpdateEntry(entry.id, { displayValue: event.target.value })}
                    placeholder="hello@studio.com"
                  />
                  <button
                    type="button"
                    className={styles.iconButton}
                    aria-label="Clear display value"
                    onClick={() => onUpdateEntry(entry.id, { displayValue: '' })}
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className={styles.fieldGroupFull}>
                <label>Note (optional)</label>
                <div className={styles.inlineFields}>
                  <textarea
                    rows={2}
                    value={entry.note || ''}
                    onChange={(event) => onUpdateEntry(entry.id, { note: event.target.value })}
                    placeholder="When you tend to respond, what to expect, etc."
                  />
                  <button
                    type="button"
                    className={styles.iconButton}
                    aria-label="Clear note"
                    onClick={() => onUpdateEntry(entry.id, { note: '' })}
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

ContactEditor.propTypes = {
  contact: PropTypes.shape({
    eyebrow: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    entries: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string,
        value: PropTypes.string,
        displayValue: PropTypes.string,
        note: PropTypes.string
      })
    )
  }).isRequired,
  onSave: PropTypes.func.isRequired,
  onAddEntry: PropTypes.func.isRequired,
  onUpdateEntry: PropTypes.func.isRequired,
  onRemoveEntry: PropTypes.func.isRequired,
  onMoveEntry: PropTypes.func.isRequired
};

export default ContactEditor;
