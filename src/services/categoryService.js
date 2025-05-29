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

export const getCategories = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/attributes/getcategory`, getAuthHeaders());
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    throw error;
  }
};

export const addCategory = async data => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/v1/attributes/addcategory`,
      data,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Failed to add category:', error);
    throw error;
  }
};

export const deleteCategory = async id => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/api/v1/attributes/deletecategory/${id}`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Failed to delete category:', error);
    throw error;
  }
};
export const getCategoryById = async id => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/v1/attributes/getcategory/${id}`,
      getAuthHeaders()
    );
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch category:', error);
    throw error;
  }
};

export const updateCategory = async (id, data) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/api/v1/attributes/updatecategory/${id}`,
      data,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Failed to update category:', error);
    throw error;
  }
};
