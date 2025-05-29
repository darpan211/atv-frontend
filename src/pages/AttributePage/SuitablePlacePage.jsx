import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/common/Layout';
import CommonTable from '@/components/common/CommonTable';
import { getSuitablePlaces, deleteSuitablePlace } from '@/services/suitablePlaceService';

const SuitablePlacePage = () => {
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

  const handleDelete = async id => {
    const confirmed = window.confirm('Are you sure you want to delete this suitable place?');
    if (!confirmed) return;

    try {
      await deleteSuitablePlace(id);
      await loadData(); // Refresh data after deletion
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
