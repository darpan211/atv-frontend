import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/common/Layout';
import CommonTable from '@/components/common/CommonTable';
import { getSuitablePlaces, deleteSuitablePlace } from '@/services/suitablePlaceService';
import { toast, Bounce, ToastContainer } from 'react-toastify';

const SuitablePlacePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [places, setPlaces] = useState([]);

  const loadData = async () => {
    try {
      const data = await getSuitablePlaces();
      setPlaces(data);
    } catch (error) {
      console.error('Error fetching suitable places:', error);
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
      await deleteSuitablePlace(id);
      await loadData(); // Refresh data after deletion
      toast.success('Place deleted successfully!', {
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
      console.error('Error deleting suitable place:', error);
    }
  };

  return (
    <Layout
      title="Suitable Places"
      buttonLabel="Add Suitable Place"
      onButtonClick={() => navigate('/admin/places/add')}
    >
      <CommonTable
        type="suitablePlace"
        data={places}
        onEdit={item => navigate(`/admin/places/edit/${item._id}`, { state: item })}
        onDelete={handleDelete}
      />
    </Layout>
  );
};

export default SuitablePlacePage;
