import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Utility to get the token from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getSuitablePlaces = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/v1/suitablePlace/getsuitablePlace`,
      getAuthHeaders()
    );
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch suitable places:', error);
    throw error;
  }
};

export const addSuitablePlace = async data => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/v1/suitablePlace/addsuitablePlace`,
      data,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Failed to add suitable place:', error);
    throw error;
  }
};

export const deleteSuitablePlace = async id => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/api/v1/suitablePlace/deletesuitablePlace/${id}`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Failed to delete suitable place:', error);
    throw error;
  }
};

export const getSuitablePlaceById = async id => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/v1/suitablePlace/getsuitablePlace/${id}`,
      getAuthHeaders()
    );
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch suitable place:', error);
    throw error;
  }
};

export const updateSuitablePlace = async (id, data) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/api/v1/suitablePlace/updatesuitablePlace/${id}`,
      data,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Failed to update suitable place:', error);
    throw error;
  }
};
