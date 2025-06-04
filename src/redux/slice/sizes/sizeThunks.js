import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosHandler from '@/services/axiosHandler';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchSizes = createAsyncThunk('sizes/fetchSizes', async (_, thunkAPI) => {
  try {
    const response = await axiosHandler.get(`${BASE_URL}/api/v1/sizes/getsizes`);
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

export const addSize = createAsyncThunk('sizes/addSize', async (data, thunkAPI) => {
  try {
    const response = await axiosHandler.post(`${BASE_URL}/api/v1/sizes/addsizes`, data);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

export const deleteSize = createAsyncThunk('sizes/deleteSize', async (id, thunkAPI) => {
  try {
    const response = await axiosHandler.delete(`${BASE_URL}/api/v1/sizes/deletesizes/${id}`);
    return { id, ...response.data };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

export const updateSize = createAsyncThunk('sizes/updateSize', async ({ id, data }, thunkAPI) => {
  try {
    const response = await axiosHandler.put(`${BASE_URL}/api/v1/sizes/updatesizes/${id}`, data);
    return { id, data: response.data };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

export const fetchSizeById = createAsyncThunk('sizes/fetchSizeById', async (id, thunkAPI) => {
  try {
    const response = await axiosHandler.get(`${BASE_URL}/api/v1/sizes/getsizes/${id}`);
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});
