import PropTypes from 'prop-types';
import styles from '../../styles/Admin.module.css';
import { useData } from '../../store/DataContext.jsx';

const UploadButton = ({ label = 'Upload', scope, parentId, onUploaded, disableWatermark = false }) => {
  const inputId = `file-input-${scope}-${parentId || 'root'}-${Math.random().toString(36).slice(2, 6)}`;
  const { data } = useData();

  const handleFiles = async (file) => {
    if (!file) return;
    const params = new URLSearchParams();
    if (scope) params.set('scope', scope);
    if (parentId) params.set('parentId', parentId);

    const form = new FormData();
    form.append('file', file);

    const watermarkPayload = {
      enabled: !disableWatermark && Boolean(data?.settings?.watermarkEnabled),
      text: (data?.settings?.watermarkText || '').trim(),
      opacity: data?.settings?.watermarkOpacity,
      scale: data?.settings?.watermarkScale
    };

    form.append('watermark', JSON.stringify(watermarkPayload));

    try {
      const res = await fetch(`/api/media/upload?${params.toString()}`, {
        method: 'POST',
        headers: { 'x-admin-password': import.meta.env.VITE_ADMIN_PASSWORD || '' },
        body: form
      });
      if (!res.ok) throw new Error(await res.text());
      const payload = await res.json();
      if (payload?.path) onUploaded(payload.path);
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert(`Upload failed: ${err.message || err}`);
    }
  };

  return (
    <>
      <input
        id={inputId}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          handleFiles(f);
          e.currentTarget.value = '';
        }}
      />
      <button
        type="button"
        className={styles.iconButtonSmall}
        aria-label={label}
        title={label}
        onClick={() => document.getElementById(inputId)?.click()}
      >
        ⬆
      </button>
    </>
  );
};

UploadButton.propTypes = {
  label: PropTypes.string,
  scope: PropTypes.oneOf(['projects', 'collections', 'home', 'about', 'portfolio']).isRequired,
  parentId: PropTypes.string,
  onUploaded: PropTypes.func.isRequired,
  disableWatermark: PropTypes.bool
};

export default UploadButton;
