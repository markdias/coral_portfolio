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
    </div>
  </div>
);

SiteSettings.propTypes = {
  settings: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired
};

export default SiteSettings;
