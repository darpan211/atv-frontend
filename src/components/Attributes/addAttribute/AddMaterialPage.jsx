import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import Layout from '@/components/common/Layout';
import CommonAddForm from '@/components/common/CommonAddForm';

import {
  fetchMaterialById,
  addMaterial,
  updateMaterial,
  fetchMaterials,
} from '@/redux/slice/material/materialThunks';
import { clearSelectedMaterial } from '@/redux/slice/material/materialSlice';
import { toast } from 'react-toastify';

const AddMaterialPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mode, id } = useParams();
  const isEdit = mode === 'edit';

  const { selectedMaterial, loading } = useSelector(state => state.materials);

  useEffect(() => {
    if (isEdit && id) {
      dispatch(fetchMaterialById(id));
    }

    return () => {
      dispatch(clearSelectedMaterial());
    };
  }, [dispatch, isEdit, id]);

  const handleSubmit = async values => {
    const payload = { material: values.name };

    try {
      if (isEdit) {
        await dispatch(updateMaterial({ id, data: payload })).unwrap();
        await dispatch(fetchMaterials());
      } else {
        await dispatch(addMaterial(payload)).unwrap();
        await dispatch(fetchMaterials());
      }

      navigate('/admin/materials', {
        state: {
          toastMessage: isEdit ? 'Material updated successfully!' : 'Material added successfully!',
        },
      });
    } catch (error) {
      console.error('Failed to submit material:', error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        (typeof error === 'string' ? error : 'Failed to save material.');

      toast.error(errorMessage);
    }
  };

  if (isEdit && loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <Layout title="Material" isEdit={isEdit}>
      <CommonAddForm
        label="Material Name"
        buttonText={isEdit ? 'Update Material' : 'Add Material'}
        initialValues={{ name: selectedMaterial?.material || '' }}
        onSubmit={handleSubmit}
      />
    </Layout>
  );
};

export default AddMaterialPage;
