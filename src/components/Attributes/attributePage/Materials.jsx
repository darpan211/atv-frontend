import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/common/Layout';
import CommonTable from '@/components/common/CommonTable';
import { getMaterials, deleteMaterial } from '@/services/materialService';
import { toast, Bounce, ToastContainer } from 'react-toastify';

const Materials = () => {
  const location = useLocation();
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
      await deleteMaterial(id);
      await loadData(); // Refresh data after deletion
      toast.success('Material deleted successfully!', {
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
