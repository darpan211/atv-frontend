import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosHandler from '../../../services/axiosHandler';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

//  Fetch all categories
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const existingList = state?.categories?.list;
      if (!existingList || existingList?.length === 0) {
        const response = await axiosHandler.get(`${BASE_URL}/api/v1/attributes/getcategory`);
        return response.data.data;
      }
      return existingList;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Add category
export const addCategory = createAsyncThunk('categories/addCategory', async (data, thunkAPI) => {
  try {
    const response = await axiosHandler.post(`${BASE_URL}/api/v1/attributes/addcategory`, data);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

//  Delete category
export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id, thunkAPI) => {
    try {
      const response = await axiosHandler.delete(
        `${BASE_URL}/api/v1/attributes/deletecategory/${id}`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

//  Fetch category by ID
export const fetchCategoryById = createAsyncThunk(
  'categories/fetchCategoryById',
  async (id, thunkAPI) => {
    try {
      const response = await axiosHandler.get(`${BASE_URL}/api/v1/attributes/getcategory/${id}`);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

//  Update category
export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await axiosHandler.put(
        `${BASE_URL}/api/v1/attributes/updatecategory/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);
