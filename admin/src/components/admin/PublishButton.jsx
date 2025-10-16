import PropTypes from 'prop-types';
import { useState } from 'react';
import { useData } from '../../store/DataContext.jsx';
import styles from '../../styles/Admin.module.css';

const PublishButton = ({ label = 'Publish' }) => {
  const { publishToFrontend } = useData();
  const [msg, setMsg] = useState('');

  const handleClick = async () => {
    setMsg('');
    const res = await publishToFrontend();
    if (res.success) setMsg('Published');
    else setMsg(res.message || 'Publish failed');
    setTimeout(() => setMsg(''), 2500);
  };

  return (
    <>
      <button type="button" className={styles.primaryButton} onClick={handleClick}>
        <span className={styles.buttonIcon}>⤴</span> {label}
      </button>
      {msg ? <span className={styles.note}>{msg}</span> : null}
    </>
  );
};

PublishButton.propTypes = {
  label: PropTypes.string
};

export default PublishButton;
