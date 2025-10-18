import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import styles from '../../styles/Admin.module.css';
import {
  FONT_OPTIONS,
  buildFontTargets,
  getFontLabel,
  getFontOptionByValue
} from '../../utils/typography.js';

const flattenTargets = (targets) =>
  targets.flatMap((section) => section.fields.map((field) => field.key));

const FontManager = ({ data, typography, onApply }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedFont, setSelectedFont] = useState(FONT_OPTIONS[0].value);
  const [selectedKeys, setSelectedKeys] = useState(() => new Set());

  const targets = useMemo(() => buildFontTargets(data), [data]);
  const selectableKeys = useMemo(() => new Set(flattenTargets(targets)), [targets]);

  useEffect(() => {
    setSelectedKeys((prev) => {
      const next = new Set();
      prev.forEach((key) => {
        if (selectableKeys.has(key)) {
          next.add(key);
        }
      });
      return next;
    });
  }, [selectableKeys]);

  const selectedFontOption = useMemo(
    () => getFontOptionByValue(selectedFont) ?? FONT_OPTIONS[0],
    [selectedFont]
  );

  const toggleKey = (key) => {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!selectedKeys.size) return;

    const updates = {};
    selectedKeys.forEach((key) => {
      updates[key] = selectedFont;
    });

    onApply(updates);
    setSelectedKeys(new Set());
  };

  if (!targets.length) {
    return null;
  }

  const toggleExpanded = () => setIsExpanded((prev) => !prev);

  return (
    <div className={styles.panelCard} aria-live="polite">
      <div className={styles.fontToolbarHeader}>
        <div className={styles.fontToolbarIntro}>
          <h2 className={styles.panelTitle}>Typography manager</h2>
          <p className={styles.fontToolbarHint}>
            Select a font and apply it to individual text inputs across each section.
          </p>
        </div>
        <button
          type="button"
          className={styles.secondaryButton}
          onClick={toggleExpanded}
          aria-expanded={isExpanded}
          aria-controls="font-toolbar-panel"
        >
          {isExpanded ? 'Hide font tools' : 'Show font tools'}
        </button>
      </div>

      {isExpanded ? (
        <form id="font-toolbar-panel" className={styles.fontToolbar} onSubmit={handleSubmit}>
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
            <span className={styles.fontPreviewSample} style={{ fontFamily: selectedFontOption.family }}>
              The quick coral print
            </span>
          </div>
          <button type="submit" className={styles.primaryButton} disabled={!selectedKeys.size}>
            Save font selection
          </button>
        </div>

        <div className={styles.fontSectionsGrid}>
          {targets.map((section) => (
            <fieldset key={section.key} className={styles.fontSectionGroup}>
              <legend>{section.label}</legend>
              <ul className={styles.fontFieldList}>
                {section.fields.map((field) => {
                  const isChecked = selectedKeys.has(field.key);
                  const currentFontLabel = getFontLabel(typography?.[field.key]);

                  return (
                    <li key={field.key}>
                      <label className={styles.fontFieldOption}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleKey(field.key)}
                        />
                        <span className={styles.fontFieldCopy}>
                          <span className={styles.fontFieldLabel}>{field.label}</span>
                          {field.hint ? <span className={styles.fontFieldHint}>{field.hint}</span> : null}
                          <span className={styles.fontFieldCurrent}>Current: {currentFontLabel}</span>
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </fieldset>
          ))}
        </div>
      </form>
      ) : null}
    </div>
  );
};

FontManager.propTypes = {
  data: PropTypes.object.isRequired,
  typography: PropTypes.object,
  onApply: PropTypes.func.isRequired
};

FontManager.defaultProps = {
  typography: {}
};

export default FontManager;
