import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '@/components/common/Layout';
import CommonAddForm from '@/components/common/CommonAddForm';
import { fetchColorById, addColor, updateColor } from '@/redux/slice/colors/colorThunks';
import { toast } from 'react-toastify';

const AddColorPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mode, id } = useParams();
  const isEdit = mode === 'edit';

  // Get relevant state from Redux store
  const { selectedColor, loading, error } = useSelector(state => state.colors);

  useEffect(() => {
    if (isEdit && id) {
      dispatch(fetchColorById(id));
    }
  }, [dispatch, isEdit, id]);

  const initialValues = useMemo(() => {
    if (isEdit && selectedColor) {
      return { name: selectedColor.colors || '' };
    }
    return { name: '' };
  }, [isEdit, selectedColor]);

  const handleSubmit = async values => {
    const payload = { colors: values.name };

    try {
      if (isEdit) {
        await dispatch(updateColor({ id, data: payload })).unwrap();
        toast.success('Color updated successfully!');
      } else {
        await dispatch(addColor(payload)).unwrap();
        toast.success('Color added successfully!');
      }

      navigate('/admin/colors', {
        state: {
          toastMessage: isEdit ? 'Color updated successfully!' : 'Color added successfully!',
        },
      });
    } catch (err) {
      console.log('Failed to submit:', err);
      toast.error(err?.message || err || 'Failed to save color.');
    }
  };

  if (isEdit && loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <Layout title="Colors" isEdit={isEdit}>
      <CommonAddForm
        label="Color Name"
        buttonText={isEdit ? 'Update Color' : 'Add Color'}
        initialValues={initialValues}
        onSubmit={handleSubmit}
      />
    </Layout>
  );
};

export default AddColorPage;
