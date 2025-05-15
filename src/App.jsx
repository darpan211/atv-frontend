import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import Dashboard from './pages/Admin/Dashboard';
import AddNewSeller from './pages/Admin/AddNewSeller';
import Header from './components/common/Header';
import { AuthProvider } from './hooks/AuthContext';
import SellersList from './pages/Admin/SellerList';

// Layout component that conditionally renders the header
const AppLayout = ({ children }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/' || location.pathname === '/login';

  return (
    <div className="min-h-screen flex flex-col">
      {!isLoginPage && <Header />}
      <main className="flex-grow">{children}</main>
    </div>
  );
};

// App component with routes
const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route
          path="/"
          element={
            <AppLayout>
              <LoginPage />
            </AppLayout>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <AppLayout>
              <Dashboard />
            </AppLayout>
          }
        />

        <Route
          path="/admin/seller/create"
          element={
            <AppLayout>
              <AddNewSeller />
            </AppLayout>
          }
        />
        <Route
          path="/admin/seller/list"
          element={
            <AppLayout>
              <SellersList />
            </AppLayout>
          }
        />

        {/* Add more routes as needed */}
      </Routes>
    </AuthProvider>
  );
};

export default App;
