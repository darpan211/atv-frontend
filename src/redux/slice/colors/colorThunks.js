import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosHandler from '../../../services/axiosHandler';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getErrorMessage = error =>
  error.response?.data?.message || error.message || 'Unknown error occurred';

export const fetchColors = createAsyncThunk('colors/fetchColors', async (_, thunkAPI) => {
  try {
    const state = thunkAPI.getState();
    const existingList = state?.colors?.list;
    if (!existingList || existingList?.length === 0) {
      const response = await axiosHandler.get(`${BASE_URL}/api/v1/colors/getcolors`);
      return response.data.data;
    }
    return existingList;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const addColor = createAsyncThunk('colors/addColor', async (data, thunkAPI) => {
  try {
    const response = await axiosHandler.post(`${BASE_URL}/api/v1/colors/addcolors`, data);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const deleteColor = createAsyncThunk('colors/deleteColor', async (id, thunkAPI) => {
  try {
    await axiosHandler.delete(`${BASE_URL}/api/v1/colors/deletcolors/${id}`);
    return id; // ✅ Return just the ID
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const updateColor = createAsyncThunk(
  'colors/updateColor',
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await axiosHandler.put(`${BASE_URL}/api/v1/colors/updatecolors/${id}`, data);
      return { id, data: response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchColorById = createAsyncThunk('colors/fetchColorById', async (id, thunkAPI) => {
  try {
    const response = await axiosHandler.get(`${BASE_URL}/api/v1/colors/getcolors/${id}`);
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});
