import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/common/Layout';
import DataTable from '@/components/common/DataTable';
import { toast, Bounce } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { fetchColors } from '@/redux/slice/colors/colorThunks';
import { deleteColor } from '@/redux/slice/colors/colorThunks';
import DeleteConfirmationModal from '@/components/common/DeleteConfirmationModal';
import { DeleteIcon } from '@/components/common/icons/svgs/DeleteIcon';
import { EditIcon } from '@/components/common/icons/svgs/EditIcon';
import Loader from '@/components/common/Loader';

const ColorsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { list: colors, loading, error } = useSelector(state => state.colors);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const columns = [
    {
      header: 'Color Name',
      accessor: 'colors', // Adjust this based on your color object structure
    },
    {
      header: 'Actions',
      className: 'w-32 text-center',
      cell: row => (
        <div className="btns flex gap-5 text-xl ml-4">
          <div
            className="cursor-pointer"
            onClick={() => navigate(`/admin/colors/edit/${row._id}`, { state: row })}
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

  // Fetch colors on mount
  useEffect(() => {
    dispatch(fetchColors());
  }, [dispatch]);

  // Show toast from location state
  useEffect(() => {
    if (location.state?.toastMessage) {
      toast.success(location.state.toastMessage);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleDeleteClick = id => {
    setSelectedColor(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (!selectedColor) return;
      setIsDeleting(true);

      dispatch(deleteColor(selectedColor));
      dispatch(fetchColors());
      toast.success('Color deleted successfully!');
    } catch(err) {
      toast.error(err.message || 'Failed to delete color.');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setSelectedColor(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedColor(null);
  };

  const handleSearchInput = query => {
    setSearchQuery(query);
  };

  // Filter colors based on search query
  const filteredColors = useMemo(() => {
    const lower = searchQuery.toLowerCase();
    return colors?.data.filter(color => color?.colors?.toLowerCase().includes(lower));
  }, [searchQuery, colors]);

    if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <Loader/>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title="Colors"
      buttonLabel="Add Color"
      onButtonClick={() => navigate('/admin/colors/add')}
    >
      <DataTable
        data={filteredColors}
        columns={columns}
        onSearch={handleSearchInput}
        searchPlaceholder="Search color"
        addButtonText="Add Color"
        emptyStateMessage="No color found."
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

      {error && <p className="text-red-500 mt-2">{error?.message || String(error)}</p>}
    </Layout>
  );
};

export default ColorsPage;
