// suitablePlaceSlice.js
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
  //   reducers: {
  //     clearSuitablePlacesState: state => {
  //       state.selectedPlace = null;
  //       state.error = null;
  //     },
  //   },
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
        state.error = action.payload;
      })

      .addCase(fetchSuitablePlaceById.fulfilled, (state, action) => {
        state.selectedPlace = action.payload;
      })

      .addCase(addSuitablePlace.fulfilled, (state, action) => {
        state.list.push(action.payload.data);
      })

      .addCase(deleteSuitablePlace.fulfilled, (state, action) => {
        state.list = state.list.filter(item => item._id !== action.meta.arg);
      })

      .addCase(updateSuitablePlace.fulfilled, (state, action) => {
        const index = state.list.findIndex(place => place._id === action.meta.arg.id);
        if (index !== -1) {
          state.list[index] = { ...state.list[index], ...action.payload.data };
        }
      });
  },
});

export const { clearSuitablePlacesState } = suitablePlaceSlice.actions;
export default suitablePlaceSlice.reducer;
