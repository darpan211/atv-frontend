import { createSlice } from '@reduxjs/toolkit';
import { 
    fetchAllConfigs,
    fetchConfigById,
    createMasterConfig,
    updateMasterConfig,
    deleteMasterConfig
 } from './configThunk';



const masterConfigSlice = createSlice({
  name: 'masterConfig',
  initialState: {
    configs: [],
    current: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrent: (state) => {
      state.current = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchAllConfigs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllConfigs.fulfilled, (state, action) => {
        state.loading = false;
        state.configs = action.payload;
      })
      .addCase(fetchAllConfigs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch by ID
      .addCase(fetchConfigById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConfigById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchConfigById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createMasterConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMasterConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.configs.push(action.payload);
      })
      .addCase(createMasterConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update
      .addCase(updateMasterConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMasterConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.configs = state.configs.map((c) =>
          c._id === action.payload._id ? action.payload : c
        );
      })
      .addCase(updateMasterConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete
      .addCase(deleteMasterConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMasterConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.configs = state.configs.filter((c) => c._id !== action.payload);
      })
      .addCase(deleteMasterConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearCurrent, clearError } = masterConfigSlice.actions;
export default masterConfigSlice.reducer;