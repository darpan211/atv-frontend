import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Layout from '@/components/common/Layout';
import DataTable from '@/components/common/DataTable';
import { fetchMaterials, deleteMaterial } from '@/redux/slice/material/materialThunks';
import { toast, Bounce } from 'react-toastify';
import DeleteConfirmationModal from '@/components/common/DeleteConfirmationModal';
import { DeleteIcon } from '@/components/common/icons/svgs/DeleteIcon';
import { EditIcon } from '@/components/common/icons/svgs/EditIcon';

const Materials = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { list: materials, loading } = useSelector(state => state.materials);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Define columns for DataTable
  const columns = [
    {
      header: 'Material Name',
      accessor: 'material', // Adjust this based on your material object structure
    },
    {
      header: 'Actions',
      className: 'w-32 text-center',
      cell: row => (
        <div className="btns flex gap-5 text-xl ml-4">
          <div
            className="cursor-pointer"
            onClick={() => navigate(`/admin/materials/edit/${row._id}`, { state: row })}
          >
            <EditIcon className="text-[#a98f7d]" />
          </div>
          <div className="cursor-pointer" onClick={() => handleDeleteClick(row._id)}>
            <DeleteIcon className="text-[#a98f7d] cursor-pointer" />
          </div>
        </div>
      ),
    },
  ];

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

  const handleDeleteClick = id => {
    setSelectedMaterial(id);
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

  const handleSearchInput = query => {
    setSearchQuery(query);
  };

  // Filter materials based on search query
  const filteredMaterials = useMemo(() => {
    const lower = searchQuery.toLowerCase();
    return materials?.filter(material => material?.material?.toLowerCase().includes(lower));
  }, [searchQuery, materials]);

  return (
    <Layout
      title="Materials"
      buttonLabel="Add Material"
      onButtonClick={() => navigate('/admin/materials/add')}
    >
      <DataTable
        data={filteredMaterials}
        columns={columns}
        onSearch={handleSearchInput}
        searchPlaceholder="Search material"
        addButtonText="Add Material"
        emptyStateMessage="No material found."
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

export default Materials;
