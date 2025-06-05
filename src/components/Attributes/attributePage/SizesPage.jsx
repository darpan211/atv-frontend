import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '@/components/common/Layout';
import CommonTable from '@/components/common/CommonTable';
import { useDispatch, useSelector } from 'react-redux';
// import { fetchSizes, deleteSize } from '@/store/features/size/sizeThunks';
import { fetchSizes, deleteSize } from '@/redux/slice/sizes/sizeThunks';
import { toast, Bounce } from 'react-toastify';
import DeleteConfirmationModal from '@/components/common/DeleteConfirmationModal';

const SizesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { list: sizesData, loading, error } = useSelector(state => state.sizes);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchSizes());
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

    const handleDeleteClick = item => {
    setSelectedSize(item);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try{
    if (!selectedSize) return;
    setIsDeleting(true);

      await dispatch(deleteSize(selectedSize)).unwrap();
      await dispatch(fetchSizes());
      toast.success('Size deleted successfully!', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'light',
        transition: Bounce,
        className: 'bg-white rounded-md shadow-md border-2',
        style: { borderColor: '#6F4E37' },
        bodyClassName: 'text-[#6F4E37] font-semibold text-lg',
        progressStyle: { backgroundColor: '#6F4E37' },
      });
    } catch (err) {
      console.error('Error deleting size:', err);
      toast.error('Failed to delete size', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setSelectedSize(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedSize(null);
  };

  const handleEdit = item => {
    navigate(`/admin/sizes/edit/${item._id}`);
  };

  return (
    <Layout
      title="Sizes"
      buttonLabel="Add Sizes"
      onButtonClick={() => navigate('/admin/sizes/add')}
    >
      {/* <CommonTable
        type="sizes"
        data={sizesData}
        loading={loading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDelete}
      /> */}

      <CommonTable
        type="sizes"
        data={sizesData}
        loading={loading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
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

export default SizesPage;
