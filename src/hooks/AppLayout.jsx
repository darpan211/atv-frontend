import AdminHeader from '@/components/common/AdminHeader';
import Header from '@/components/common/Header';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

const AppLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isLoginPage = location.pathname === '/' || location.pathname === '/login';
  const authState = useSelector(state => state.auth);
  const user = authState?.user;
  const localUser = localStorage.getItem('user');
  const parseUser = JSON.parse(localUser);
  const isProtectedRoute = location.pathname.startsWith('/admin');
  const authToken = localStorage.getItem('authToken');

  useEffect(() => {
    if (!authToken && isProtectedRoute) {
      navigate('/', { replace: true });
    }
  }, [authToken, isProtectedRoute, navigate]);

  const userRole = user?.user?.role || parseUser?.role;
  const isAdmin = userRole === 'admin';

  return (
    <div className="min-h-screen flex flex-col">
      {!isLoginPage && (isAdmin ? <AdminHeader /> : <Header />)}
      <main className="flex-grow">{children}</main>
    </div>
  );
};

export default AppLayout;
