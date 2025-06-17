import { createSlice } from '@reduxjs/toolkit';
import {
  fetchSuitablePlaces,
  addSuitablePlace,
  deleteSuitablePlace,
  fetchSuitablePlaceById,
  updateSuitablePlace,
} from './suitablePlaceThunks';

const initialState = {
  list: [],
  selectedPlace: null,
  loading: false,
  error: null,
};

const suitablePlaceSlice = createSlice({
  name: 'suitablePlace',
  initialState,
  reducers: {
    clearSuitablePlacesState: state => {
      state.selectedPlace = null;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchSuitablePlaces.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuitablePlaces.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchSuitablePlaces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch suitable places.';
      })

      // fetchSuitablePlaceById
      .addCase(fetchSuitablePlaceById.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuitablePlaceById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPlace = action.payload;
      })
      .addCase(fetchSuitablePlaceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch suitable place by ID.';
      })

      // addSuitablePlace
      .addCase(addSuitablePlace.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSuitablePlace.fulfilled, (state, action) => {
        state.loading = false;
        state.list.data.push(action.payload.data);
      })
      .addCase(addSuitablePlace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to add suitable place.';
      })

      // updateSuitablePlace
      .addCase(updateSuitablePlace.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSuitablePlace.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.data.findIndex(place => place._id === action.payload.id);
        if (index !== -1) {
          state.list.data[index] = { 
            ...state.list.data[index], 
            ...action.payload.data.data 
          };
        }
        if (state.selectedPlace && state.selectedPlace._id === action.payload.id) {
          state.selectedPlace = {
            ...state.selectedPlace,
            ...action.payload.data.data,
          };
        }
      })
      .addCase(updateSuitablePlace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update suitable place.';
      })

      // deleteSuitablePlace
      .addCase(deleteSuitablePlace.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSuitablePlace.fulfilled, (state, action) => {
        state.loading = false;
        state.list.data = state.list.data.filter(item => item._id !== action.payload.id);
        if (state.selectedPlace && state.selectedPlace._id === action.payload.id) {
          state.selectedPlace = null;
        }
      })
      .addCase(deleteSuitablePlace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete suitable place.';
      });
  },
});

export const { clearSuitablePlacesState } = suitablePlaceSlice.actions;
export default suitablePlaceSlice.reducer;
