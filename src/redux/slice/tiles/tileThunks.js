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
// export const fetchTiles = createAsyncThunk('tiles/fetchTiles', async (queryParams = {}, thunkAPI) => {
//   try {
//     // Convert array values to comma-separated strings
//     const normalizedParams = {};
//     Object.entries(queryParams).forEach(([key, value]) => {
//       normalizedParams[key] = Array.isArray(value) ? value.join(',') : value;
//     });
//     const queryString = new URLSearchParams(normalizedParams).toString();
//     const response = await axiosHandler.get(`${BASE_URL}/api/v1/tiles/gettiles?${queryString}`);
//     return response.data.data;
//   } catch (error) {
//     return thunkAPI.rejectWithValue(error.response?.data || error.message);
//   }
// });

export const fetchTiles = createAsyncThunk(
  'tiles/fetchTiles',
  async (queryParams = {}, { rejectWithValue }) => {
    try {
      // Normalize query parameters: convert arrays to comma-separated strings
      const normalizedParams = {};
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value) {
          // Only include non-empty values
          normalizedParams[key] = Array.isArray(value) ? value.join(',') : value;
        }
      });

      // Construct query string
      const queryString = new URLSearchParams(normalizedParams).toString();
      const url = `${BASE_URL}/api/v1/tiles/gettiles${queryString ? `?${queryString}` : ''}`;

      // Make API request
      const response = await axiosHandler.get(url);

      // Validate response data
      if (!response.data || !response.data.data) {
        throw new Error('Invalid response format: No data found');
      }

      return response.data.data; // Return the tiles data
    } catch (error) {
      // Log error for debugging
      console.error('Error fetching tiles:', error.message);
      // Return detailed error information
      return rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status || 500,
      });
    }
  }
);

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

export const getfilteredtiles = createAsyncThunk('tiles/getfilteredtiles', async (_, thunkAPI) => {
  try {
    const response = await axiosHandler.get(`${BASE_URL}/api/v1/tiles/getfilteredtiles`);
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});
