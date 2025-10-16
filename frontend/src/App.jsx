import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Landing from './pages/Landing.jsx';
import ProjectDetail from './pages/ProjectDetail.jsx';
import Admin from './pages/Admin.jsx';
import styles from './styles/App.module.css';

const App = () => {
  const location = useLocation();
  const isDetailView = location.pathname.startsWith('/portfolio/') && location.pathname !== '/portfolio';

  return (
    <div className={styles.appShell}>
      <Header />
      <main className={`${styles.mainContent} ${isDetailView ? styles.detailView : ''}`.trim()}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<Landing />} />
          <Route path="/portfolio" element={<Landing />} />
          <Route path="/portfolio/:projectId" element={<ProjectDetail />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Landing />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
