import { createSlice } from '@reduxjs/toolkit';
import {
  fetchSeries,
  addSeries,
  deleteSeries,
  fetchSeriesById,
  updateSeries,
} from './seriesThunks';

const initialState = {
  list: [],
  selectedSeries: null,
  loading: false,
  error: null,
};

const seriesSlice = createSlice({
  name: 'series',
  initialState,
  reducers: {
    clearSelectedSeries: state => {
      state.selectedSeries = null;
    },
  },
  extraReducers: builder => {
    builder
      // Fetch all
      .addCase(fetchSeries.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSeries.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchSeries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch by ID
      .addCase(fetchSeriesById.fulfilled, (state, action) => {
        state.selectedSeries = action.payload;
      })

      // Add
      .addCase(addSeries.fulfilled, (state, action) => {
        state.list.push(action.payload.data);
      })

      // Delete
      .addCase(deleteSeries.fulfilled, (state, action) => {
        state.list = state.list.filter(item => item._id !== action.meta.arg);
      })

      // Update
      .addCase(updateSeries.fulfilled, (state, action) => {
        const index = state.list.findIndex(series => series._id === action.meta.arg.id);
        if (index !== -1) {
          state.list[index] = { ...state.list[index], ...action.payload.data };
        }
      });
  },
});

export const { clearSelectedSeries } = seriesSlice.actions;
export default seriesSlice.reducer;
