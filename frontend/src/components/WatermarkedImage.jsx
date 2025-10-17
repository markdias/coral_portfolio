import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useData } from '../store/DataContext.jsx';
import { asset } from '../utils/asset.js';
import styles from '../styles/WatermarkedImage.module.css';

const clampNumber = (value, min, max, fallback) => {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return fallback;
  return Math.min(Math.max(parsed, min), max);
};

const WatermarkedImage = ({
  src,
  alt,
  className,
  imgClassName,
  disableWatermark = false,
  loading,
  ...rest
}) => {
  const { data } = useData();
  const settings = data?.settings || {};
  const watermarkText = (settings.watermarkText || '').trim();
  const watermarkEnabled = Boolean(settings.watermarkEnabled);
  const opacity = clampNumber(settings.watermarkOpacity, 0, 1, 0.12);
  const scale = clampNumber(settings.watermarkScale, 0.3, 4, 1);

  const shouldShowWatermark = !disableWatermark && watermarkEnabled && watermarkText;

  return (
    <span
      className={clsx(styles.container, className)}
      onContextMenu={(event) => event.preventDefault()}
      {...rest}
    >
      <img
        src={asset(src)}
        alt={alt}
        className={clsx(styles.image, imgClassName)}
        loading={loading}
      />
      {shouldShowWatermark ? (
        <span
          className={styles.overlay}
          aria-hidden="true"
          style={{ opacity, '--watermark-scale': scale }}
        >
          <span className={styles.overlayContent}>
            <span>{watermarkText}</span>
            <span>{watermarkText}</span>
            <span>{watermarkText}</span>
          </span>
        </span>
      ) : null}
    </span>
  );
};

WatermarkedImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  className: PropTypes.string,
  imgClassName: PropTypes.string,
  disableWatermark: PropTypes.bool,
  loading: PropTypes.oneOf(['eager', 'lazy'])
};

export default WatermarkedImage;
