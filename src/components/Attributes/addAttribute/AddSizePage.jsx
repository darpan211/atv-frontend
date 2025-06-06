import React, { useEffect } from 'react';
import Layout from '@/components/common/Layout';
import CommonAddForm from '@/components/common/CommonAddForm';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { addSize, updateSize, fetchSizeById } from '@/redux/slice/sizes/sizeThunks';
import { clearSelectedSize } from '@/redux/slice/sizes/sizeSlice';
import { toast, Bounce } from 'react-toastify';

const AddSizePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { mode, id } = useParams();
  const isEdit = mode === 'edit';

  const { selectedSize, loading, error } = useSelector(state => state.sizes);

  useEffect(() => {
    if (isEdit && id) {
      dispatch(fetchSizeById(id));
    }
    return () => {
      dispatch(clearSelectedSize());
    };
  }, [dispatch, isEdit, id]);

  const handleSubmit = async values => {
    try {
      const payload = {
        height: values.height,
        width: values.width,
        sizes: `${values.height} X ${values.width}`,
      };

      if (isEdit) {
        await dispatch(updateSize({ id, data: payload })).unwrap();
        toast.success('Size updated successfully!');
      } else {
        await dispatch(addSize(payload)).unwrap();
        toast.success('Size added successfully!');
      }

      navigate('/admin/sizes', {
        state: {
          toastMessage: isEdit ? 'Sizes updated successfully!' : 'Sizes added successfully!',
        },
      });
    } catch (err) {
      console.error('Failed to submit:', err);
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to save size.';
      toast.error(errorMessage);
    }
  };

  if (loading && isEdit) return <div className="p-4 text-center">Loading...</div>;

  return (
    <Layout title="Sizes" isEdit={isEdit}>
      <CommonAddForm
        formType="sizes"
        label="Size"
        buttonText={isEdit ? 'Update Size' : 'Add Size'}
        initialValues={{
          height: selectedSize?.height || '',
          width: selectedSize?.width || '',
        }}
        onSubmit={handleSubmit}
      />
    </Layout>
  );
};

export default AddSizePage;
