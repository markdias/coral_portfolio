import AdminLogin from '../components/admin/AdminLogin.jsx';
import AdminPanel from '../components/admin/AdminPanel.jsx';
import { useData } from '../store/DataContext.jsx';

const Admin = () => {
  const { isAuthenticated } = useData();
  return isAuthenticated ? <AdminPanel /> : <AdminLogin />;
};

export default Admin;
