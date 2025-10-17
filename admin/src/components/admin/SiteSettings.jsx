import PropTypes from 'prop-types';
import styles from '../../styles/Admin.module.css';
import UploadButton from './UploadButton.jsx';
import PublishButton from './PublishButton.jsx';

const SiteSettings = ({ settings, onSave }) => (
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
        <label htmlFor="watermark-enabled">Watermark overlay</label>
        <label className={styles.checkboxRow} htmlFor="watermark-enabled">
          <input
            id="watermark-enabled"
            type="checkbox"
            checked={Boolean(settings.watermarkEnabled)}
            onChange={(e) => onSave({ watermarkEnabled: e.target.checked })}
          />
          <span>Protect images with a text watermark</span>
        </label>
      </div>

      <div className={styles.fieldGroupFull}>
        <label htmlFor="watermark-text">Watermark text</label>
        <div className={styles.inlineFields}>
          <input
            id="watermark-text"
            type="text"
            value={settings.watermarkText || ''}
            onChange={(e) => onSave({ watermarkText: e.target.value })}
            placeholder="e.g., coraldias.co.uk"
          />
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Clear watermark text"
            onClick={() => onSave({ watermarkText: '' })}
          >
            ×
          </button>
        </div>
        <p className={styles.note}>Displayed diagonally across every portfolio image on the public site.</p>
      </div>

      <div className={styles.fieldGroupFull}>
        <label htmlFor="watermark-scale">Watermark size</label>
        <div className={styles.rangeRow}>
          <input
            id="watermark-scale"
            type="range"
            min="0.3"
            max="3"
            step="0.1"
            value={Number(settings.watermarkScale ?? 1)}
            onChange={(e) => onSave({ watermarkScale: Number(e.target.value) })}
          />
          <span className={styles.rangeValue}>{Number(settings.watermarkScale ?? 1).toFixed(1)}×</span>
        </div>
        <p className={styles.note}>Adjusts how large the watermark text appears relative to the image.</p>
      </div>

      <div className={styles.fieldGroupFull}>
        <label htmlFor="watermark-opacity">Watermark opacity</label>
        <div className={styles.rangeRow}>
          <input
            id="watermark-opacity"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={Number(settings.watermarkOpacity ?? 0.12)}
            onChange={(e) => onSave({ watermarkOpacity: Number(e.target.value) })}
          />
          <span className={styles.rangeValue}>{Number(settings.watermarkOpacity ?? 0.12).toFixed(2)}</span>
        </div>
        <p className={styles.note}>Lower values keep the watermark subtle while remaining visible in screenshots.</p>
      </div>
    </div>
  </div>
);

SiteSettings.propTypes = {
  settings: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired
};

export default SiteSettings;
