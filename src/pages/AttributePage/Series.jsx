import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/common/Layout';
import CommonTable from '@/components/common/CommonTable';
import { getSeries, deleteSeries } from '@/services/seriesService';

const Series = () => {
  const [seriesData, setSeriesData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSeries();
  }, []);

  const fetchSeries = async () => {
    try {
      const data = await getSeries();
      setSeriesData(data);
    } catch (error) {
      console.error('Error fetching series:', error);
    }
  };

  const handleDelete = async id => {
    try {
      await deleteSeries(id);
      fetchSeries(); // refresh after delete
    } catch (error) {
      console.error('Error deleting series:', error);
    }
  };

  const handleEdit = item => {
    navigate(`/admin/series/edit/${item._id}`);
  };

  return (
    <Layout
      title="Series"
      buttonLabel="Add Series"
      onButtonClick={() => navigate('/admin/series/add')}
    >
      <CommonTable type="series" data={seriesData} onEdit={handleEdit} onDelete={handleDelete} />
    </Layout>
  );
};

export default Series;
