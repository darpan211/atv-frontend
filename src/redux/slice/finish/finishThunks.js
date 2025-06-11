import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosHandler from '@/services/axiosHandler';

// Fetch all finishes
export const fetchFinishes = createAsyncThunk('finish/fetchFinishes', async (_, thunkAPI) => {
  try {
    const response = await axiosHandler.get('/api/v1/finish/getfinish');
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// Add finish
export const addFinish = createAsyncThunk('finish/addFinish', async (data, thunkAPI) => {
  try {
    const response = await axiosHandler.post('/api/v1/finish/addfinish', data);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// Delete finish
export const deleteFinish = createAsyncThunk('finish/deleteFinish', async (id, thunkAPI) => {
  try {
    const response = await axiosHandler.delete(`/api/v1/finish/deletefinish/${id}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// Fetch finish by ID
export const getFinishById = createAsyncThunk('finish/getFinishById', async (id, thunkAPI) => {
  try {
    const response = await axiosHandler.get(`/api/v1/finish/getfinish/${id}`);
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// Update finish
export const updateFinish = createAsyncThunk('finish/updateFinish', async ({ id, data }, thunkAPI) => {
  try {
    const response = await axiosHandler.put(`/api/v1/finish/updatefinish/${id}`, data);
    return { id, data: response.data };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});