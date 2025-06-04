import { createSlice } from '@reduxjs/toolkit';
import {
  fetchTiles,
  // fetchTilesByCategory,
  fetchTileById,
  addTile,
  updateTile,
  deleteTile,
} from '@/redux/slice/tiles/tileThunks';

const initialState = {
  tiles: [],
  selectedTile: null,
  loading: false,
  error: null,
  success: false, // optional: track success for add/edit/delete
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
    },
  },
  extraReducers: builder => {
    builder
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
        state.tiles.push(action.payload);
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
