import { createSlice } from '@reduxjs/toolkit';
import { fetchRooms, addRoom, deleteRoom, fetchRoomById, updateRoom } from './roomThunks';

// const initialState = {
//   list: [],
//   selectedRoom: null,
//   loading: false,
//   error: null,
// };
const initialState = {
  list: [],
  selectedRoom: null,
  loading: false,
  error: null,

  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  rowsPerPage: 10,
};

const roomSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    clearSelectedRoom: state => {
      state.selectedRoom = null;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      // Fetch Rooms
      // .addCase(fetchRooms.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      // })
      // .addCase(fetchRooms.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.list = action.payload;
      // })
      // .addCase(fetchRooms.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.payload || 'Failed to fetch rooms.';
      // })

      .addCase(fetchRooms.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.rooms || action.payload.data; // the array of rooms
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      })

      // Fetch Room by ID
      .addCase(fetchRoomById.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoomById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedRoom = action.payload;
      })
      .addCase(fetchRoomById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch room by ID.';
      })

      // Add Room
      .addCase(addRoom.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.list.data?.push?.(action.payload.data); // if `list` is object
        if (Array.isArray(state.list)) state.list.push(action.payload.data); // if `list` is array
      })
      .addCase(addRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to add room.';
      })

      // Update Room
      .addCase(updateRoom.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRoom.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.data?.findIndex?.(room => room._id === action.payload.id);
        if (index !== -1 && state.list.data) {
          state.list.data[index] = {
            ...state.list.data[index],
            ...action.payload.data.data,
          };
        } else {
          const arrayIndex = state.list.findIndex(room => room._id === action.payload.id);
          if (arrayIndex !== -1) {
            state.list[arrayIndex] = {
              ...state.list[arrayIndex],
              ...action.payload.data.data,
            };
          }
        }

        if (state.selectedRoom && state.selectedRoom._id === action.payload.id) {
          state.selectedRoom = {
            ...state.selectedRoom,
            ...action.payload.data.data,
          };
        }
      })
      .addCase(updateRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update room.';
      })

      // Delete Room
      .addCase(deleteRoom.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.list.data = state.list.data?.filter?.(item => item._id !== action.payload.id);
        state.list = state.list?.filter?.(item => item._id !== action.payload.id) || state.list;

        if (state.selectedRoom && state.selectedRoom._id === action.payload.id) {
          state.selectedRoom = null;
        }
      })
      .addCase(deleteRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete room.';
      });
  },
});

export const { clearSelectedRoom } = roomSlice.actions;
export default roomSlice.reducer;
