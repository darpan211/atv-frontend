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
        state.list.data.push(action.payload.data);
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
        state.list.data = state.list.data.filter(item => item._id !== action.payload.id);
        if (state.selectedSize && state.selectedSize._id === action.payload.id) {
          state.selectedSize = null;
        }
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
        const index = state.list.data.findIndex(size => size._id === action.payload.id);
        if (index !== -1) {
          state.list.data[index] = {
            ...state.list.data[index],
            ...action.payload.data.data,
          };
        }
        if (state.selectedSize && state.selectedSize._id === action.payload.id) {
          state.selectedSize = {
            ...state.selectedSize,
            ...action.payload.data.data,
          }
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
