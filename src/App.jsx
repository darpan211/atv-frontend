import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './hooks/AuthContext';

// Layout
import Header from './components/common/Header';

// Auth & Dashboard Pages
import LoginPage from './pages/auth/LoginPage';
import Dashboard from './pages/Admin/Dashboard';

// Seller Pages
import AddNewSeller from './pages/Admin/AddNewSeller';
import SellersList from './pages/Admin/SellerList';

// Tile Visualizer
import TileVisualizer from './components/visualizer/Visualizer';

// Room Management
import Rooms from './components/admin/Rooms';
import RoomForm from './components/admin/RoomForm';

// Attribute Management (Category, Series, etc.)
import AttributePage from './components/Attributes/AttributePage';
import AddAttributePage from './components/Attributes/AddAttributePage';
import AdminHeader from './components/common/AdminHeader';

// Add Tiles
import MainAddTiles from './components/Tiles/MainAddTiles';
import HeaderTilesCart from './components/Tiles/HeaderTilesCart';
import TilesPreview from './components/Tiles/TilesPreview';

// ================== Layout Wrapper ==================
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

// ================== App Routes ==================
const App = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Login */}
        <Route
          path="/"
          element={
            <AppLayout>
              <LoginPage />
            </AppLayout>
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin/dashboard"
          element={
            <AppLayout>
              <Dashboard />
            </AppLayout>
          }
        />

        {/* Sellers */}
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

        {/* Rooms */}
        <Route
          path="/admin/addroom/list"
          element={
            <AppLayout>
              <Rooms />
            </AppLayout>
          }
        />
        <Route
          path="/admin/roomform"
          element={
            <AppLayout>
              <RoomForm />
            </AppLayout>
          }
        />

        {/* Visualizer - no layout */}
        <Route path="/tiles/visualizer" element={<TileVisualizer />} />

        {/* Attribute Pages (List) */}
        <Route
          path="/admin/categories"
          element={
            <AppLayout>
              <AttributePage />
            </AppLayout>
          }
        />
        <Route
          path="/admin/series"
          element={
            <AppLayout>
              <AttributePage />
            </AppLayout>
          }
        />
        <Route
          path="/admin/materials"
          element={
            <AppLayout>
              <AttributePage />
            </AppLayout>
          }
        />
        <Route
          path="/admin/sizes"
          element={
            <AppLayout>
              <AttributePage />
            </AppLayout>
          }
        />
        <Route
          path="/admin/colors"
          element={
            <AppLayout>
              <AttributePage />
            </AppLayout>
          }
        />
        <Route
          path="/admin/places"
          element={
            <AppLayout>
              <AttributePage />
            </AppLayout>
          }
        />

        {/* Attribute Pages (Add Form) */}
        <Route
          path="/admin/categories/add"
          element={
            <AppLayout>
              <AddAttributePage />
            </AppLayout>
          }
        />
        <Route
          path="/admin/series/add"
          element={
            <AppLayout>
              <AddAttributePage />
            </AppLayout>
          }
        />
        <Route
          path="/admin/materials/add"
          element={
            <AppLayout>
              <AddAttributePage />
            </AppLayout>
          }
        />
        <Route
          path="/admin/sizes/add"
          element={
            <AppLayout>
              <AddAttributePage />
            </AppLayout>
          }
        />
        <Route
          path="/admin/colors/add"
          element={
            <AppLayout>
              <AddAttributePage />
            </AppLayout>
          }
        />
        <Route
          path="/admin/places/add"
          element={
            <AppLayout>
              <AddAttributePage />
            </AppLayout>
          }
        />

        {/* Add Tiles */}
        <Route
          path="/admin/tiles/add"
          element={
            <AppLayout>
              <MainAddTiles />
            </AppLayout>
          }
        />

        <Route
          path="/admin/tiles/list"
          element={
            <AppLayout>
              <HeaderTilesCart />
            </AppLayout>
          }
        />
        
      </Routes>
    </AuthProvider>
  );
};

export default App;
