import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosHandler from '@/services/axiosHandler';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
// ✅ Fetch all dashboards
export const fetchDashboards = createAsyncThunk(
  'dashboard/fetchDashboards',
  async (action, thunkAPI) => {
    try {
      console.log(action, 'action');
      const token = localStorage.getItem('authToken');

      if (!token) {
        return thunkAPI.rejectWithValue('Token not found');
      }

      //Decode JWT manually
      const decodedPayload = JSON.parse(atob(token.split('.')[1]));
      const userId = decodedPayload?.userId || decodedPayload?._id;
      console.log(userId, 'decodedPayload');
      if (!userId) {
        return thunkAPI.rejectWithValue('User ID not found in token');
      }
      console.log(userId, 'userId');

      const response = await axiosHandler.get(
        `${BASE_URL}/api/v1/configure/getconfigure/${userId}`
      );
      console.log(response.data.data, 'response dashbord thunk');

      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ Add a dashboard
export const addDashboard = createAsyncThunk('dashboard/addDashboard', async (data, thunkAPI) => {
  try {
    const response = await axiosHandler.post('/api/v1/dashboard/adddashboard', data);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// ✅ Delete a dashboard
export const deleteDashboard = createAsyncThunk(
  'dashboard/deleteDashboard',
  async (id, thunkAPI) => {
    try {
      const response = await axiosHandler.delete(`/api/v1/dashboard/deletedashboard/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ Get dashboard by ID
export const getDashboardById = createAsyncThunk(
  'dashboard/getDashboardById',
  async (id, thunkAPI) => {
    try {
      const response = await axiosHandler.get(`/api/v1/dashboard/getdashboard/${id}`);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ Update a dashboard
export const updateDashboard = createAsyncThunk(
  'dashboard/updateDashboard',
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await axiosHandler.put(`/api/v1/dashboard/updatedashboard/${id}`, data);
      return { id, data: response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);
