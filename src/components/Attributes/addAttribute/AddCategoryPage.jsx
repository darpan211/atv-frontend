import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '@/components/common/Layout';
import CommonAddForm from '@/components/common/CommonAddForm';
import {
  fetchCategoryById,
  addCategory,
  updateCategory,
} from '@/redux/slice/categories/categoryThunks'; // adjust import path if needed
import { toast } from 'react-toastify';

const AddCategoryPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mode, id } = useParams();
  const isEdit = mode === 'edit';

  // Get category slice state from redux
  const { selectedCategory, loading, error } = useSelector(state => state.categories);

  useEffect(() => {
    if (isEdit && id) {
      dispatch(fetchCategoryById(id));
    }
  }, [dispatch, isEdit, id]);

  const initialValues = useMemo(() => {
    if (isEdit && selectedCategory) {
      return { name: selectedCategory.category || '' };
    }
    return { name: '' };
  }, [isEdit, selectedCategory]);

  const handleSubmit = async values => {
    const payload = { category: values.name };

    try {
      if (isEdit) {
        await dispatch(updateCategory({ id, data: payload })).unwrap();
      } else {
        await dispatch(addCategory(payload)).unwrap();
      }

      navigate('/admin/categories', {
        state: {
          toastMessage: isEdit ? 'Category updated successfully!' : 'Category added successfully!',
        },
      });
    } catch (err) {
      console.error('Failed to submit:', err);
      toast.error(err?.message || 'Failed to save category.');
    }
  };

  if (isEdit && loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <Layout title="Category" isEdit={isEdit}>
      <CommonAddForm
        label="Category Name"
        buttonText={isEdit ? 'Update Category' : 'Add Category'}
        initialValues={initialValues}
        onSubmit={handleSubmit}
      />
    </Layout>
  );
};

export default AddCategoryPage;
