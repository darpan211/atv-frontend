import axiosHandler from '@/services/axiosHandler';
import { createAsyncThunk } from '@reduxjs/toolkit';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const fetchAllConfigs = createAsyncThunk(
  'masterConfig/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosHandler.get(`${BASE_URL}/api/getconfigure`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchConfigById = createAsyncThunk(
  'masterConfig/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosHandler.get(`${BASE_URL}/api/getconfigure/${id}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const createMasterConfig = createAsyncThunk(
  'masterConfig/create',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosHandler.post(`${BASE_URL}/api/addslider`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateMasterConfig = createAsyncThunk(
  'masterConfig/update',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await axiosHandler.put(`${BASE_URL}/api/updateconfigure/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteMasterConfig = createAsyncThunk(
  'masterConfig/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axiosHandler.delete(`${BASE_URL}/api/deleteconfigure/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);