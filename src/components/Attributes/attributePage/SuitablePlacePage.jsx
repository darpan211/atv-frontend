import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast, Bounce } from 'react-toastify';
import { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';

import {
  fetchSuitablePlaces,
  deleteSuitablePlace,
} from '@/redux/slice/suitablePlace/suitablePlaceThunks';
import { clearSuitablePlacesState } from '@/redux/slice/suitablePlace/suitablePlaceSlice';

import Layout from '@/components/common/Layout';
import CommonTable from '@/components/common/CommonTable';
import DeleteConfirmationModal from '@/components/common/DeleteConfirmationModal';

const SuitablePlacePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const suitablePlaceState = useSelector((state) => state.suitablePlace);
  const places = suitablePlaceState?.list || [];
  const loading = suitablePlaceState?.loading || false;
  const error = suitablePlaceState?.error || null;

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Show toast from location state
  useEffect(() => {
    if (location.state?.toastMessage) {
      // console.log("Suitable Place Location State:", location.state);
      toast.success(location.state.toastMessage, {
        position: 'top-right',
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'light',
        transition: Bounce,
        className: 'bg-white rounded-md shadow-md border-2',
        style: { borderColor: '#6F4E37' },
        bodyClassName: 'text-[#6F4E37] font-semibold text-lg',
        progressStyle: { backgroundColor: '#6F4E37' },
      });
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Fetch places on mount
  useEffect(() => {
    dispatch(fetchSuitablePlaces());
    return () => {
      dispatch(clearSuitablePlacesState());
    };
  }, [dispatch]);

  // Show error toast if loading failed
  useEffect(() => {
    if (error) {
      toast.error('Failed to load suitable places.', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'light',
      });
    }
  }, [error]);

  const handleDeleteClick = (item) => {
    setSelectedPlace(item);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (!selectedPlace) return;

      setIsDeleting(true);
      await dispatch(deleteSuitablePlace(selectedPlace)).unwrap();
      await dispatch(fetchSuitablePlaces());

      toast.success('Place deleted successfully!', {
        position: 'top-right',
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'light',
        transition: Bounce,
        className: 'bg-white rounded-md shadow-md border-2',
        style: { borderColor: '#6F4E37' },
        bodyClassName: 'text-[#6F4E37] font-semibold text-lg',
        progressStyle: { backgroundColor: '#6F4E37' },
      });
    } catch {
      toast.error('Failed to delete place.', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'light',
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setSelectedPlace(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedPlace(null);
  };

  if (loading) return <div className="p-4 text-center">Loading...</div>;

  return (
    <Layout
      title="Suitable Places"
      buttonLabel="Add Suitable Place"
      onButtonClick={() => navigate('/admin/places/add')}
    >
      <CommonTable
        type="suitablePlace"
        data={places}
        onEdit={(item) =>
          navigate(`/admin/places/edit/${item._id}`, { state: item })
        }
        onDelete={handleDeleteClick}
      />

      {showDeleteModal && (
        <DeleteConfirmationModal
          tile={{
            description: 'This action cannot be undone. Do you want to continue?',
          }}
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          isLoading={isDeleting}
        />
      )}
    </Layout>
  );
};

export default SuitablePlacePage;