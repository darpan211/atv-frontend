import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosHandler from '../../../services/axiosHandler';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 1. Register User
export const register = createAsyncThunk('auth/register', async (credentials, thunkAPI) => {
  try {
    const response = await axiosHandler.post(`${BASE_URL}/api/v1/auth/register`, credentials);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

export const login = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
  try {
    const response = await axiosHandler.post(`${BASE_URL}/api/v1/auth/login`, credentials);

    const { token, user } = response.data.data; // <-- note the `.data.data`

    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));

    return response.data.data; // return the data object that contains token & user
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// 3. Fetch Authenticated User
export const fetchUser = createAsyncThunk('auth/fetchUser', async (_, thunkAPI) => {
  try {
    const response = await axiosHandler.get(`${BASE_URL}/api/v1/auth/getuser`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// 4. Update User
export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async ({ id, userData }, thunkAPI) => {
    try {
      const response = await axiosHandler.put(`${BASE_URL}/api/v1/auth/updateuser/${id}`, userData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 5. Delete User
export const deleteUser = createAsyncThunk('auth/deleteUser', async (id, thunkAPI) => {
  try {
    const response = await axiosHandler.delete(`${BASE_URL}/api/v1/auth/deleteuser/${id}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});
