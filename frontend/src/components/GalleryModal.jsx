import { useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/GalleryModal.module.css';
import { asset } from '../utils/asset.js';

const GalleryModal = ({ image, onClose }) => {
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  if (!image) {
    return null;
  }

  return (
    <div className={styles.backdrop} role="presentation" onClick={onClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label={image.alt || 'Project gallery image'}
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close gallery">
          ✕
        </button>
        <figure>
          <img src={asset(image.src)} alt={image.alt} />
          {image.alt ? <figcaption>{image.alt}</figcaption> : null}
        </figure>
      </div>
    </div>
  );
};

GalleryModal.propTypes = {
  image: PropTypes.shape({
    src: PropTypes.string.isRequired,
    alt: PropTypes.string
  }),
  onClose: PropTypes.func.isRequired
};

export default GalleryModal;
