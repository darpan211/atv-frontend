import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '@/components/common/Layout';
import CommonTable from '@/components/common/CommonTable';
import { toast, Bounce } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCategories, deleteCategory } from '@/redux/slice/categories/categoryThunks';

const CategoriesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { list, loading, error } = useSelector(state => state.categories);

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

  const handleDelete = async id => {
    try {
      await dispatch(deleteCategory(id));
      await dispatch(fetchCategories());
      toast.success('Category deleted successfully!');
    } catch {
      toast.error('Failed to delete category.');
    }
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
        onDelete={handleDelete}
        loading={loading}
      />
    </Layout>
  );
};

export default CategoriesPage;
