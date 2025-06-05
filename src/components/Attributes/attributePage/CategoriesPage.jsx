import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '@/components/common/Layout';
import { toast, Bounce } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCategories, deleteCategory } from '@/redux/slice/categories/categoryThunks';
import DeleteConfirmationModal from '@/components/common/DeleteConfirmationModal';
import DataTable from '@/components/common/DataTable';
import { DeleteIcon } from '@/components/common/icons/svgs/DeleteIcon';
import { EditIcon } from '@/components/common/icons/svgs/EditIcon';

const CategoriesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { list, loading, error } = useSelector(state => state.categories);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const columns = [
    {
      header: 'Category Name',
      accessor: 'category',
    },
    {
      header: 'Actions',
      className: 'w-32 text-center',
      cell: row => (
        <div className="btns flex gap-5 text-xl ml-4">
          <div
            className="cursor-pointer"
            onClick={() => navigate(`/admin/categories/edit/${row._id}`, { state: row })}
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
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (location.state?.toastMessage) {
      toast.success(location.state.toastMessage, {
        position: 'top-right',
        autoClose: 3000,
        theme: 'light',
        transition: Bounce,
      });
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleDeleteClick = item => {
    setSelectedCategory(item);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (!selectedCategory) return;
      await dispatch(deleteCategory(selectedCategory));
      await dispatch(fetchCategories());
      toast.success('Category deleted successfully!');
    } catch {
      toast.error('Failed to delete category.');
    } finally {
      setShowDeleteModal(false);
      setSelectedCategory(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedCategory(null);
  };

  const handleSearchInput = query => {
    setSearchQuery(query);
  };

  const filteredCategories = useMemo(() => {
    const lower = searchQuery.toLowerCase();
    return list?.filter(category => category?.category.toLowerCase().includes(lower));
  }, [searchQuery, list]);

  return (
    <Layout
      title="Categories"
      buttonLabel="Add Category"
      onButtonClick={() => navigate('/admin/categories/add')}
    >
      <DataTable
        data={filteredCategories}
        columns={columns}
        onSearch={handleSearchInput}
        searchPlaceholder="Search category"
        addButtonText="Add Category"
        emptyStateMessage="No category found."
      />
      {showDeleteModal && (
        <DeleteConfirmationModal
          tile={{ description: 'This action cannot be undone. Do you want to continue?' }}
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
        />
      )}
    </Layout>
  );
};

export default CategoriesPage;
