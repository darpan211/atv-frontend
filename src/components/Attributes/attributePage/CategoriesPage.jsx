import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '@/components/common/Layout';
import CommonTable from '@/components/common/CommonTable';
import { getCategories, deleteCategory } from '@/services/attributeServices/categoryService';
import { toast, Bounce } from 'react-toastify';

const CategoriesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [categories, setCategories] = useState([]);

  // Load categories data
  const loadData = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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

  const handleDelete = async id => {
    try {
      await deleteCategory(id);
      await loadData();

      toast.success('Category deleted successfully!', {
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
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category.', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'light',
      });
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
        data={categories}
        onEdit={item => navigate(`/admin/categories/edit/${item._id}`, { state: item })}
        onDelete={handleDelete}
      />
    </Layout>
  );
};

export default CategoriesPage;
