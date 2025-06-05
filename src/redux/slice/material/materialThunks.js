import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosHandler from '../../../services/axiosHandler';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Fetch all materials
export const fetchMaterials = createAsyncThunk('materials/fetchMaterials', async (_, thunkAPI) => {
  try {
    const state = thunkAPI.getState();
    const existingList = state?.materials?.list;
    if (!existingList || existingList?.length === 0) {
      const response = await axiosHandler.get(`${BASE_URL}/api/v1/material/getmaterial`);
      return response.data.data;
    }
    return existingList;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// Add material
export const addMaterial = createAsyncThunk('materials/addMaterial', async (data, thunkAPI) => {
  try {
    const response = await axiosHandler.post(`${BASE_URL}/api/v1/material/addmaterial`, data);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// Delete material
export const deleteMaterial = createAsyncThunk('materials/deleteMaterial', async (id, thunkAPI) => {
  try {
    const response = await axiosHandler.delete(`${BASE_URL}/api/v1/material/deletematerial/${id}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// Fetch material by ID
export const fetchMaterialById = createAsyncThunk(
  'materials/fetchMaterialById',
  async (id, thunkAPI) => {
    try {
      const response = await axiosHandler.get(`${BASE_URL}/api/v1/material/getmaterial/${id}`);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update material
export const updateMaterial = createAsyncThunk(
  'materials/updateMaterial',
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await axiosHandler.put(
        `${BASE_URL}/api/v1/material/updatematerial/${id}`,
        data
      );
      return { id, data: response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);
