import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '@/components/common/Layout';
import CommonAddForm from '@/components/common/CommonAddForm';
import { useDispatch, useSelector } from 'react-redux';

import {
  addSuitablePlace,
  updateSuitablePlace,
  fetchSuitablePlaceById,
} from '@/redux/slice/suitablePlace/suitablePlaceThunks';
import { clearSuitablePlacesState } from '@/redux/slice/suitablePlace/suitablePlaceSlice';

import { toast } from 'react-toastify';

const AddPlacePage = ({ onSubmit }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { mode, id } = useParams();
  const isEdit = mode === 'edit';

  const { selectedPlace, loading } = useSelector(state => state.suitablePlace);

  useEffect(() => {
    if (isEdit && id) {
      dispatch(fetchSuitablePlaceById(id));
    }
    return () => {
      dispatch(clearSuitablePlacesState());
    };
  }, [dispatch, isEdit, id]);

  const handleSubmit = async values => {
    const payload = { suitablePlace: values.name };

    try {
      if (isEdit) {
        await dispatch(updateSuitablePlace({ id, data: payload })).unwrap();
      } else {
        if (onSubmit) {
          await onSubmit(values);
        } else {
          await dispatch(addSuitablePlace(payload)).unwrap();
        }
      }

      if (!onSubmit) {
        navigate('/admin/places', {
          state: {
            toastMessage: isEdit ? 'Suitable Place updated successfully!' : 'Suitable Place added successfully!',
          },
        });
      }
    } catch (error) {
      console.error('Failed to submit suitable place:', error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        (typeof error === 'string' ? error : 'Failed to save suitable place.');

      toast.error(errorMessage);
    }
  };

  if (isEdit && loading) return <div className="p-4 text-center">Loading...</div>;

  return (
    <Layout title="Suitable Place" isEdit={isEdit}>
      <CommonAddForm
        label="Suitable Place Name"
        buttonText={isEdit ? 'Update Suitable Place' : 'Add Suitable Place'}
        initialValues={{ name: selectedPlace?.suitablePlace || '' }}
        onSubmit={handleSubmit}
      />
    </Layout>
  );
};

export default AddPlacePage;
