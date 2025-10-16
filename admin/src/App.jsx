import { Routes, Route } from 'react-router-dom';
import AdminLogin from './components/admin/AdminLogin.jsx';
import AdminPanel from './components/admin/AdminPanel.jsx';
import { useData } from './store/DataContext.jsx';

const App = () => {
  const { isAuthenticated } = useData();
  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <AdminPanel /> : <AdminLogin />} />
      <Route path="*" element={isAuthenticated ? <AdminPanel /> : <AdminLogin />} />
    </Routes>
  );
};

export default App;

