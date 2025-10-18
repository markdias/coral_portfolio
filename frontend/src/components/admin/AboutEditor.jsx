import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from '../../styles/Admin.module.css';

const FONT_OPTIONS = [
  {
    label: 'Playfair Display',
    value: 'display'
  },
  {
    label: 'Plus Jakarta Sans',
    value: 'sans'
  },
  {
    label: 'Georgia',
    value: 'serif'
  }
];

const STAT_DEFAULTS = {
  value: '',
  label: '',
  description: '',
  valueFont: 'display',
  labelFont: 'sans',
  descriptionFont: 'sans'
};

const withDefaults = (stat) => ({
  ...STAT_DEFAULTS,
  ...stat
});

const splitLines = (value) =>
  value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);

const AboutEditor = ({ about, onSave, onCreateId }) => {
  const [eyebrow, setEyebrow] = useState('');
  const [title, setTitle] = useState('');
  const [paragraphsText, setParagraphsText] = useState('');
  const [capabilitiesText, setCapabilitiesText] = useState('');
  const [stats, setStats] = useState([]);

  useEffect(() => {
    setEyebrow(about.eyebrow ?? '');
    setTitle(about.title ?? '');
    setParagraphsText((about.paragraphs ?? []).join('\n\n'));
    setCapabilitiesText((about.capabilities ?? []).join('\n'));
    setStats((about.stats ?? []).map(withDefaults));
  }, [about]);

  const handleAddStat = () => {
    setStats((prev) => [
      ...prev,
      withDefaults({
        id: onCreateId('stat')
      })
    ]);
  };

  const handleStatChange = (statId, field, value) => {
    setStats((prev) =>
      prev.map((item) =>
        item.id === statId
          ? {
              ...item,
              [field]: value
            }
          : item
      )
    );
  };

  const handleRemoveStat = (statId) => {
    setStats((prev) => prev.filter((item) => item.id !== statId));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextStats = stats
      .map((item) => ({
        ...item,
        value: (item.value ?? '').trim(),
        label: (item.label ?? '').trim(),
        description: (item.description ?? '').trim(),
        valueFont: item.valueFont || STAT_DEFAULTS.valueFont,
        labelFont: item.labelFont || STAT_DEFAULTS.labelFont,
        descriptionFont: item.descriptionFont || STAT_DEFAULTS.descriptionFont
      }))
      .filter((item) => item.value && item.label);

    onSave({
      eyebrow: eyebrow.trim(),
      title: title.trim(),
      paragraphs: splitLines(paragraphsText.replace(/\n{3,}/g, '\n\n')),
      capabilities: splitLines(capabilitiesText),
      stats: nextStats
    });
  };

  return (
    <div className={styles.panelCard}>
      <h2 className={styles.panelTitle}>About section</h2>
      <p className={styles.panelDescription}>
        Refresh the studio story, capabilities, and key impact metrics that reinforce the designer’s expertise and process.
      </p>
      <form className={styles.fieldGrid} onSubmit={handleSubmit}>
        <div className={styles.fieldGrid}>
          <div className={styles.fieldGroup}>
            <label htmlFor="about-eyebrow">Eyebrow</label>
            <input
              id="about-eyebrow"
              value={eyebrow}
              onChange={(event) => setEyebrow(event.target.value)}
              placeholder="About Isla Marin"
            />
          </div>
          <div className={styles.fieldGroup}>
            <label htmlFor="about-title">Headline</label>
            <input
              id="about-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Printmaking rituals rooted ..."
              required
            />
          </div>
        </div>
        <div className={styles.fieldGroup}>
          <label htmlFor="about-paragraphs">Narrative paragraphs</label>
          <textarea
            id="about-paragraphs"
            rows={6}
            value={paragraphsText}
            onChange={(event) => setParagraphsText(event.target.value)}
            placeholder={'Paragraphs separated by blank lines'}
          />
        </div>
        <div className={styles.fieldGroup}>
          <label htmlFor="about-capabilities">Capabilities (one per line)</label>
          <textarea
            id="about-capabilities"
            rows={4}
            value={capabilitiesText}
            onChange={(event) => setCapabilitiesText(event.target.value)}
            placeholder={'Hand-painted textiles\nDigital compositing\n...'}
          />
        </div>
        <div className={styles.sectionGroup}>
          <div className={styles.buttonRow}>
            <h3 className={styles.panelTitle} style={{ marginBottom: 0, fontSize: '1.1rem' }}>
              Impact stats
            </h3>
            <button type="button" className={styles.secondaryButton} onClick={handleAddStat}>
              Add stat
            </button>
          </div>
          <div className={styles.fieldGrid}>
            {stats.map((stat) => (
              <div key={stat.id} className={styles.metadataRow}>
                <div className={styles.metadataRowFields}>
                  <div className={styles.fieldGroup}>
                    <label>Value</label>
                    <input
                      value={stat.value}
                      onChange={(event) => handleStatChange(stat.id, 'value', event.target.value)}
                      placeholder="28"
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label>Label</label>
                    <input
                      value={stat.label}
                      onChange={(event) => handleStatChange(stat.id, 'label', event.target.value)}
                      placeholder="Runway capsules outfitted"
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label>Supporting description</label>
                    <input
                      value={stat.description}
                      onChange={(event) => handleStatChange(stat.id, 'description', event.target.value)}
                      placeholder="Seasonal runway collaborations"
                    />
                  </div>
                </div>
                <div className={styles.metadataRowFields}>
                  <div className={styles.fieldGroup}>
                    <label>Value font</label>
                    <select
                      value={stat.valueFont}
                      onChange={(event) => handleStatChange(stat.id, 'valueFont', event.target.value)}
                    >
                      {FONT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.fieldGroup}>
                    <label>Label font</label>
                    <select
                      value={stat.labelFont}
                      onChange={(event) => handleStatChange(stat.id, 'labelFont', event.target.value)}
                    >
                      {FONT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.fieldGroup}>
                    <label>Description font</label>
                    <select
                      value={stat.descriptionFont}
                      onChange={(event) => handleStatChange(stat.id, 'descriptionFont', event.target.value)}
                    >
                      {FONT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className={styles.metadataRowActions}>
                  <button
                    type="button"
                    className={styles.dangerButton}
                    onClick={() => handleRemoveStat(stat.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            {stats.length === 0 ? <p className={styles.note}>Add stats to highlight impact metrics and milestones.</p> : null}
          </div>
        </div>
        <div className={styles.buttonRow}>
          <button type="submit" className={styles.primaryButton}>
            Save about content
          </button>
        </div>
      </form>
    </div>
  );
};

AboutEditor.propTypes = {
  about: PropTypes.shape({
    eyebrow: PropTypes.string,
    title: PropTypes.string,
    paragraphs: PropTypes.arrayOf(PropTypes.string),
    capabilities: PropTypes.arrayOf(PropTypes.string),
    stats: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        value: PropTypes.string,
        label: PropTypes.string,
        description: PropTypes.string,
        valueFont: PropTypes.string,
        labelFont: PropTypes.string,
        descriptionFont: PropTypes.string
      })
    )
  }).isRequired,
  onSave: PropTypes.func.isRequired,
  onCreateId: PropTypes.func.isRequired
};

export default AboutEditor;
