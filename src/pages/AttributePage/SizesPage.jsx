import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/common/Layout';
import CommonTable from '@/components/common/CommonTable';
import { getSizes, deleteSize } from '@/services/sizeService';

const SizesPage = () => {
  const [sizesData, setSizesData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSizes();
  }, []);

  const fetchSizes = async () => {
    try {
      const data = await getSizes();
      setSizesData(data);
    } catch (error) {
      console.error('Error fetching sizes:', error);
    }
  };

  const handleDelete = async id => {
    try {
      await deleteSize(id);
      fetchSizes();
    } catch (error) {
      console.error('Error deleting size:', error.response?.data || error.message);
    }
  };

  const handleEdit = item => {
    navigate(`/admin/sizes/edit/${item._id}`);
  };

  return (
    <Layout
      title="Sizes"
      buttonLabel="Add Sizes"
      onButtonClick={() => navigate('/admin/sizes/add')}
    >
      <CommonTable type="sizes" data={sizesData} onEdit={handleEdit} onDelete={handleDelete} />
    </Layout>
  );
};

export default SizesPage;
