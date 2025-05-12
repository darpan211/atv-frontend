// eslint-disable-next-line no-unused-vars
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Sample async thunk that simulates fetching data
// export const fetchCounterValue = createAsyncThunk(
//   "counter/fetchValue",
//   async (_, { rejectWithValue }) => {
//     try {
//       // Simulating API call
//       const response = await new Promise((resolve) => {
//         setTimeout(() => {
//           resolve({ data: Math.floor(Math.random() * 100) });
//         }, 1000);
//       });

//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.message || "Failed to fetch counter value");
//     }
//   }
// );

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload.user;
    },
    resetAuth: state => {
      state.token = null;
    },
  },
  //   extraReducers: (builder) => {
  //     builder
  //       // Handle fetchCounterValue thunk
  //       .addCase(fetchCounterValue.pending, (state) => {
  //         state.status = "loading";
  //       })
  //       .addCase(fetchCounterValue.fulfilled, (state, action) => {
  //         state.status = "succeeded";
  //         state.value = action.payload;
  //         state.error = null;
  //       })
  //       .addCase(fetchCounterValue.rejected, (state, action) => {
  //         state.status = "failed";
  //         state.error = action.payload;
  //       });
  //   },
});

export const { setToken, resetAuth } = authSlice.actions;
export default authSlice.reducer;
