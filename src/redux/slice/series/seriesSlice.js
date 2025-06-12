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
      state.error = null;
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
        state.error = action.payload || 'Failed to fetch series.';
      })

      // Fetch by ID
      .addCase(fetchSeriesById.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSeriesById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedSeries = action.payload;
      })
      .addCase(fetchSeriesById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch series by ID.';
      })

      // Add
      .addCase(addSeries.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSeries.fulfilled, (state, action) => {
        state.loading = false;
        state.list.data.push(action.payload.data);
      })
      .addCase(addSeries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to add series.';
      })

      // Delete
      .addCase(deleteSeries.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSeries.fulfilled, (state, action) => {
        state.loading = false;
        state.list.data = state.list.data.filter(item => item._id !== action.payload.id);
      })
      .addCase(deleteSeries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete series.';
      })

      // Update
      .addCase(updateSeries.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSeries.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.data.findIndex(series => series._id === action.payload.id);
        if (index !== -1) {
          state.list.data[index] = { ...state.list.data[index], ...action.payload.data.data };
        }
      })
      .addCase(updateSeries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update series.';
      });
  },
});

export const { clearSelectedSeries } = seriesSlice.actions;
export default seriesSlice.reducer;
