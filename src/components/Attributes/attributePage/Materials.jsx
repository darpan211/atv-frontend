import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Layout from '@/components/common/Layout';
import CommonTable from '@/components/common/CommonTable';
// import { , deleteMaterial } from '@/store/slices/material/materialThunks';
import { fetchMaterials, deleteMaterial } from '@/redux/slice/material/materialThunks';
import { toast, Bounce } from 'react-toastify';
import DeleteConfirmationModal from '@/components/common/DeleteConfirmationModal';

const Materials = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { list: materials, loading } = useSelector(state => state.materials);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchMaterials());
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

      window.history.replaceState({}, document.title); // Clear navigation state
    }
  }, [location]);

    const handleDeleteClick = item => {
    setSelectedMaterial(item);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
      try {
      if (!selectedMaterial) return;
      setIsDeleting(true);

      await dispatch(deleteMaterial(selectedMaterial)).unwrap();
      await dispatch(fetchMaterials());
      toast.success('Material deleted successfully!', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'light',
        transition: Bounce,
        className: 'bg-white rounded-md shadow-md border-2',
        style: { borderColor: '#6F4E37' },
        bodyClassName: 'text-[#6F4E37] font-semibold text-lg',
        progressStyle: { backgroundColor: '#6F4E37' },
      });
    } catch (error) {
      toast.error('Failed to delete material.');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setSelectedMaterial(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedMaterial(null);
  };

  return (
    <Layout
      title="Materials"
      buttonLabel="Add Material"
      onButtonClick={() => navigate('/admin/materials/add')}
    >

      <CommonTable
        type="material"
        data={materials}
        loading={loading}
        onEdit={item => navigate(`/admin/materials/edit/${item._id}`, { state: item })}
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

export default Materials;
