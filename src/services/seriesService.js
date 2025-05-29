// src/services/seriesService.js
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

export const getSeries = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/series/getseries`, getAuthHeaders());
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch series:', error);
    throw error;
  }
};

export const addSeries = async data => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/v1/series/addseries`,
      data,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Failed to add series:', error);
    throw error;
  }
};

export const deleteSeries = async id => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/api/v1/series/deleteseries/${id}`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Failed to delete series:', error);
    throw error;
  }
};

export const updateSeries = async (id, data) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/api/v1/series/updateseries/${id}`,
      data,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Failed to update series:', error);
    throw error;
  }
};
