const BASE_URL = import.meta.env.VITE_API_BASE_URL;
import axiosHandler from '../axiosHandler';

export const getColors = async () => {
  try {
    const response = await axiosHandler.get(`${BASE_URL}/api/v1/colors/getcolors`);
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch colors:', error);
    throw error;
  }
};

export const addColor = async data => {
  try {
    const response = await axiosHandler.post(`${BASE_URL}/api/v1/colors/addcolors`, data);
    return response.data;
  } catch (error) {
    console.error('Failed to add color:', error);
    throw error;
  }
};

export const deleteColor = async id => {
  try {
    const response = await axiosHandler.delete(`${BASE_URL}/api/v1/colors/deletcolors/${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete color:', error);
    throw error;
  }
};

export const updateColor = async (id, data) => {
  try {
    const response = await axiosHandler.put(`${BASE_URL}/api/v1/colors/updatecolors/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Failed to update color:', error);
    throw error;
  }
};

export const getColorById = async id => {
  try {
    const response = await axiosHandler.get(`${BASE_URL}/api/v1/colors/getcolors/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch color by ID:', error);
    throw error;
  }
};
