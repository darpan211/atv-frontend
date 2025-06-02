import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/common/Layout';
import CommonTable from '@/components/common/CommonTable';
import { getSeries, deleteSeries } from '@/services/attributeServices/seriesService';
import { toast, Bounce, ToastContainer } from 'react-toastify';

const Series = () => {
  const [seriesData, setSeriesData] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchSeries();
  }, []);

  useEffect(() => {
    if (location.state?.toastMessage) {
      toast.success(location.state.toastMessage, {
        position: 'top-right',
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'light',
        transition: Bounce,
        className: 'bg-white rounded-md shadow-md border-2',
        style: { borderColor: '#6F4E37' },
        bodyClassName: 'text-[#6F4E37] font-semibold text-lg',
        progressStyle: { backgroundColor: '#6F4E37' },
      });

      window.history.replaceState({}, document.title);
    }
  }, [location]);
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
      toast.success('Series deleted successfully!', {
        position: 'top-right',
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'light',
        transition: Bounce,
        className: 'bg-white rounded-md shadow-md border-2',
        style: { borderColor: '#6F4E37' },
        bodyClassName: 'text-[#6F4E37] font-semibold text-lg',
        progressStyle: { backgroundColor: '#6F4E37' },
      });
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
