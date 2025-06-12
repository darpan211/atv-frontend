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
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      // fetchCategories
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
        state.error = action.payload || 'Failed to fetch categories.';
      })

      // fetchCategoryById
      .addCase(fetchCategoryById.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCategory = action.payload;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch category by ID.';
      })

      // addCategory
      .addCase(addCategory.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.list.data.push(action.payload.data);
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to add category.';
      })

      // updateCategory
      .addCase(updateCategory.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.data.findIndex(cat => cat._id === action.payload.id);
        if (index !== -1) {
          state.list.data[index] = { 
            ...state.list.data[index],
            ...action.payload.data.data 
          };
        }
        if (state.selectedCategory && state.selectedCategory._id === action.payload.id) {
          state.selectedCategory = { 
            ...state.selectedCategory,
            ...action.payload.data.data 
          };
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update category.';
      })

      // deleteCategory
      .addCase(deleteCategory.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.list.data = state.list.data.filter(item => item._id !== action.payload.id);
        if (state.selectedCategory && state.selectedCategory._id === action.payload.id) {
          state.selectedCategory = null;
        }
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete category.';
      });
  },
});

export const { clearSelectedCategory } = categorySlice.actions;
export default categorySlice.reducer;
