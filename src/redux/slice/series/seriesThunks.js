import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosHandler from '../../../services/axiosHandler';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Fetch all series
export const fetchSeries = createAsyncThunk('series/fetchSeries', async (_, thunkAPI) => {
  try {
    // const state = thunkAPI.getState();
    // const existingList = state?.series?.list;
    // if (!existingList || existingList?.length === 0) {
    //   const response = await axiosHandler.get(`${BASE_URL}/api/v1/series/getseries`);
    //   return response.data.data;
    // }
    // return existingList;

    const response = await axiosHandler.get(`${BASE_URL}/api/v1/series/getseries`);
    return response.data.data;

  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// Add series
export const addSeries = createAsyncThunk('series/addSeries', async (data, thunkAPI) => {
  try {
    const response = await axiosHandler.post(`${BASE_URL}/api/v1/series/addseries`, data);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// Delete series
export const deleteSeries = createAsyncThunk('series/deleteSeries', async (id, thunkAPI) => {
  try {
    const response = await axiosHandler.delete(`${BASE_URL}/api/v1/series/deleteseries/${id}`);
    return {id, ...response.data};
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// Fetch series by ID
export const fetchSeriesById = createAsyncThunk('series/fetchSeriesById', async (id, thunkAPI) => {
  try {
    const response = await axiosHandler.get(`${BASE_URL}/api/v1/series/getseries/${id}`);
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// Update series
export const updateSeries = createAsyncThunk(
  'series/updateSeries',
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await axiosHandler.put(`${BASE_URL}/api/v1/series/updateseries/${id}`, data);
      return {id, data:response.data};
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);
