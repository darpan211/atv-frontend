import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '@/components/common/Layout';
import CommonTable from '@/components/common/CommonTable';
import { toast, Bounce, ToastContainer } from 'react-toastify';

// import { fetchSeries, deleteSeries } from '@/redux/features/series/seriesThunks';
import { fetchSeries, deleteSeries } from '@/redux/slice/series/seriesThunks';
import DeleteConfirmationModal from '@/components/common/DeleteConfirmationModal';

const Series = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { list: seriesData, loading, error } = useSelector(state => state.series);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchSeries());
  }, [dispatch]);

  useEffect(() => {
    if (location.state?.toastMessage) {
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

  const handleDeleteClick = (item) => {
    setSelectedSeries(item);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
    if (!selectedSeries) return;
    setIsDeleting(true);
    
      await dispatch(deleteSeries(selectedSeries)).unwrap();
      await dispatch(fetchSeries());
      toast.success('Series deleted successfully!', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'light',
        transition: Bounce,
      });
    } catch (error) {
      toast.error('Failed to delete series.');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setSelectedSeries(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedSeries(null);
  };

  const handleEdit = item => {
    navigate(`/admin/series/edit/${item._id}`);
  };

  return (
    <Layout
      title="Series"
      buttonLabel="Add Series"
      onButtonClick={() => navigate('/admin/series/add')}
    >
      {/* <CommonTable type="series" data={seriesData} onEdit={handleEdit} onDelete={handleDelete} /> */}
    
      <CommonTable
        type="series"
        data={seriesData}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        loading={loading}
      />

      {showDeleteModal && (
        <DeleteConfirmationModal
          tile={{ description: 'This action cannot be undone. Do you want to continue?' }}
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          isLoading={isDeleting}
        />
      )}  
    
    </Layout>
  );
};

export default Series;
