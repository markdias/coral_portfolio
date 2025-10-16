import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from '../../styles/Admin.module.css';

const defaultState = {
  eyebrow: '',
  title: '',
  description: '',
  heroImage: '',
  primaryCta: { label: '', href: '' },
  secondaryCta: { label: '', href: '' }
};

const HomeEditor = ({ home, onSave }) => {
  const [formState, setFormState] = useState({ ...defaultState });

  useEffect(() => {
    setFormState({ ...defaultState, ...home });
  }, [home]);

  const handleFieldChange = (field, value) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCtaChange = (ctaKey, field, value) => {
    setFormState((prev) => ({
      ...prev,
      [ctaKey]: {
        ...prev[ctaKey],
        [field]: value
      }
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const sanitized = {
      ...formState,
      heroImage: formState.heroImage.trim(),
      primaryCta: {
        label: formState.primaryCta.label.trim(),
        href: formState.primaryCta.href.trim()
      },
      secondaryCta: {
        label: formState.secondaryCta.label.trim(),
        href: formState.secondaryCta.href.trim()
      }
    };

    onSave(sanitized);
  };

  return (
    <div className={styles.panelCard}>
      <h2 className={styles.panelTitle}>Home section</h2>
      <p className={styles.panelDescription}>
        Update the landing hero copy, imagery, and call-to-actions that greet visitors. Focus on a concise proposition and
        evocative description.
      </p>
      <form className={styles.fieldGrid} onSubmit={handleSubmit}>
        <div className={styles.fieldGrid}>
          <div className={styles.fieldGroup}>
            <label htmlFor="home-eyebrow">Eyebrow</label>
            <input
              id="home-eyebrow"
              value={formState.eyebrow}
              onChange={(event) => handleFieldChange('eyebrow', event.target.value)}
              placeholder="Surface pattern atelier"
            />
          </div>
          <div className={styles.fieldGroup}>
            <label htmlFor="home-title">Headline</label>
            <input
              id="home-title"
              value={formState.title}
              onChange={(event) => handleFieldChange('title', event.target.value)}
              placeholder="Tailored fashion prints ..."
              required
            />
          </div>
          <div className={styles.fieldGroup}>
            <label htmlFor="home-description">Description</label>
            <textarea
              id="home-description"
              rows={4}
              value={formState.description}
              onChange={(event) => handleFieldChange('description', event.target.value)}
              placeholder="Describe the studio voice"
              required
            />
          </div>
          <div className={styles.fieldGroup}>
            <label htmlFor="home-hero">Hero image URL</label>
            <input
              id="home-hero"
              value={formState.heroImage}
              onChange={(event) => handleFieldChange('heroImage', event.target.value)}
              placeholder="https://..."
            />
          </div>
        </div>

        <div className={styles.fieldGrid}>
          <div className={styles.fieldGroup}>
            <label htmlFor="home-primary-label">Primary CTA label</label>
            <input
              id="home-primary-label"
              value={formState.primaryCta.label}
              onChange={(event) => handleCtaChange('primaryCta', 'label', event.target.value)}
              placeholder="Explore portfolio"
            />
          </div>
          <div className={styles.fieldGroup}>
            <label htmlFor="home-primary-href">Primary CTA link</label>
            <input
              id="home-primary-href"
              value={formState.primaryCta.href}
              onChange={(event) => handleCtaChange('primaryCta', 'href', event.target.value)}
              placeholder="/portfolio"
            />
          </div>
          <div className={styles.fieldGroup}>
            <label htmlFor="home-secondary-label">Secondary CTA label</label>
            <input
              id="home-secondary-label"
              value={formState.secondaryCta.label}
              onChange={(event) => handleCtaChange('secondaryCta', 'label', event.target.value)}
              placeholder="Meet the designer"
            />
          </div>
          <div className={styles.fieldGroup}>
            <label htmlFor="home-secondary-href">Secondary CTA link</label>
            <input
              id="home-secondary-href"
              value={formState.secondaryCta.href}
              onChange={(event) => handleCtaChange('secondaryCta', 'href', event.target.value)}
              placeholder="/about"
            />
          </div>
        </div>
        <div className={styles.buttonRow}>
          <button type="submit" className={styles.primaryButton}>
            Save home content
          </button>
        </div>
      </form>
    </div>
  );
};

HomeEditor.propTypes = {
  home: PropTypes.shape({
    eyebrow: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    heroImage: PropTypes.string,
    primaryCta: PropTypes.shape({
      label: PropTypes.string,
      href: PropTypes.string
    }),
    secondaryCta: PropTypes.shape({
      label: PropTypes.string,
      href: PropTypes.string
    })
  }).isRequired,
  onSave: PropTypes.func.isRequired
};

export default HomeEditor;
