const BASE_URL = import.meta.env.VITE_API_BASE_URL;
import axiosHandler from '../axiosHandler';

export const getSizes = async () => {
  try {
    const response = await axiosHandler.get(`${BASE_URL}/api/v1/sizes/getsizes`);
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch sizes:', error);
    throw error;
  }
};

export const addSize = async data => {
  try {
    const response = await axiosHandler.post(`${BASE_URL}/api/v1/sizes/addsizes`, data);
    return response.data;
  } catch (error) {
    console.error('Failed to add size:', error);
    throw error;
  }
};

export const deleteSize = async id => {
  try {
    const response = await axiosHandler.delete(`${BASE_URL}/api/v1/sizes/deletesizes/${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete size:', error);
    throw error;
  }
};

export const updateSize = async (id, data) => {
  try {
    const response = await axiosHandler.put(`${BASE_URL}/api/v1/sizes/updatesizes/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Failed to update size:', error);
    throw error;
  }
};

export const getSizeById = async id => {
  try {
    const response = await axiosHandler.get(`${BASE_URL}/api/v1/sizes/getsizes/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch size by ID:', error);
    throw error;
  }
};
