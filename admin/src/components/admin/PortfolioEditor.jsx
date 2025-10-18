import PropTypes from 'prop-types';
import styles from '../../styles/Admin.module.css';
import PublishButton from './PublishButton.jsx';

const PortfolioEditor = ({ portfolio, onSave }) => (
  <div className={styles.panelCard}>
    <div className={`${styles.buttonRow} ${styles.panelToolbar}`}>
      <PublishButton label="Publish portfolio" />
    </div>
    <h2 className={styles.panelTitle}>Portfolio</h2>
    <div className={styles.fieldGrid}>
      <div className={styles.fieldGroup}>
        <label htmlFor="portfolio-intro-title">Intro title</label>
        <div className={styles.inlineFields}>
          <input
            id="portfolio-intro-title"
            type="text"
            value={portfolio.introTitle}
            onChange={(e) => onSave({ introTitle: e.target.value })}
          />
          <button type="button" className={styles.iconButton} aria-label="Clear" onClick={() => onSave({ introTitle: '' })}>
            ×
          </button>
        </div>
      </div>
      <div className={styles.fieldGroupFull}>
        <label htmlFor="portfolio-intro-description">Intro description</label>
        <div className={styles.inlineFields}>
          <textarea
            id="portfolio-intro-description"
            rows={3}
            value={portfolio.introDescription}
            onChange={(e) => onSave({ introDescription: e.target.value })}
          />
          <button type="button" className={styles.iconButton} aria-label="Clear" onClick={() => onSave({ introDescription: '' })}>
            ×
          </button>
        </div>
      </div>
      <div className={styles.fieldGroup}>
        <label htmlFor="portfolio-filters-label">Filters label</label>
        <div className={styles.inlineFields}>
          <input
            id="portfolio-filters-label"
            type="text"
            value={portfolio.filtersLabel}
            onChange={(e) => onSave({ filtersLabel: e.target.value })}
          />
          <button type="button" className={styles.iconButton} aria-label="Clear" onClick={() => onSave({ filtersLabel: '' })}>
            ×
          </button>
        </div>
      </div>
    </div>
  </div>
);

PortfolioEditor.propTypes = {
  portfolio: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired
};

export default PortfolioEditor;
