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
      state.error = null;
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
        state.list = action.payload.data;
      })
      .addCase(fetchMaterials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch materials.';
      })

      // fetchMaterialById
      .addCase(fetchMaterialById.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMaterialById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedMaterial = action.payload;
      })
      .addCase(fetchMaterialById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch material by ID.';
      })

      // addMaterial
      .addCase(addMaterial.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMaterial.fulfilled, (state, action) => {
        console.log('Material added:', action.payload.data);
        state.loading = false;
        state.list = [...state.list, action.payload.data];
      })
      .addCase(addMaterial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to add material.';
      })

      // updateMaterial
      .addCase(updateMaterial.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMaterial.fulfilled, (state, action) => {
        console.log('Material updated:', action.payload.data.data);
        state.loading = false;
        const id = action.payload.data.data._id;
        const index = state.list.findIndex(mat => mat._id === id);
        if (index !== -1) {
          state.list[index] = action.payload.data.data;
        }
        if (state.selectedMaterial && state.selectedMaterial._id === id) {
          state.selectedMaterial = action.payload.data.data;
        }
      })
      .addCase(updateMaterial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update material.';
      })

      // deleteMaterial
      .addCase(deleteMaterial.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMaterial.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter(item => item._id !== action.payload.data._id);
        if (state.selectedMaterial && state.selectedMaterial._id === action.payload.data._id) {
          state.selectedMaterial = null;
        }
      })
      .addCase(deleteMaterial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete material.';
      });
  },
});

export const { clearSelectedMaterial } = materialSlice.actions;
export default materialSlice.reducer;
