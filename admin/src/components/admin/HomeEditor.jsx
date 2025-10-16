import PropTypes from 'prop-types';
import styles from '../../styles/Admin.module.css';
import UploadButton from './UploadButton.jsx';
import PublishButton from './PublishButton.jsx';

const HomeEditor = ({ home, onSave }) => (
  <div className={styles.panelCard}>
    <h2 className={styles.panelTitle}>Home</h2>
    <div className={styles.buttonRow}>
      <PublishButton label="Publish home" />
    </div>
    <div className={styles.fieldGrid}>
      <div className={styles.fieldGroup}>
        <label htmlFor="home-eyebrow">Eyebrow</label>
        <div className={styles.inlineFields}>
          <input
            id="home-eyebrow"
            type="text"
            value={home.eyebrow}
            onChange={(e) => onSave({ eyebrow: e.target.value })}
          />
          <button type="button" className={styles.iconButton} aria-label="Clear" onClick={() => onSave({ eyebrow: '' })}>
            ×
          </button>
        </div>
      </div>
      <div className={styles.fieldGroup}>
        <label htmlFor="home-title">Title</label>
        <div className={styles.inlineFields}>
          <input
            id="home-title"
            type="text"
            value={home.title}
            onChange={(e) => onSave({ title: e.target.value })}
          />
          <button type="button" className={styles.iconButton} aria-label="Clear" onClick={() => onSave({ title: '' })}>
            ×
          </button>
        </div>
      </div>
      <div className={styles.fieldGroupFull}>
        <label htmlFor="home-description">Description</label>
        <div className={styles.inlineFields}>
          <textarea
            id="home-description"
            rows={4}
            value={home.description}
            onChange={(e) => onSave({ description: e.target.value })}
          />
          <button type="button" className={styles.iconButton} aria-label="Clear" onClick={() => onSave({ description: '' })}>
            ×
          </button>
        </div>
      </div>
      <div className={styles.fieldGroup}>
        <label htmlFor="home-ribbon">Hero ribbon label</label>
        <div className={styles.inlineFields}>
          <input
            id="home-ribbon"
            type="text"
            value={home.ribbonText || ''}
            onChange={(e) => onSave({ ribbonText: e.target.value })}
            placeholder="Limited print editions"
          />
          <button type="button" className={styles.iconButton} aria-label="Clear" onClick={() => onSave({ ribbonText: '' })}>
            ×
          </button>
        </div>
      </div>
      <div className={styles.fieldGroup}>
        <label htmlFor="home-primary-label">Primary CTA label</label>
        <div className={styles.inlineFields}>
          <input
            id="home-primary-label"
            type="text"
            value={home.primaryCta.label}
            onChange={(e) => onSave({ primaryCta: { ...home.primaryCta, label: e.target.value } })}
          />
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Clear"
            onClick={() => onSave({ primaryCta: { ...home.primaryCta, label: '' } })}
          >
            ×
          </button>
        </div>
      </div>
      <div className={styles.fieldGroup}>
        <label htmlFor="home-primary-href">Primary CTA href</label>
        <div className={styles.inlineFields}>
          <input
            id="home-primary-href"
            type="text"
            value={home.primaryCta.href}
            onChange={(e) => onSave({ primaryCta: { ...home.primaryCta, href: e.target.value } })}
          />
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Clear"
            onClick={() => onSave({ primaryCta: { ...home.primaryCta, href: '' } })}
          >
            ×
          </button>
        </div>
      </div>
      <div className={styles.fieldGroup}>
        <label htmlFor="home-secondary-label">Secondary CTA label</label>
        <div className={styles.inlineFields}>
          <input
            id="home-secondary-label"
            type="text"
            value={home.secondaryCta.label}
            onChange={(e) => onSave({ secondaryCta: { ...home.secondaryCta, label: e.target.value } })}
          />
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Clear"
            onClick={() => onSave({ secondaryCta: { ...home.secondaryCta, label: '' } })}
          >
            ×
          </button>
        </div>
      </div>
      <div className={styles.fieldGroup}>
        <label htmlFor="home-secondary-href">Secondary CTA href</label>
        <div className={styles.inlineFields}>
          <input
            id="home-secondary-href"
            type="text"
            value={home.secondaryCta.href}
            onChange={(e) => onSave({ secondaryCta: { ...home.secondaryCta, href: e.target.value } })}
          />
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Clear"
            onClick={() => onSave({ secondaryCta: { ...home.secondaryCta, href: '' } })}
          >
            ×
          </button>
        </div>
      </div>
      <div className={styles.fieldGroupFull}>
        <label htmlFor="home-hero-image">Hero image</label>
        <div className={styles.inlineFields}>
          <input
            id="home-hero-image"
            type="text"
            value={home.heroImage}
            onChange={(e) => onSave({ heroImage: e.target.value })}
            placeholder="/images/home/... or https://..."
          />
          <UploadButton
            label="Upload"
            scope="home"
            onUploaded={(path) => onSave({ heroImage: path })}
          />
          <button type="button" className={styles.iconButton} aria-label="Clear" onClick={() => onSave({ heroImage: '' })}>
            ×
          </button>
        </div>
      </div>
    </div>
  </div>
);

HomeEditor.propTypes = {
  home: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired
};

export default HomeEditor;
