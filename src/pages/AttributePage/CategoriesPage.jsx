import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/common/Layout';
import CommonTable from '@/components/common/CommonTable';
import { getCategories, deleteCategory } from '@/services/categoryService';

const CategoriesPage = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
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

  const handleDelete = async id => {
    const confirmed = window.confirm('Are you sure you want to delete this category?');
    if (!confirmed) return;

    try {
      await deleteCategory(id);
      await loadData(); // Refresh data after deletion
    } catch (error) {
      console.error('Error deleting category:', error);
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
