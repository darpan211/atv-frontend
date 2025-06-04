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
    },
  },
  extraReducers: builder => {
    builder
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
        state.error = action.payload;
      })

      .addCase(fetchColorById.fulfilled, (state, action) => {
        state.selectedColor = action.payload;
      })

      .addCase(addColor.fulfilled, (state, action) => {
        state.list.push(action.payload.data);
      })

      .addCase(deleteColor.fulfilled, (state, action) => {
        state.list = state.list.filter(item => item._id !== action.payload);
      })

      .addCase(updateColor.fulfilled, (state, action) => {
        const index = state.list.findIndex(color => color._id === action.payload.id);
        if (index !== -1) {
          state.list[index] = { ...state.list[index], ...action.payload.data };
        }
      });
  },
});

export const { clearSelectedColor } = colorSlice.actions;
export default colorSlice.reducer;
