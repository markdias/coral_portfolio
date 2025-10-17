import PropTypes from 'prop-types';
import styles from '../../styles/Admin.module.css';
import UploadButton from './UploadButton.jsx';
import PublishButton from './PublishButton.jsx';

const normalizeNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const SiteSettings = ({ settings, onSave }) => {
  const scaleValue = normalizeNumber(settings.watermarkScale, 1);
  const opacityValue = normalizeNumber(settings.watermarkOpacity, 0.08);

  return (
    <div className={styles.panelCard}>
    <h2 className={styles.panelTitle}>Site settings</h2>
    <div className={styles.buttonRow}>
      <PublishButton label="Publish site settings" />
    </div>
    <div className={styles.fieldGrid}>
      <div className={styles.fieldGroup}>
        <label htmlFor="site-title">Site name</label>
        <div className={styles.inlineFields}>
          <input
            id="site-title"
            type="text"
            value={settings.siteTitle || ''}
            onChange={(e) => onSave({ siteTitle: e.target.value })}
            placeholder="e.g., Coral Dias"
          />
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Clear"
            onClick={() => onSave({ siteTitle: '' })}
          >
            ×
          </button>
        </div>
      </div>

      <div className={styles.fieldGroupFull}>
        <label htmlFor="site-logo">Logo</label>
        <div className={styles.inlineFields}>
          <input
            id="site-logo"
            type="text"
            value={settings.logo || ''}
            onChange={(e) => onSave({ logo: e.target.value })}
            placeholder="/images/home/logo.png or https://..."
          />
          <UploadButton
            label="Upload"
            scope="home"
            disableWatermark
            onUploaded={(path) => onSave({ logo: path })}
          />
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Clear"
            onClick={() => onSave({ logo: '' })}
          >
            ×
          </button>
        </div>
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="watermark-enabled">Image watermark</label>
        <div className={styles.checkboxRow}>
          <input
            id="watermark-enabled"
            type="checkbox"
            checked={Boolean(settings.watermarkEnabled)}
            onChange={(event) => onSave({ watermarkEnabled: event.target.checked })}
          />
          <span>Apply watermark to uploaded images</span>
        </div>
      </div>

      <div className={styles.fieldGroupFull}>
        <label htmlFor="watermark-text">Watermark text</label>
        <div className={styles.inlineFields}>
          <input
            id="watermark-text"
            type="text"
            value={settings.watermarkText || ''}
            onChange={(event) => onSave({ watermarkText: event.target.value })}
            placeholder="Studio name or URL"
          />
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Clear"
            onClick={() => onSave({ watermarkText: '' })}
          >
            ×
          </button>
        </div>
        <p className={styles.fieldHint}>Leave blank to disable watermarking text.</p>
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="watermark-scale">Watermark size</label>
        <input
          id="watermark-scale"
          type="number"
          min="0.25"
          max="4"
          step="0.1"
          value={scaleValue}
          onChange={(event) => {
            const next = Number(event.target.value);
            onSave({ watermarkScale: Number.isFinite(next) ? next : 1 });
          }}
        />
        <p className={styles.fieldHint}>Adjusts the relative size of the watermark text.</p>
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="watermark-opacity">Watermark opacity</label>
        <input
          id="watermark-opacity"
          type="number"
          min="0"
          max="1"
          step="0.01"
          value={opacityValue}
          onChange={(event) => {
            const next = Number(event.target.value);
            onSave({ watermarkOpacity: Number.isFinite(next) ? next : opacityValue });
          }}
        />
        <p className={styles.fieldHint}>Use lower values (e.g. 0.05) for subtle protection.</p>
      </div>
    </div>
    </div>
  );
};

SiteSettings.propTypes = {
  settings: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired
};

export default SiteSettings;
