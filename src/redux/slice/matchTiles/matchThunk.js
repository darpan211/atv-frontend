import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosHandler from '../../../services/axiosHandler';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

// Add match tiles
export const addMatchTiles = createAsyncThunk(
  'match/addMatchTiles',
  async ({ tiles_id, match_tiles_id }, thunkAPI) => {
    try {
      const res = await axiosHandler.post(
        `${BASE_URL}/api/v1/matchtiles/addmatchtiles`,
        { tiles_id, match_tiles_id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);
// Fetch all matches
export const fetchMatches = createAsyncThunk('match/fetchAll', async (_, thunkAPI) => {
  try {
    const res = await axiosHandler.get(`${BASE_URL}/api/v1/matchtiles/matchtiles`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
    });
    return res.data.result;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// Delete a match
export const deleteMatch = createAsyncThunk('match/delete', async (id, thunkAPI) => {
  try {
    const res = await axiosHandler.delete(`${BASE_URL}/api/v1/matchtiles/deletematchtiles/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
    });
    return { id, ...res.data };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});