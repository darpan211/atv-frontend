import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '@/components/common/Layout';
import CommonTable from '@/components/common/CommonTable';
import { toast, Bounce } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCategories, deleteCategory } from '@/redux/slice/categories/categoryThunks';
import DeleteConfirmationModal from '@/components/common/DeleteConfirmationModal';

const CategoriesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { list, loading, error } = useSelector(state => state.categories);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
    setIsDeleting(true);   
      await dispatch(deleteCategory(selectedCategory));
      await dispatch(fetchCategories());
      toast.success('Category deleted successfully!');
    } catch {
      toast.error('Failed to delete category.');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setSelectedCategory(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedCategory(null);
  };

  return (
    <Layout
      title="Categories"
      buttonLabel="Add Category"
      onButtonClick={() => navigate('/admin/categories/add')}
    >

        <CommonTable
        type="category"
        data={list}
        onEdit={item => navigate(`/admin/categories/edit/${item._id}`, { state: item })}
        onDelete={handleDeleteClick}
        loading={loading}
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
