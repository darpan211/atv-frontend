import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/common/Layout';
import CommonTable from '@/components/common/CommonTable';
import { getMaterials, deleteMaterial } from '@/services/materialService';

const Materials = () => {
  const navigate = useNavigate();
  const [materials, setMaterials] = useState([]);

  const loadData = async () => {
    try {
      const data = await getMaterials();
      setMaterials(data);
    } catch (error) {
      console.error('Error fetching materials:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async id => {
    const confirmed = window.confirm('Are you sure you want to delete this material?');
    if (!confirmed) return;

    try {
      await deleteMaterial(id);
      await loadData(); // Refresh data after deletion
    } catch (error) {
      console.error('Error deleting material:', error);
    }
  };

  return (
    <Layout
      title="Materials"
      buttonLabel="Add Material"
      onButtonClick={() => navigate('/admin/materials/add')}
    >
      <CommonTable
        type="material"
        data={materials}
        onEdit={item => navigate(`/admin/materials/edit/${item._id}`, { state: item })}
        onDelete={handleDelete}
      />
    </Layout>
  );
};

export default Materials;
