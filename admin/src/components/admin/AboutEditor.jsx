import PropTypes from 'prop-types';
import styles from '../../styles/Admin.module.css';
import PublishButton from './PublishButton.jsx';

const STAT_DEFAULTS = {
  value: '',
  label: '',
  description: ''
};

const withDefaults = (stat) => ({
  ...STAT_DEFAULTS,
  ...stat
});

const AboutEditor = ({ about, onSave, onCreateId }) => {
  const updateArrayItem = (arr, index, next) => arr.map((v, i) => (i === index ? next : v));

  return (
    <div className={styles.panelCard}>
      <div className={`${styles.buttonRow} ${styles.panelToolbar}`}>
        <PublishButton label="Publish about" />
      </div>
      <h2 className={styles.panelTitle}>About</h2>
      <div className={styles.fieldGrid}>
        <div className={styles.fieldGroup}>
          <label htmlFor="about-eyebrow">Eyebrow</label>
          <input
            id="about-eyebrow"
            type="text"
            value={about.eyebrow}
            onChange={(e) => onSave({ eyebrow: e.target.value })}
          />
        </div>
        <div className={styles.fieldGroup}>
          <label htmlFor="about-title">Title</label>
          <input id="about-title" type="text" value={about.title} onChange={(e) => onSave({ title: e.target.value })} />
        </div>
        <div className={styles.fieldGroupFull}>
          <label htmlFor="about-paragraphs">Paragraphs</label>
          {about.paragraphs.map((p, i) => (
            <div key={i} className={styles.inlineFields}>
              <textarea
                rows={3}
                value={p}
                onChange={(e) => onSave({ paragraphs: updateArrayItem(about.paragraphs, i, e.target.value) })}
              />
              <button
                type="button"
                className={styles.iconButton}
                aria-label="Remove"
                onClick={() => onSave({ paragraphs: about.paragraphs.filter((_, idx) => idx !== i) })}
              >
                ×
              </button>
            </div>
          ))}
          <div className={styles.buttonRow}>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => onSave({ paragraphs: [...about.paragraphs, ''] })}
            >
              <span className={styles.buttonIcon}>➕</span> Add paragraph
            </button>
          </div>
        </div>
        <div className={styles.fieldGroupFull}>
          <label>Capabilities</label>
          {about.capabilities.map((c, i) => (
            <div key={i} className={styles.inlineFields}>
              <input
                type="text"
                value={c}
                onChange={(e) => onSave({ capabilities: updateArrayItem(about.capabilities, i, e.target.value) })}
              />
              <button
                type="button"
                className={styles.iconButton}
                aria-label="Remove"
                onClick={() => onSave({ capabilities: about.capabilities.filter((_, idx) => idx !== i) })}
              >
                ×
              </button>
            </div>
          ))}
          <div className={styles.buttonRow}>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => onSave({ capabilities: [...about.capabilities, ''] })}
            >
              <span className={styles.buttonIcon}>➕</span> Add capability
            </button>
          </div>
        </div>
        <div className={styles.fieldGroupFull}>
          <label>Stats</label>
          {about.stats.map((s, i) => {
            const stat = withDefaults(s);

            return (
              <div key={s.id} className={styles.metadataRow}>
                <div className={styles.metadataRowFields}>
                  <div className={styles.fieldGroup}>
                    <label>Value</label>
                    <input
                      type="text"
                      value={stat.value}
                      onChange={(e) =>
                        onSave({
                          stats: updateArrayItem(about.stats, i, {
                            ...stat,
                            value: e.target.value
                          })
                        })
                      }
                      placeholder="Value"
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label>Label</label>
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) =>
                        onSave({
                          stats: updateArrayItem(about.stats, i, {
                            ...stat,
                            label: e.target.value
                          })
                        })
                      }
                      placeholder="Label"
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label>Supporting description</label>
                    <input
                      type="text"
                      value={stat.description}
                      onChange={(e) =>
                        onSave({
                          stats: updateArrayItem(about.stats, i, {
                            ...stat,
                            description: e.target.value
                          })
                        })
                      }
                      placeholder="Additional context"
                    />
                  </div>
                </div>
                <div className={styles.metadataRowActions}>
                  <button
                    type="button"
                    className={styles.dangerButton}
                    onClick={() => onSave({ stats: about.stats.filter((_, idx) => idx !== i) })}
                  >
                    <span className={styles.buttonIcon}>🗑</span> Remove stat
                  </button>
                </div>
              </div>
            );
          })}
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() =>
              onSave({
                stats: [
                  ...about.stats,
                  {
                    ...STAT_DEFAULTS,
                    id: onCreateId('stat')
                  }
                ]
              })
            }
          >
            <span className={styles.buttonIcon}>➕</span> Add stat
          </button>
        </div>
      </div>
    </div>
  );
};

AboutEditor.propTypes = {
  about: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  onCreateId: PropTypes.func.isRequired
};

export default AboutEditor;
