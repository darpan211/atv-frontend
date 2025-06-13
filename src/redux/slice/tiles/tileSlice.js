import { createSlice } from '@reduxjs/toolkit';
import {
  fetchTiles,
  // fetchTilesByCategory,
  fetchTileById,
  addTile,
  updateTile,
  deleteTile,
  getTileColors,
} from '@/redux/slice/tiles/tileThunks';

const initialState = {
  tiles: [],
  selectedTile: null,
  loading: false,
  error: null,
  success: false, // optional: track success for add/edit/delete
  detectedColors: [], // Add state for detected colors
  colorLoading: false, // Add loading state for color detection
  colorError: null, // Add error state for color detection
};

const tileSlice = createSlice({
  name: 'tiles',
  initialState,
  reducers: {
    clearSelectedTile: state => {
      state.selectedTile = null;
    },
    clearTilesState: state => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.detectedColors = [];
      state.colorLoading = false;
      state.colorError = null;
    },
  },
  extraReducers: builder => {
    builder
      // Get tile colors
      .addCase(getTileColors.pending, state => {
        state.colorLoading = true;
        state.colorError = null;
      })
      .addCase(getTileColors.fulfilled, (state, action) => {
        state.colorLoading = false;
        state.detectedColors = action.payload;
      })
      .addCase(getTileColors.rejected, (state, action) => {
        state.colorLoading = false;
        state.colorError = action.error.message;
      })

      // Fetch all tiles
      .addCase(fetchTiles.pending, state => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(fetchTiles.fulfilled, (state, action) => {
        state.loading = false;
        state.tiles = action.payload;
      })
      .addCase(fetchTiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch tile by id
      .addCase(fetchTileById.pending, state => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(fetchTileById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTile = action.payload;
      })
      .addCase(fetchTileById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Add tile
      .addCase(addTile.pending, state => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addTile.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload,"== Anurag Yadav == ",state.tiles);
        
        state.tiles.data.push(action.payload);
        state.success = true;
      })
      .addCase(addTile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Update tile
      .addCase(updateTile.pending, state => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateTile.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tiles.findIndex(tile => tile.id === action.payload.id);
        if (index !== -1) {
          state.tiles[index] = action.payload;
        }
        state.success = true;
      })
      .addCase(updateTile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Delete tile
      .addCase(deleteTile.pending, state => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteTile.fulfilled, (state, action) => {
        state.loading = false;
        state.tiles = state.tiles.filter(tile => tile.id !== action.payload);
        state.success = true;
      })
      .addCase(deleteTile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearSelectedTile, clearTilesState } = tileSlice.actions;
export default tileSlice.reducer;
