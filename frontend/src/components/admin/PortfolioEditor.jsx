import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from '../../styles/Admin.module.css';

const PortfolioEditor = ({ portfolio, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [filtersLabel, setFiltersLabel] = useState('');

  useEffect(() => {
    setTitle(portfolio.introTitle ?? '');
    setDescription(portfolio.introDescription ?? '');
    setFiltersLabel(portfolio.filtersLabel ?? 'Collections');
  }, [portfolio]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({
      introTitle: title.trim(),
      introDescription: description.trim(),
      filtersLabel: filtersLabel.trim()
    });
  };

  return (
    <div className={styles.panelCard}>
      <h2 className={styles.panelTitle}>Portfolio introduction</h2>
      <p className={styles.panelDescription}>
        Curate the copy that frames the portfolio page and the label shown above the collection filters.
      </p>
      <form className={styles.fieldGrid} onSubmit={handleSubmit}>
        <div className={styles.fieldGroup}>
          <label htmlFor="portfolio-title">Title</label>
          <input
            id="portfolio-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Portfolio"
          />
        </div>
        <div className={styles.fieldGroup}>
          <label htmlFor="portfolio-description">Description</label>
          <textarea
            id="portfolio-description"
            rows={4}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Introduce the work and its focus"
          />
        </div>
        <div className={styles.fieldGroup}>
          <label htmlFor="portfolio-filter-label">Filters label</label>
          <input
            id="portfolio-filter-label"
            value={filtersLabel}
            onChange={(event) => setFiltersLabel(event.target.value)}
            placeholder="Collections"
          />
        </div>
        <div className={styles.buttonRow}>
          <button type="submit" className={styles.primaryButton}>
            Save portfolio intro
          </button>
        </div>
      </form>
    </div>
  );
};

PortfolioEditor.propTypes = {
  portfolio: PropTypes.shape({
    introTitle: PropTypes.string,
    introDescription: PropTypes.string,
    filtersLabel: PropTypes.string
  }).isRequired,
  onSave: PropTypes.func.isRequired
};

export default PortfolioEditor;
