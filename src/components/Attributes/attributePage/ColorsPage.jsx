import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/common/Layout';
import CommonTable from '@/components/common/CommonTable';
import { getColors, deleteColor } from '@/services/attributeServices/colorService';
import { toast, Bounce } from 'react-toastify'; // ❌ No ToastContainer here

const ColorsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [colors, setColors] = useState([]);

  const loadData = async () => {
    try {
      const data = await getColors();
      setColors(data);
    } catch (error) {
      console.error('Error fetching colors:', error);
    }
  };

  useEffect(() => {
    loadData();
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

  const handleDelete = async id => {
    try {
      await deleteColor(id);
      await loadData();

      toast.success('Color deleted successfully!', {
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
      console.error('Error deleting color:', error);
      toast.error('Failed to delete color.', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'light',
      });
    }
  };

  return (
    <Layout
      title="Colors"
      buttonLabel="Add Color"
      onButtonClick={() => navigate('/admin/colors/add')}
    >
      <CommonTable
        type="colors"
        data={colors}
        onEdit={item => navigate(`/admin/colors/edit/${item._id}`, { state: item })}
        onDelete={handleDelete}
      />
    </Layout>
  );
};

export default ColorsPage;
