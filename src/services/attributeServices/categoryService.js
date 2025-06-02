import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
import axiosHandler from '../axiosHandler';

export const getCategories = async () => {
  try {
    const response = await axiosHandler.get(`${BASE_URL}/api/v1/attributes/getcategory`);
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    throw error;
  }
};

export const addCategory = async data => {
  try {
    const response = await axiosHandler.post(`${BASE_URL}/api/v1/attributes/addcategory`, data);
    return response.data;
  } catch (error) {
    console.error('Failed to add category:', error);
    throw error;
  }
};

export const deleteCategory = async id => {
  try {
    const response = await axiosHandler.delete(
      `${BASE_URL}/api/v1/attributes/deletecategory/${id}`
    );
    return response.data;
  } catch (error) {
    console.error('Failed to delete category:', error);
    throw error;
  }
};
export const getCategoryById = async id => {
  try {
    const response = await axiosHandler.get(`${BASE_URL}/api/v1/attributes/getcategory/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch category:', error);
    throw error;
  }
};

export const updateCategory = async (id, data) => {
  try {
    const response = await axiosHandler.put(
      `${BASE_URL}/api/v1/attributes/updatecategory/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error('Failed to update category:', error);
    throw error;
  }
};
