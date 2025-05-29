import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getColors = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/colors/getcolors`, getAuthHeaders());
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch colors:', error);
    throw error;
  }
};

export const addColor = async data => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/v1/colors/addcolors`,
      data,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Failed to add color:', error);
    throw error;
  }
};

export const deleteColor = async id => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/api/v1/colors/deletcolors/${id}`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Failed to delete color:', error);
    throw error;
  }
};

export const updateColor = async (id, data) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/api/v1/colors/updatecolors/${id}`,
      data,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Failed to update color:', error);
    throw error;
  }
};
