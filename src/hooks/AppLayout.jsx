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
  const parseUser = JSON.parse(localUser);
  const isProtectedRoute = location.pathname.startsWith('/admin');
  const authToken = localStorage.getItem('authToken');

  useEffect(() => {
    if (!authToken && isProtectedRoute) {
      navigate('/', { replace: true });
    }
  }, [authToken, isProtectedRoute, navigate]);

  const userRole = user?.user?.role || parseUser?.role;

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
    <div className="min-h-screen flex flex-col overflow-auto">
      {/* Render header based on user role */}
      {renderHeader()}
      {/* Main content area */}
      <main className="flex-grow">{children}</main>
    </div>
  );
};

export default AppLayout;
