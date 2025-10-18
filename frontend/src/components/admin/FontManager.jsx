import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import styles from '../../styles/Admin.module.css';
import { FONT_OPTIONS, getFontLabel, getFontFamily } from '../../utils/typography.js';

const SECTION_OPTIONS = [
  { key: 'home', label: 'Home' },
  { key: 'about', label: 'About' },
  { key: 'portfolio', label: 'Portfolio' },
  { key: 'contact', label: 'Contact' }
];

const FontManager = ({ typography, onApply }) => {
  const [selectedFont, setSelectedFont] = useState(FONT_OPTIONS[0].value);
  const [selectedSections, setSelectedSections] = useState(() => new Set());

  const previewFamily = useMemo(() => getFontFamily(selectedFont), [selectedFont]);

  const toggleSection = (sectionKey) => {
    setSelectedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionKey)) {
        next.delete(sectionKey);
      } else {
        next.add(sectionKey);
      }
      return next;
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!selectedSections.size) return;
    const updates = {};
    selectedSections.forEach((section) => {
      updates[section] = selectedFont;
    });
    onApply(updates);
    setSelectedSections(new Set());
  };

  return (
    <div className={styles.panelCard} aria-live="polite">
      <form className={styles.fontToolbar} onSubmit={handleSubmit}>
        <div className={styles.fontToolbarRow}>
          <div className={styles.fieldGroup} style={{ flex: 1 }}>
            <label htmlFor="font-toolbar-select">Font selector</label>
            <select
              id="font-toolbar-select"
              value={selectedFont}
              onChange={(event) => setSelectedFont(event.target.value)}
            >
              {FONT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.fontPreview}>
            <span className={styles.fontPreviewLabel}>Preview</span>
            <span className={styles.fontPreviewSample} style={{ fontFamily: previewFamily }}>
              The quick coral print
            </span>
          </div>
        </div>
        <fieldset className={styles.fontSections}>
          <legend>Apply font to sections</legend>
          {SECTION_OPTIONS.map((section) => {
            const isChecked = selectedSections.has(section.key);
            const currentFontLabel = getFontLabel(typography?.[section.key]);
            return (
              <label key={section.key} className={styles.fontSectionOption}>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleSection(section.key)}
                />
                <span className={styles.fontSectionCopy}>
                  <span className={styles.fontSectionName}>{section.label}</span>
                  <span className={styles.fontSectionCurrent}>Current: {currentFontLabel}</span>
                </span>
              </label>
            );
          })}
        </fieldset>
        <div className={styles.buttonRow}>
          <button type="submit" className={styles.primaryButton} disabled={!selectedSections.size}>
            Save font selection
          </button>
        </div>
      </form>
    </div>
  );
};

FontManager.propTypes = {
  typography: PropTypes.object,
  onApply: PropTypes.func.isRequired
};

FontManager.defaultProps = {
  typography: {}
};

export default FontManager;

