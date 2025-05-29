import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '@/components/common/Layout';
import CommonAddForm from '@/components/common/CommonAddForm';
import {
  addColor,
  updateColor,
  // getColorById,
} from '@/services/colorService';

const AddColorPage = () => {
  const navigate = useNavigate();
  const { mode, id } = useParams();
  const isEdit = mode === 'edit';

  const [colorData, setColorData] = useState(null);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit && id) {
      const fetchColor = async () => {
        try {
          const result = await getColorById(id);
          setColorData(result);
        } catch (error) {
          console.error('Failed to fetch color:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchColor();
    }
  }, [isEdit, id]);

  const handleSubmit = async values => {
    try {
      const payload = { colors: values.name };

      if (isEdit) {
        if (!colorData) {
          console.error('No color data available for update');
          return;
        }
        await updateColor(colorData._id, payload);
      } else {
        await addColor(payload);
      }

      navigate('/admin/colors');
    } catch (error) {
      console.error('Failed to submit:', error);
    }
  };

  if (loading) return <div className="p-4 text-center">Loading...</div>;

  return (
    <Layout title="Colors" isEdit={isEdit}>
      <CommonAddForm
        label="Color Name"
        buttonText={isEdit ? 'Update Color' : 'Add Color'}
        initialValues={{ color: colorData?.color || '' }} // key here must match form field name
        onSubmit={handleSubmit}
      />
    </Layout>
  );
};

export default AddColorPage;
