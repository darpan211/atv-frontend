import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './hooks/AuthContext';
import 'react-toastify/dist/ReactToastify.css';

// Layout

// Auth & Dashboard Pages
import LoginPage from './pages/auth/LoginPage';
import Dashboard from './pages/Admin/Dashboard';

// Seller Pages
import AddNewSeller from './pages/Admin/AddNewSeller';
import SellersList from './pages/Admin/SellerList';
import SellerProfile from './components/seller/SellerProfile';

// Admin Pages
import AdminProfile from './components/admin/AdminProfile';

// Tile Visualizer
import TileVisualizer from './components/visualizer/Visualizer';

// Room Management
import Rooms from './components/admin/Rooms';
import RoomForm from './components/admin/RoomForm';

// Attribute Management (Category, Series, etc.)
import AdminHeader from './components/common/AdminHeader';
import CategoriesPage from './components/Attributes/attributePage/CategoriesPage';
import Series from './components/Attributes/attributePage/Series';
import Materials from './components/Attributes/attributePage/Materials';

import SizesPage from './components/Attributes/attributePage/SizesPage';
import ColorsPage from './components/Attributes/attributePage/ColorsPage';
import SuitablePlacePage from './components/Attributes/attributePage/SuitablePlacePage';
import AddCategoryPage from './components/Attributes/addAttribute/AddCategoryPage';
import AddMaterialPage from './components/Attributes/addAttribute/AddMaterialPage';
import AddSizePage from './components/Attributes/addAttribute/AddSizePage';
import AddColorPage from './components/Attributes/addAttribute/AddColorPage';
import AddPlacePage from './components/Attributes/addAttribute/AddPlacePage';
import AddSeriesPage from './components/Attributes/addAttribute/AddSeriesPage';

// Add Tiles
import AddTiles from './components/Tiles/AddTiles';
import AppLayout from './hooks/AppLayout';
import AuthSync from './hooks/AuthSync';

import AddNewAdmin from './pages/Admin/AddNewAdmin';
import AdminList from './pages/Admin/AdminList';

import FinishPage from './components/Attributes/attributePage/FinishPage';
import AddFinishPage from './components/Attributes/addAttribute/AddFinishPage';
import NotAuthorized from './components/common/NotAuthorized';
import { useDispatch } from 'react-redux';
import { fetchSidebarFilters } from './redux/slice/sidebarfilter/filterThunks';
import { fetchCategories } from './redux/slice/categories/categoryThunks';
import TileManagement from './components/Tiles/TilesManagement';

// ================== App Routes ==================
const App = () => {
  const dispatch = useDispatch();
  const isAuthenticated = localStorage.getItem('authToken') ? true : false;
  const isUser = localStorage.getItem('user') ? true : false;
  
  useEffect(() => {
    if (isAuthenticated && isUser) {
      dispatch(fetchSidebarFilters());
      dispatch(fetchCategories());
    }
  }, [dispatch]);
  return (
    <AuthProvider>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
        theme="light"
      />
      <AuthSync />
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
          path="/login"
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

        <Route
          path="/seller/dashboard"
          element={
            <AppLayout>
              <Dashboard />
            </AppLayout>
          }
        />

        <Route
          path="/admin/dashboard/create"
          element={
            <AppLayout>
              <AddNewAdmin />
            </AppLayout>
          }
        />

        <Route
          path="/admin/dashboard/:mode/:id?"
          element={
            <AppLayout>
              <AddNewAdmin />
            </AppLayout>
          }
        />

        <Route
          path="/admin/dashboard/list"
          element={
            <AppLayout>
              <AdminList />
            </AppLayout>
          }
        />
        {/* Admin */}
        <Route
          path="/admin/Profile"
          element={
            <AppLayout>
              <AdminProfile />
            </AppLayout>
          }
        />

        {/* Sellers */}
        <Route
          // path="/admin/seller/create"
          path="/admin/seller/:mode/:id?"
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

        <Route
          path="/seller/profile"
          element={
            <AppLayout>
              <SellerProfile />
            </AppLayout>
          }
        />

        {/* Rooms */}
        <Route
          path="/admin/room/list"
          element={
            <AppLayout>
              <Rooms />
            </AppLayout>
          }
        />
        <Route
          path="/admin/room/:mode"
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
        <Route
          path="/admin/finish"
          element={
            <AppLayout>
              <FinishPage />
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
        <Route
          path="/admin/finish/:mode/:id?"
          element={<AppLayout>{<AddFinishPage />}</AppLayout>}
        />

        {/* Add Tiles */}
        <Route
          path="/tiles/add"
          element={
            <AppLayout>
              <AddTiles />
            </AppLayout>
          }
        />

        {/* <Route
          path="/tiles/list/:slug?"
          element={
            <AppLayout>
              <HeaderTilesCart />
            </AppLayout>
          }
        /> */}
        <Route
          path="/tiles/list/:slug?"
          element={
            <AppLayout>
              <TileManagement />
            </AppLayout>
          }
        />
        <Route
          path="/not-authorized"
          element={
            <AppLayout>
              <NotAuthorized />
            </AppLayout>
          }
        />
      </Routes>
    </AuthProvider>
  );
};

export default App;
