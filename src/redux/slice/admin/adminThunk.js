import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosHandler from '../../../services/axiosHandler';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Fetch all admins
export const fetchAdmins = createAsyncThunk('admin/fetchAdmins', async (_, thunkAPI) => {
  try {
    const response = await axiosHandler.get(`${BASE_URL}/api/v1/admin/getuser`);
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// Register new admin
export const registerAdmin = createAsyncThunk('admin/register', async (data, thunkAPI) => {
  try {
    const response = await axiosHandler.post(`${BASE_URL}/api/v1/admin/createuser`, data);
    const adminId = response.data.data._id;
    const adminResponse = await axiosHandler.get(`${BASE_URL}/api/v1/admin/getuser/${adminId}`);
    return adminResponse.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// Delete admin
export const deleteAdmin = createAsyncThunk('admin/delete', async (id, thunkAPI) => {
  try {
    const response = await axiosHandler.delete(`${BASE_URL}/api/v1/admin/deleteUser/${id}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// Fetch admin by ID
export const fetchAdminById = createAsyncThunk('admin/fetchById', async (id, thunkAPI) => {
  try {
    const response = await axiosHandler.get(`${BASE_URL}/api/v1/admin/getuser/${id}`);
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// Update admin
export const updateAdmin = createAsyncThunk('admin/update', async ({ id, data }, thunkAPI) => {
  try {
    const response = await axiosHandler.put(`${BASE_URL}/api/v1/admin/updateUser/${id}`, data);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});
