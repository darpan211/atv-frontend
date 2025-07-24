import { createSlice } from '@reduxjs/toolkit';
import { fetchMatches, deleteMatch,addMatchTiles } from './matchThunk';

const initialState = {
  list: [],
  loading: false,
  error: null,
  success: false,
  deletingId: null,
};

const matchSlice = createSlice({
  name: 'match',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; },
    clearSuccess: (state) => { state.success = false; },
    resetState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.deletingId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all matches
      .addCase(fetchMatches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMatches.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchMatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch matches';
      })
      // Delete match
      .addCase(deleteMatch.pending, (state, action) => {
        state.deletingId = action.meta.arg;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteMatch.fulfilled, (state, action) => {
        state.deletingId = null;
        state.success = true;
        state.list = state.list.filter(m => m._id !== action.payload.id);
      })
      .addCase(deleteMatch.rejected, (state, action) => {
        state.deletingId = null;
        state.error = action.payload?.message || 'Failed to delete match';
        state.success = false;
      })
      .addCase(addMatchTiles.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(addMatchTiles.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.list.push(action.payload.data);
      })
      .addCase(addMatchTiles.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message || 'Failed to add match tiles';
      })
  },
});

export const { clearError, clearSuccess, resetState } = matchSlice.actions;
export default matchSlice.reducer;