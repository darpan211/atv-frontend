import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosHandler from '@/services/axiosHandler';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Get tile colors
export const getTileColors = createAsyncThunk(
  'tiles/getTileColors',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosHandler.post(`${BASE_URL}/api/v1/tiles/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to process images' });
    }
  }
);

// Fetch all tiles
export const fetchTiles = createAsyncThunk('tiles/fetchTiles', async (_, thunkAPI) => {
  try {
    const response = await axiosHandler.get(`${BASE_URL}/api/v1/tiles/gettiles`);
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// Add tile
export const addTile = createAsyncThunk('tiles/addTile', async (formData, thunkAPI) => {
  try {
    const response = await axiosHandler.post(`${BASE_URL}/api/v1/tiles/addtiles`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// Delete tile
export const deleteTile = createAsyncThunk('tiles/deleteTile', async (id, thunkAPI) => {
  try {
    const response = await axiosHandler.delete(`${BASE_URL}/api/v1/tiles/deletetiles/${id}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// Fetch tile by ID
export const fetchTileById = createAsyncThunk('tiles/fetchTileById', async (id, thunkAPI) => {
  try {
    const response = await axiosHandler.get(`${BASE_URL}/api/v1/tiles/gettiles/${id}`);
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// Update tile
export const updateTile = createAsyncThunk('tiles/updateTile', async ({ id, data }, thunkAPI) => {
  try {
    const response = await axiosHandler.put(`${BASE_URL}/api/v1/tiles/updatetiles/${id}`, data);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});
