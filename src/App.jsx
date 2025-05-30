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
// import AttributePage from './components/Attributes/AttributePage';
// import AddAttributePage from './components/Attributes/AddAttributePage';
import AdminHeader from './components/common/AdminHeader';
import CategoriesPage from './pages/AttributePage/CategoriesPage';
import Series from './pages/AttributePage/Series';
import Materials from './pages/AttributePage/Materials';
import SizesPage from './pages/AttributePage/SizesPage';
import ColorsPage from './pages/AttributePage/ColorsPage';
import SuitablePlacePage from './pages/AttributePage/SuitablePlacePage';
import AddCategoryPage from './components/Attributes/addAttribute/AddCategoryPage';
import AddMaterialPage from './components/Attributes/addAttribute/AddMaterialPage';
import AddSizePage from './components/Attributes/addAttribute/AddSizePage';
import AddColorPage from './components/Attributes/addAttribute/AddColorPage';
import AddPlacePage from './components/Attributes/addAttribute/AddPlacePage';
import AddSeriesPage from './components/Attributes/addAttribute/AddSeriesPage';

// Add Tiles 
import MainAddTiles from "./components/Tiles/MainAddTiles"
import HeaderTilesCart from "./components/Tiles/HeaderTilesCart"


// ================== Layout Wrapper ==================
const AppLayout = ({ children }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/' || location.pathname === '/login';

  return (
    <div className="min-h-screen flex flex-col">
      {!isLoginPage && <AdminHeader />}

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
              <CategoriesPage />
            </AppLayout>
          }
        />
        <Route
          path="/admin/series"
          element={
            <AppLayout>
              <Series />
            </AppLayout>
          }
        />
        <Route
          path="/admin/materials"
          element={
            <AppLayout>
              <Materials />
            </AppLayout>
          }
        />
        <Route
          path="/admin/sizes"
          element={
            <AppLayout>
              <SizesPage />
            </AppLayout>
          }
        />
        <Route
          path="/admin/colors"
          element={
            <AppLayout>
              <ColorsPage />
            </AppLayout>
          }
        />
        <Route
          path="/admin/places"
          element={
            <AppLayout>
              <SuitablePlacePage />
            </AppLayout>
          }
        />

        {/* Attribute Pages (Add Form) */}
        <Route
          path="/admin/categories/:mode/:id?"
          element={<AppLayout>{<AddCategoryPage />}</AppLayout>}
        />
        <Route
          path="/admin/series/:mode/:id?"
          element={<AppLayout>{<AddSeriesPage />}</AppLayout>}
        />
        <Route
          path="/admin/materials/:mode/:id?"
          element={<AppLayout>{<AddMaterialPage />}</AppLayout>}
        />
        <Route path="/admin/sizes/:mode/:id?" element={<AppLayout>{<AddSizePage />}</AppLayout>} />
        <Route
          path="/admin/colors/:mode/:id?"
          element={<AppLayout>{<AddColorPage />}</AppLayout>}
        />
        <Route
          path="/admin/places/:mode/:id?"
          element={<AppLayout>{<AddPlacePage />}</AppLayout>}
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
