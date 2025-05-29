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

export const getMaterials = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/material/getmaterial`, getAuthHeaders());
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch materials:', error);
    throw error;
  }
};

export const addMaterial = async data => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/v1/material/addmaterial`,
      data,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Failed to add material:', error);
    throw error;
  }
};

export const deleteMaterial = async id => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/api/v1/material/deletematerial/${id}`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Failed to delete material:', error);
    throw error;
  }
};

export const getMaterialById = async id => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/v1/material/getmaterial/${id}`,
      getAuthHeaders()
    );
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch material by ID:', error);
    throw error;
  }
};

export const updateMaterial = async (id, data) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/api/v1/material/updatematerial/${id}`,
      data,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Failed to update material:', error);
    throw error;
  }
};
