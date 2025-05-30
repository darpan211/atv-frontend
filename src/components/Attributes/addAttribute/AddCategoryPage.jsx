import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '@/components/common/Layout';
import CommonAddForm from '@/components/common/CommonAddForm';
import { addCategory, updateCategory, getCategoryById } from '@/services/categoryService';

const AddCategoryPage = () => {
  const navigate = useNavigate();
  const { mode, id } = useParams();
  const isEdit = mode === 'edit';

  const [categoryData, setCategoryData] = useState(null);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit && id) {
      const fetchCategory = async () => {
        try {
          const result = await getCategoryById(id);
          setCategoryData(result);
        } catch (error) {
          console.error('Failed to fetch category:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchCategory();
    }
  }, [isEdit, id]);

  const handleSubmit = async values => {
    try {
      const payload = { category: values.name };

      if (isEdit) {
        if (!categoryData) {
          console.error('No category data available for update');
          return;
        }
        await updateCategory(categoryData._id, payload);
      } else {
        await addCategory(payload);
      }

      navigate('/admin/categories', {
        state: {
          toastMessage: isEdit ? 'Category updated successfully!' : 'Category added successfully!',
        },
      });
    } catch (error) {
      console.error('Failed to submit:', error);
    }
  };

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  // Place this check BEFORE rendering the form
  if (isEdit && !categoryData) {
    return <div className="p-4 text-gray-600">Loading category...</div>;
  }

  // const initialValues = isEdit ? { name: categoryData?.name || '' } : { name: '' };
  const initialValues = isEdit ? { name: categoryData?.category || '' } : { name: '' };

  return (
    <Layout title="Category" isEdit={isEdit}>
      <CommonAddForm
        label="Category Name"
        buttonText={isEdit ? 'Update Category' : 'Add Category'}
        // initialValues={{ name: categoryData?.name || '' }}
        initialValues={initialValues}
        onSubmit={handleSubmit}
      />
    </Layout>
  );
};

export default AddCategoryPage;
