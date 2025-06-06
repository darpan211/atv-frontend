import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosHandler from '../../../services/axiosHandler';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Fetch all suitable places
export const fetchSuitablePlaces = createAsyncThunk(
  'suitablePlace/fetchSuitablePlaces',
  async (_, thunkAPI) => {
    try {
      const response = await axiosHandler.get(`${BASE_URL}/api/v1/suitablePlace/getsuitablePlace`);
      return response.data.data; // return data array
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Add suitable place
export const addSuitablePlace = createAsyncThunk(
  'suitablePlace/addSuitablePlace',
  async (data, thunkAPI) => {
    try {
      const response = await axiosHandler.post(
        `${BASE_URL}/api/v1/suitablePlace/addsuitablePlace`,
        data
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete suitable place
export const deleteSuitablePlace = createAsyncThunk(
  'suitablePlace/deleteSuitablePlace',
  async (id, thunkAPI) => {
    try {
      const response = await axiosHandler.delete(
        `${BASE_URL}/api/v1/suitablePlace/deletesuitablePlace/${id}`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch suitable place by ID
export const fetchSuitablePlaceById = createAsyncThunk(
  'suitablePlace/fetchSuitablePlaceById',
  async (id, thunkAPI) => {
    try {
      const response = await axiosHandler.get(
        `${BASE_URL}/api/v1/suitablePlace/getsuitablePlace/${id}`
      );
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update suitable place
export const updateSuitablePlace = createAsyncThunk(
  'suitablePlace/updateSuitablePlace',
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await axiosHandler.put(
        `${BASE_URL}/api/v1/suitablePlace/updatesuitablePlace/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);
