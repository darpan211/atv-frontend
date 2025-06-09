import { createSlice } from '@reduxjs/toolkit';
import {
  fetchSellers,
  registerSeller,
  deleteSeller,
  fetchSellerById,
  updateSeller,
} from './sellerThunks';

const initialState = {
  list: [],
  currentSeller: null,
  loading: false,
  error: null,
  success: false,
};

const sellerSlice = createSlice({
  name: 'seller',
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
      // Register Seller
      .addCase(registerSeller.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerSeller.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        if (action.payload.data) {
          state.list.push(action.payload.data);
        }
      })
      .addCase(registerSeller.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to register seller';
        state.success = false;
      })
      // Fetch All Sellers
      .addCase(fetchSellers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchSellers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch sellers';
      })
      // Fetch Seller by ID
      .addCase(fetchSellerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSeller = action.payload;
      })
      .addCase(fetchSellerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch seller';
      })
      // Update Seller
      .addCase(updateSeller.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateSeller.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const index = state.list.findIndex(seller => seller._id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload.data.data;
        }
        state.currentSeller = action.payload.data.data;
      })
      .addCase(updateSeller.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update seller';
        state.success = false;
      })
      // Delete Seller
      .addCase(deleteSeller.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteSeller.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.list = state.list.filter(seller => seller._id !== action.payload.data._id);
        if (state.currentSeller?._id === action.payload.data._id) {
          state.currentSeller = null;
        }
      })
      .addCase(deleteSeller.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete seller';
        state.success = false;
      });
  },
});

export const { clearError, clearSuccess, resetState } = sellerSlice.actions;
export default sellerSlice.reducer; 