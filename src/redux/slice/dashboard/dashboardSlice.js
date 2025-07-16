import { createSlice } from '@reduxjs/toolkit';
import { fetchDashboards } from './dashboardThunk';

const initialState = {
  dashboardData: [],
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    // your dashboard reducers...

    // 👇 Finish specific reducer
    clearSelectedFinish: state => {
      state.dashboardData = null;
      state.error = null;
    },
  },
  extraReducers: builder => {
    // your dashboard extraReducers...

    // 👇 Finish: fetchFinishes
    builder
      .addCase(fetchDashboards.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboards.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardData = action.payload;
      })
      .addCase(fetchDashboards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch finishes.';
      });
  },
});

export const { clearSelectedFinish } = dashboardSlice.actions;
export default dashboardSlice.reducer;