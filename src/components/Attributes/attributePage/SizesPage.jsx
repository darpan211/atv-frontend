import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/common/Layout';
import CommonTable from '@/components/common/CommonTable';
import { getSizes, deleteSize } from '@/services/sizeService';
import { toast, Bounce, ToastContainer } from 'react-toastify';

const SizesPage = () => {
  const [sizesData, setSizesData] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    fetchSizes();
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
      toast.success('Sizes deleted successfully!', {
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
