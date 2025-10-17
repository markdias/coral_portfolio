import PropTypes from 'prop-types';
import { useMemo } from 'react';
import styles from '../styles/WatermarkedImage.module.css';
import { useData } from '../store/DataContext.jsx';

const clamp = (value, min, max, fallback) => {
  const number = Number(value);
  if (Number.isNaN(number)) return fallback;
  return Math.min(Math.max(number, min), max);
};

const WatermarkedImage = ({
  src,
  alt,
  className = '',
  imgClassName = '',
  disableWatermark = false,
  ...imgProps
}) => {
  const { data } = useData();
  const settings = data?.settings || {};
  const watermarkText = (settings.watermarkText || '').trim();
  const watermarkEnabled = Boolean(settings.watermarkEnabled);
  const opacity = clamp(settings.watermarkOpacity, 0, 1, 0.08);
  const scale = clamp(settings.watermarkScale, 0.25, 4, 1);

  const shouldWatermark = watermarkEnabled && watermarkText && !disableWatermark;

  const patternId = useMemo(
    () => `wm-${Math.random().toString(36).slice(2, 10)}`,
    []
  );

  const tileSize = Math.round(240 * scale);
  const fontSize = Math.max(16, Math.round(36 * scale));
  const fillColor = `rgba(255, 255, 255, ${opacity})`;

  return (
    <div className={`${styles.wrapper} ${className}`.trim()} onContextMenu={(event) => event.preventDefault()}>
      <img
        className={`${styles.image} ${imgClassName}`.trim()}
        src={src}
        alt={alt}
        draggable={false}
        {...imgProps}
      />
      {shouldWatermark ? (
        <svg className={styles.watermark} aria-hidden="true" role="presentation">
          <defs>
            <pattern
              id={patternId}
              patternUnits="userSpaceOnUse"
              width={tileSize}
              height={tileSize}
            >
              <text
                x={tileSize / 2}
                y={tileSize / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={fillColor}
                fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif"
                fontSize={fontSize}
                fontWeight="600"
                transform={`rotate(-30 ${tileSize / 2} ${tileSize / 2})`}
                opacity={opacity}
              >
                {watermarkText}
              </text>
            </pattern>
          </defs>
          <rect fill={`url(#${patternId})`} width="100%" height="100%" />
        </svg>
      ) : null}
    </div>
  );
};

WatermarkedImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  className: PropTypes.string,
  imgClassName: PropTypes.string,
  disableWatermark: PropTypes.bool
};

export default WatermarkedImage;
