// src/services/seriesService.js
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
import axiosHandler from '../axiosHandler';

export const getSeries = async () => {
  try {
    const response = await axiosHandler.get(`${BASE_URL}/api/v1/series/getseries`);
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch series:', error);
    throw error;
  }
};

export const addSeries = async data => {
  try {
    const response = await axiosHandler.post(`${BASE_URL}/api/v1/series/addseries`, data);
    return response.data;
  } catch (error) {
    console.error('Failed to add series:', error);
    throw error;
  }
};

export const deleteSeries = async id => {
  try {
    const response = await axiosHandler.delete(`${BASE_URL}/api/v1/series/deleteseries/${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete series:', error);
    throw error;
  }
};

export const updateSeries = async (id, data) => {
  try {
    const response = await axiosHandler.put(`${BASE_URL}/api/v1/series/updateseries/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Failed to update series:', error);
    throw error;
  }
};

export const getSeriesById = async id => {
  try {
    const response = await axiosHandler.get(`${BASE_URL}/api/v1/series/getseries/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch color by ID:', error);
    throw error;
  }
};
