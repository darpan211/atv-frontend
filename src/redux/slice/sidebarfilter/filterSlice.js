import { createSlice } from '@reduxjs/toolkit';
import { fetchSidebarFilters } from './filterThunks';

const initialState = {
  list: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: 'sidebarFilters',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSidebarFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSidebarFilters.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchSidebarFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch sidebar categories.';
      });
  },
});

export default categorySlice.reducer;
