import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosHandler from '../../../services/axiosHandler';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Fetch all sellers
export const fetchSellers = createAsyncThunk('seller/fetchSellers', async (_, thunkAPI) => {
  try {
    const response = await axiosHandler.get(`${BASE_URL}/api/v1/auth/getUser?role=seller`);
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// Register new seller
export const registerSeller = createAsyncThunk('seller/register', async (data, thunkAPI) => {
  try {
    const response = await axiosHandler.post(`${BASE_URL}/api/v1/auth/register`, data);
    // After successful registration, fetch the complete seller data
    const sellerResponse = await axiosHandler.get(`${BASE_URL}/api/v1/auth/getUserById/${response.data.data.userId}`);
    return sellerResponse.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// Delete seller
export const deleteSeller = createAsyncThunk('seller/delete', async (id, thunkAPI) => {
  try {
    const response = await axiosHandler.delete(`${BASE_URL}/api/v1/auth/deleteUser/${id}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// Fetch seller by ID
export const fetchSellerById = createAsyncThunk('seller/fetchById', async (id, thunkAPI) => {
  try {
    const response = await axiosHandler.get(`${BASE_URL}/api/v1/auth/getUserById/${id}`);
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// Update seller
export const updateSeller = createAsyncThunk('seller/update', async ({ id, data }, thunkAPI) => {
  try {
    const response = await axiosHandler.put(`${BASE_URL}/api/v1/auth/updateUser/${id}`, data);
    return { id, data: response.data };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
}); 