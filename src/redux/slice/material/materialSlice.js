import { createSlice } from '@reduxjs/toolkit';
import {
  fetchMaterials,
  addMaterial,
  deleteMaterial,
  fetchMaterialById,
  updateMaterial,
} from './materialThunks';

const initialState = {
  list: [],
  selectedMaterial: null,
  loading: false,
  error: null,
};

const materialSlice = createSlice({
  name: 'materials',
  initialState,
  reducers: {
    clearSelectedMaterial: state => {
      state.selectedMaterial = null;
    },
  },
  extraReducers: builder => {
    builder
      // fetchMaterials
      .addCase(fetchMaterials.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMaterials.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchMaterials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchMaterialById
      .addCase(fetchMaterialById.fulfilled, (state, action) => {
        state.selectedMaterial = action.payload;
      })

      // addMaterial
      .addCase(addMaterial.fulfilled, (state, action) => {
        state.list.push(action.payload.data);
      })

      // deleteMaterial
      .addCase(deleteMaterial.fulfilled, (state, action) => {
        // action.meta.arg holds the id passed to deleteMaterial thunk
        state.list = state.list.filter(item => item._id !== action.meta.arg);
      })

      // updateMaterial
      .addCase(updateMaterial.fulfilled, (state, action) => {
        // action.meta.arg is the object { id, data }, so get id from arg.id
        const id = action.meta.arg.id;
        const index = state.list.findIndex(mat => mat._id === id);
        if (index !== -1) {
          // action.payload.data is the updated material data
          state.list[index] = { ...state.list[index], ...action.payload.data };
        }
      });
  },
});

export const { clearSelectedMaterial } = materialSlice.actions;
export default materialSlice.reducer;
