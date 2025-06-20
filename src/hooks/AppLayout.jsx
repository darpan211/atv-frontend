import AdminHeader from '@/components/common/AdminHeader';
import Header from '@/components/common/Header';
import SellerHeader from '@/components/common/SellerHeader';
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
  const parseUser = localUser ? JSON.parse(localUser) : null;
  const authToken = localStorage.getItem('authToken');

  const userRole = user?.user?.role || parseUser?.role;

  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    // Redirect if no token
    if (!authToken) {
      navigate('/', { replace: true });
    }

    // Redirect if trying to access /admin routes as non-admin
    if (isAdminRoute && userRole !== 'admin') {
      navigate('/not-authorized', { replace: true });
    }
  }, [authToken, navigate, isAdminRoute, userRole]);

  const renderHeader = () => {
    if (isLoginPage) return null;

    switch (userRole) {
      case 'admin':
        return <AdminHeader />;
      case 'seller':
        return <SellerHeader />;
      default:
        return <Header />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {renderHeader()}
      <main className="flex-grow">{children}</main>
    </div>
  );
};

export default AppLayout;
