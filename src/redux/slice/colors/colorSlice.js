import { createSlice } from '@reduxjs/toolkit';
import { fetchColors, addColor, updateColor, deleteColor, fetchColorById } from './colorThunks.js';

const initialState = {
  list: [],
  selectedColor: null,
  loading: false,
  error: null,
};

const colorSlice = createSlice({
  name: 'colors',
  initialState,
  reducers: {
    clearSelectedColor: state => {
      state.selectedColor = null;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      // fetchColors
      .addCase(fetchColors.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchColors.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchColors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch colors.';
      })

      // fetchColorById
      .addCase(fetchColorById.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchColorById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedColor = action.payload;
      })
      .addCase(fetchColorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch color by ID.';
      })

      // addColor
      .addCase(addColor.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addColor.fulfilled, (state, action) => {
        state.loading = false;
        state.list.data.push(action.payload.data);
      })
      .addCase(addColor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to add color.';
      })

      // updateColor
      .addCase(updateColor.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateColor.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.data.findIndex(color => color._id === action.payload.id);
        if (index !== -1) {
          state.list.data[index] = { 
            ...state.list.data[index], 
            ...action.payload.data.data 
          };
        }
        if (state.selectedColor && state.selectedColor._id === action.payload.id) {
          state.selectedColor = { 
            ...state.selectedColor, 
            ...action.payload.data.data 
          };
        }
      })
      .addCase(updateColor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update color.';
      })

      // deleteColor
      .addCase(deleteColor.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteColor.fulfilled, (state, action) => {
        state.loading = false;
        state.list.data = state.list.data.filter(item => item._id !== action.payload.id);
        if (state.selectedColor && state.selectedColor._id === action.payload.id) {
          state.selectedColor = null;
        }
      })
      .addCase(deleteColor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete color.';
      });
  },
});

export const { clearSelectedColor } = colorSlice.actions;
export default colorSlice.reducer;
