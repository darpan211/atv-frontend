import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/common/Layout';
import CommonTable from '@/components/common/CommonTable';
import { getColors, deleteColor } from '@/services/colorService';

const ColorsPage = () => {
  const navigate = useNavigate();

  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getColors();
      setColors(data);
    } catch (error) {
      console.error('Error fetching colors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async id => {
    const confirmed = window.confirm('Are you sure you want to delete this color?');
    if (!confirmed) return;

    try {
      await deleteColor(id);
      await loadData(); // Refresh data after deletion
    } catch (error) {
      console.error('Error deleting color:', error);
    }
  };

  if (loading) return <div className="p-4 text-center">Loading...</div>;

  return (
    <Layout
      title="Colors"
      buttonLabel="Add Color"
      onButtonClick={() => navigate('/admin/colors/add')}
    >
      <CommonTable
        type="colors" // Use "colors" if that's how your CommonTable expects it (consistent with service)
        data={colors}
        onEdit={item => navigate(`/admin/colors/edit/${item._id}`, { state: item })}
        onDelete={handleDelete}
      />
    </Layout>
  );
};

export default ColorsPage;
