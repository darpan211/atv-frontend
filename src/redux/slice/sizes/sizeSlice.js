import { createSlice } from '@reduxjs/toolkit';
import { fetchSizes, addSize, updateSize, deleteSize, fetchSizeById } from './sizeThunks.js';

const initialState = {
  list: [],
  selectedSize: null,
  loading: false,
  error: null,
};

const sizeSlice = createSlice({
  name: 'sizes',
  initialState,
  reducers: {
    clearSelectedSize: state => {
      state.selectedSize = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchSizes.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSizes.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchSizes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchSizeById.fulfilled, (state, action) => {
        state.selectedSize = action.payload;
      })

      .addCase(addSize.fulfilled, (state, action) => {
        state.list.push(action.payload.data);
      })

      .addCase(deleteSize.fulfilled, (state, action) => {
        state.list = state.list.filter(item => item._id !== action.payload.id);
      })

      .addCase(updateSize.fulfilled, (state, action) => {
        const index = state.list.findIndex(size => size._id === action.payload.id);
        if (index !== -1) {
          state.list[index] = { ...state.list[index], ...action.payload.data };
        }
      });
  },
});

export const { clearSelectedSize } = sizeSlice.actions;
export default sizeSlice.reducer;
