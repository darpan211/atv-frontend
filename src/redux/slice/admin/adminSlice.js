import { createSlice } from '@reduxjs/toolkit';
import {
  fetchAdmins,
  registerAdmin,
  deleteAdmin,
  fetchAdminById,
  updateAdmin,
} from './adminThunk';

const initialState = {
  list: [],
  currentAdmin: null,
  loading: false,
  error: null,
  success: false,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    resetState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register Admin
      .addCase(registerAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        if (action.payload.data) {
          state.list.push(action.payload.data);
        }
      })
      .addCase(registerAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to register admin';
        state.success = false;
      })

      // Fetch All Admins
      .addCase(fetchAdmins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdmins.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchAdmins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch admins';
      })

      // Fetch Admin by ID
      .addCase(fetchAdminById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAdmin = action.payload;
      })
      .addCase(fetchAdminById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch admin';
      })

      // Update Admin
      .addCase(updateAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const index = state.list.findIndex(admin => admin._id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload.data.data;
        }
        state.currentAdmin = action.payload.data.data;
      })
      .addCase(updateAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update admin';
        state.success = false;
      })

      // Delete Admin
      .addCase(deleteAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.list = state.list.filter(admin => admin._id !== action.payload.data._id);
        if (state.currentAdmin?._id === action.payload.data._id) {
          state.currentAdmin = null;
        }
      })
      .addCase(deleteAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete admin';
        state.success = false;
      });
  },
});

export const { clearError, clearSuccess, resetState } = adminSlice.actions;
export default adminSlice.reducer;
