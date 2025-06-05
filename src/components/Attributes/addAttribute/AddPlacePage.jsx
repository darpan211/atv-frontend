import React, { useEffect, useMemo } from 'react';
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

import { toast, Bounce } from 'react-toastify';

const AddPlacePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { mode, id } = useParams();
  const isEdit = mode === 'edit';

  const { selectedPlace, loading } = useSelector(state => state.suitablePlace);

  const initialValues = useMemo(() => {
    return {
      name: selectedPlace?.suitablePlace || '',
    };
  }, [selectedPlace]);

  useEffect(() => {
    if (isEdit && id) {
      dispatch(fetchSuitablePlaceById(id));
    }
    return () => {
      dispatch(clearSuitablePlacesState());
    };
  }, [dispatch, isEdit, id]);

  const handleSubmit = async values => {
    try {
      const payload = { suitablePlace: values.name };

      if (isEdit) {
        await dispatch(updateSuitablePlace({ id, data: payload })).unwrap();
      } else {
        await dispatch(addSuitablePlace(payload)).unwrap();
      }

      navigate('/admin/places', {
        state: {
          toastMessage: isEdit ? 'Place updated successfully!' : 'Place added successfully!',
        },
      });
    } catch (error) {
      console.error('Failed to submit:', error);
      toast.error('Failed to save place.', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'light',
      });
    }
  };

  if (loading && isEdit) return <div className="p-4 text-center">Loading...</div>;

  return (
    <Layout title="Suitable Place" isEdit={isEdit}>
      <CommonAddForm
        label="Suitable Place Name"
        buttonText={isEdit ? 'Update Suitable Place' : 'Add Suitable Place'}
        initialValues={initialValues}
        onSubmit={handleSubmit}
      />
    </Layout>
  );
};

export default AddPlacePage;
