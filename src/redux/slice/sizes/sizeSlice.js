import { createSlice } from '@reduxjs/toolkit';
import {
  fetchSizes,
  addSize,
  updateSize,
  deleteSize,
  fetchSizeById,
} from './sizeThunks.js';

const initialState = {
  list: [],
  selectedSize: null,
  loading: false,
  error: null,
  success: false,
};

const sizeSlice = createSlice({
  name: 'sizes',
  initialState,
  reducers: {
    clearSelectedSize: state => {
      state.selectedSize = null;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: builder => {
    builder
      // Fetch All
      .addCase(fetchSizes.pending, state => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(fetchSizes.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
        state.success = true;
      })
      .addCase(fetchSizes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch sizes.';
        state.success = false;
      })

      // Fetch by ID
      .addCase(fetchSizeById.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSizeById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedSize = action.payload;
      })
      .addCase(fetchSizeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch size by ID.';
      })

      // Add
      .addCase(addSize.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSize.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload.data);
      })
      .addCase(addSize.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to add size.';
      })

      // Delete
      .addCase(deleteSize.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSize.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter(item => item._id !== action.payload.id);
      })
      .addCase(deleteSize.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete size.';
      })

      // Update
      .addCase(updateSize.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSize.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex(size => size._id === action.payload.id);
        if (index !== -1) {
          state.list[index] = {
            ...state.list[index],
            ...action.payload.data.data,
          };
        }
      })
      .addCase(updateSize.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update size.';
      });
  },
});

export const { clearSelectedSize } = sizeSlice.actions;
export default sizeSlice.reducer;
