import { createSlice } from '@reduxjs/toolkit';
import {
  fetchCategories,
  addCategory,
  deleteCategory,
  fetchCategoryById,
  updateCategory,
} from './categoryThunks';

const initialState = {
  list: [],
  selectedCategory: null,
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearSelectedCategory: state => {
      state.selectedCategory = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCategories.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.selectedCategory = action.payload;
      })

      .addCase(addCategory.fulfilled, (state, action) => {
        state.list.push(action.payload.data);
      })

      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.list = state.list.filter(item => item._id !== action.meta.arg);
      })

      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.list.findIndex(cat => cat._id === action.meta.arg.id);
        if (index !== -1) {
          state.list[index] = { ...state.list[index], ...action.payload.data };
        }
      });
  },
});

export const { clearSelectedCategory } = categorySlice.actions;
export default categorySlice.reducer;
