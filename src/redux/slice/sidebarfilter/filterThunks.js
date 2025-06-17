// redux/slices/categoryThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosHandler from '@/services/axiosHandler';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Fetch Sidebar Categories Only
export const fetchSidebarFilters = createAsyncThunk(
  'categories/fetchSidebarFilter',
  async (_, thunkAPI) => {
    try {
      const response = await axiosHandler.get(`${BASE_URL}/api/v1/tiles/getfilteredtiles`);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);
