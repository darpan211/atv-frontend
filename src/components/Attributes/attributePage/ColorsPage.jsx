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

const ColorsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Access colors list and loading/error from redux store
  const { list: colors, loading, error } = useSelector(state => state.colors);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Define columns for DataTable
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
  }, [dispatch, colors]);

  // Show toast from location state
  useEffect(() => {
    if (location.state?.toastMessage) {
      console.log('Colour Page', location);

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

  const handleDeleteClick = id => {
    setSelectedColor(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (!selectedColor) return;

      setIsDeleting(true);

      await dispatch(deleteColor(selectedColor)).unwrap();
      await dispatch(fetchColors());

      console.log('Colour Success Delete');

      toast.success('Color deleted successfully!', {
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
      toast.error('Failed to delete color.', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'light',
      });
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
    return colors?.filter(color => color?.colors?.toLowerCase().includes(lower));
  }, [searchQuery, colors]);

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
