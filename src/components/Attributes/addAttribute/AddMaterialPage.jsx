import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Layout from '@/components/common/Layout';
import CommonAddForm from '@/components/common/CommonAddForm';
import { addMaterial, updateMaterial, getMaterialById } from '@/services/materialService';

const AddMaterialPage = () => {
  const navigate = useNavigate();
  const { mode, id } = useParams();
  const isEdit = mode === 'edit';

  const [materialData, setMaterialData] = useState(null);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit && id) {
      const fetchMaterial = async () => {
        try {
          const result = await getMaterialById(id);
          setMaterialData(result);
        } catch (error) {
          console.error('Failed to fetch material:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchMaterial();
    }
  }, [isEdit, id]);

  const handleSubmit = async values => {
    try {
      const payload = { material: values.name };

      if (isEdit) {
        if (!materialData) {
          console.error('No material data available for update');
          return;
        }
        await updateMaterial(materialData._id, payload);
      } else {
        await addMaterial(payload);
      }

      navigate('/admin/materials');
    } catch (error) {
      console.error('Failed to submit:', error);
    }
  };

  if (loading) return <div className="p-4 text-center">Loading...</div>;

  return (
    <Layout title="Material" isEdit={isEdit}>
      <CommonAddForm
        label="Material Name"
        buttonText={isEdit ? 'Update Material' : 'Add Material'}
        initialValues={{ name: materialData?.material || '' }}
        onSubmit={handleSubmit}
      />
    </Layout>
  );
};

export default AddMaterialPage;
