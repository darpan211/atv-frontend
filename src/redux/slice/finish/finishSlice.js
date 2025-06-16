import { createSlice } from '@reduxjs/toolkit';
import {
  fetchFinishes,
  getFinishById,
  addFinish,
  updateFinish,
  deleteFinish,
} from './finishThunks';

const initialState = {
  list: [],
  selectedFinish: null,
  loading: false,
  error: null,
};

const finishSlice = createSlice({
  name: 'finish',
  initialState,
  reducers: {
    clearSelectedFinish: state => {
      state.selectedFinish = null;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      // fetchFinishes
      .addCase(fetchFinishes.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFinishes.fulfilled, (state, action) => {
        state.loading = false;
        // state.list = action.payload;
        state.list = action.payload;
      })
      .addCase(fetchFinishes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch finishes.';
      })

      // getFinishById
      .addCase(getFinishById.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFinishById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedFinish = action.payload;
      })
      .addCase(getFinishById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch finish by ID.';
      })

      // addFinish
      .addCase(addFinish.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFinish.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload.data);
      })
      .addCase(addFinish.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to add finish.';
      })

      // updateFinish
      .addCase(updateFinish.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFinish.fulfilled, (state, action) => {
        state.loading = false;
        const id = action.meta.arg.id;
        const index = state.list.findIndex(finish => finish._id === id);
        if (index !== -1) {
          state.list[index] = { ...state.list[index], ...action.payload.data.data };
        }
      })
      .addCase(updateFinish.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update finish.';
      })

      // deleteFinish
      .addCase(deleteFinish.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFinish.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter(item => item._id !== action.meta.arg);
      })
      .addCase(deleteFinish.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete finish.';
      });
  },
});

export const { clearSelectedFinish } = finishSlice.actions;
export default finishSlice.reducer; 