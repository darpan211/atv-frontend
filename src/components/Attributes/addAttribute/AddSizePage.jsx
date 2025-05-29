import React, { useEffect, useState } from 'react';
import Layout from '@/components/common/Layout';
import CommonAddForm from '@/components/common/CommonAddForm';
import { useNavigate, useParams } from 'react-router-dom';
import {
  addSize,
  updateSize,
  // getSizeById, // Uncomment this when API is ready
} from '@/services/sizeService';

const AddSizePage = () => {
  const navigate = useNavigate();
  const { mode, id } = useParams();
  const isEdit = mode === 'edit';

  const [sizeData, setSizeData] = useState(null);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit && id) {
      const fetchSize = async () => {
        try {
          // const result = await getSizeById(id); // Uncomment when available
          // setSizeData(result);
        } catch (error) {
          console.error('Failed to fetch size:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchSize();
    }
  }, [isEdit, id]);

  const handleSubmit = async values => {
    try {
      const payload = {
        height: values.height,
        width: values.width,
        sizes: `${values.height} X ${values.width}`,
      };

      if (isEdit) {
        if (!sizeData) {
          console.error('No size data available for update');
          return;
        }
        await updateSize(sizeData.id, payload);
      } else {
        await addSize(payload);
      }

      navigate('/admin/sizes');
    } catch (error) {
      console.error('Failed to submit:', error);
    }
  };

  if (loading) return <div className="p-4 text-center">Loading...</div>;

  return (
    <Layout title="Sizes" isEdit={isEdit}>
      <CommonAddForm
        formType="sizes"
        label="Size"
        buttonText={isEdit ? 'Update Size' : 'Add Size'}
        initialValues={{
          height: sizeData?.height || '',
          width: sizeData?.width || '',
        }}
        onSubmit={handleSubmit}
      />
    </Layout>
  );
};

export default AddSizePage;
