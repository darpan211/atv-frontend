import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '@/components/common/Layout';
import CommonAddForm from '@/components/common/CommonAddForm';
import {
  addSuitablePlace,
  updateSuitablePlace,
  getSuitablePlaceById,
} from '@/services/attributeServices/suitablePlaceService';

const AddPlacePage = () => {
  const navigate = useNavigate();
  const { mode, id } = useParams();
  const isEdit = mode === 'edit';

  const [placeData, setPlaceData] = useState(null);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit && id) {
      const fetchPlace = async () => {
        try {
          const result = await getSuitablePlaceById(id);
          setPlaceData(result);
        } catch (error) {
          console.error('Failed to fetch suitable place:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchPlace();
    }
  }, [isEdit, id]);

  const handleSubmit = async values => {
    try {
      const payload = { suitablePlace: values.name };

      if (isEdit) {
        if (!placeData) {
          console.error('No suitable place data available for update');
          return;
        }
        await updateSuitablePlace(placeData._id, payload);
      } else {
        await addSuitablePlace(payload);
      }
      // navigate('/admin/places');
      navigate('/admin/places', {
        state: {
          toastMessage: isEdit ? 'Places updated successfully!' : 'Places added successfully!',
        },
      });
    } catch (error) {
      console.error('Failed to submit:', error);
    }
  };

  if (loading) return <div className="p-4 text-center">Loading...</div>;

  return (
    <Layout title="Suitable Place" isEdit={isEdit}>
      <CommonAddForm
        label="Suitable Place Name"
        buttonText={isEdit ? 'Update Suitable Place' : 'Add Suitable Place'}
        initialValues={{ name: placeData?.suitablePlace || '' }}
        onSubmit={handleSubmit}
      />
    </Layout>
  );
};

export default AddPlacePage;
