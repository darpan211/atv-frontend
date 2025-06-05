import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '@/components/common/Layout';
import DataTable from '@/components/common/DataTable';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSizes, deleteSize } from '@/redux/slice/sizes/sizeThunks';
import { toast, Bounce } from 'react-toastify';
import DeleteConfirmationModal from '@/components/common/DeleteConfirmationModal';
import { DeleteIcon } from '@/components/common/icons/svgs/DeleteIcon';
import { EditIcon } from '@/components/common/icons/svgs/EditIcon';

const SizesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { list: sizesData, loading, error } = useSelector(state => state.sizes);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const columns = [
    {
      header: 'Size',
      accessor: 'sizes',
    },
    {
      header: 'Actions',
      className: 'w-32 text-center',
      cell: row => (
        <div className="btns flex gap-5 text-xl ml-4">
          <div className="cursor-pointer" onClick={() => handleEdit(row)}>
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
    try {
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

  const handleSearchInput = query => {
    setSearchQuery(query);
  };

  // Filter sizes based on search query
  const filteredSizes = useMemo(() => {
    const lower = searchQuery.toLowerCase();
    return sizesData?.filter(size => size?.sizes?.toLowerCase().includes(lower));
  }, [searchQuery, sizesData]);

  return (
    <Layout
      title="Sizes"
      buttonLabel="Add Sizes"
      onButtonClick={() => navigate('/admin/sizes/add')}
    >
      <DataTable
        data={filteredSizes}
        columns={columns}
        onSearch={handleSearchInput}
        searchPlaceholder="Search size"
        addButtonText="Add Sizes"
        emptyStateMessage="No size found."
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

export default SizesPage;
