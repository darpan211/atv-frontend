// import { createAsyncThunk } from '@reduxjs/toolkit';
// import axiosHandler from '../../../services/axiosHandler';

// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// // 🔹 Fetch all rooms
// export const fetchRooms = createAsyncThunk('rooms/fetchRooms', async (_, thunkAPI) => {
//   try {
//     const response = await axiosHandler.get(`${BASE_URL}/api/v1/rooms/getroom`);
//     return response.data.data;
//   } catch (error) {
//     return thunkAPI.rejectWithValue(error.response?.data || error.message);
//   }
// });

// // 🔹 Add room
// export const addRoom = createAsyncThunk('rooms/addRoom', async (formData, thunkAPI) => {
//   try {
//     const response = await axiosHandler.post(`${BASE_URL}/api/v1/rooms/createroom`, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//     return response.data;
//   } catch (error) {
//     return thunkAPI.rejectWithValue(error.response?.data || error.message);
//   }
// });

// // 🔹 Delete room
// export const deleteRoom = createAsyncThunk('rooms/deleteRoom', async (id, thunkAPI) => {
//   try {
//     const response = await axiosHandler.delete(`${BASE_URL}/api/v1/rooms/deleteroom/${id}`);
//     return { id, ...response.data };
//   } catch (error) {
//     return thunkAPI.rejectWithValue(error.response?.data || error.message);
//   }
// });

// // 🔹 Fetch room by ID
// export const fetchRoomById = createAsyncThunk('rooms/fetchRoomById', async (id, thunkAPI) => {
//   try {
//     const response = await axiosHandler.get(`${BASE_URL}/api/v1/rooms/getroom/${id}`);
//     return response.data.data;
//   } catch (error) {
//     return thunkAPI.rejectWithValue(error.response?.data || error.message);
//   }
// });

// // 🔹 Update room
// export const updateRoom = createAsyncThunk(
//   'rooms/updateRoom',
//   async ({ id, formData }, thunkAPI) => {
//     try {
//       const response = await axiosHandler.put(
//         `${BASE_URL}/api/v1/rooms/updateroom/${id}`,
//         formData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         }
//       );
//       return { id, data: response.data };
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );
import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosHandler from '../../../services/axiosHandler';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 🔹 Fetch all rooms
export const fetchRooms = createAsyncThunk('rooms/fetchRooms', async (_, thunkAPI) => {
  try {
    const response = await axiosHandler.get(`${BASE_URL}/api/v1/rooms/getroom`);
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// 🔹 Add room
export const addRoom = createAsyncThunk('rooms/addRoom', async (formData, thunkAPI) => {
  try {
    const response = await axiosHandler.post(`${BASE_URL}/api/v1/rooms/createroom`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// 🔹 Delete room
export const deleteRoom = createAsyncThunk('rooms/deleteRoom', async (id, thunkAPI) => {
  try {
    const response = await axiosHandler.delete(`${BASE_URL}/api/v1/rooms/deleteroom/${id}`);
    return { id, ...response.data };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// 🔹 Fetch room by ID
export const fetchRoomById = createAsyncThunk('rooms/fetchRoomById', async (id, thunkAPI) => {
  try {
    const response = await axiosHandler.get(`${BASE_URL}/api/v1/rooms/getroom/${id}`);
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// 🔹 Update room
export const updateRoom = createAsyncThunk(
  'rooms/updateRoom',
  async ({ id, formData }, thunkAPI) => {
    try {
      const response = await axiosHandler.put(
        `${BASE_URL}/api/v1/rooms/updateroom/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return { id, data: response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);
