// src/services/sizeService.js

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

export const getSizes = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/sizes/getsizes`, getAuthHeaders());
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch sizes:', error);
    throw error;
  }
};

export const addSize = async data => {
  try {
    const response = await axios.post(`${BASE_URL}/api/v1/sizes/addsizes`, data, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Failed to add size:', error);
    throw error;
  }
};

export const deleteSize = async id => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/api/v1/sizes/deletesizes/${id}`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Failed to delete size:', error);
    throw error;
  }
};

export const updateSize = async (id, data) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/api/v1/sizes/updatesizes/${id}`,
      data,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Failed to update size:', error);
    throw error;
  }
};
