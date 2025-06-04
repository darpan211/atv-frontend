// import axiosHandler from './axiosHandler';
// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// // Add a new tile
// export const addTile = async data => {
//   try {
//     const response = await axiosHandler.post(`${BASE_URL}/api/v1/tiles/addtiles`, data);
//     return response.data;
//   } catch (error) {
//     console.error('Failed to add tile:', error);
//     throw error;
//   }
// };

// // Get all tiles
// export const getTiles = async () => {
//   try {
//     const response = await axiosHandler.get(`${BASE_URL}/api/v1/tiles/gettiles`);
//     return response.data.data;
//   } catch (error) {
//     console.error('Failed to fetch tiles:', error);
//     throw error;
//   }
// };

// // Get tile by ID
// export const getTileById = async id => {
//   try {
//     const response = await axiosHandler.get(`${BASE_URL}/api/v1/tiles/gettiles/${id}`);
//     return response.data.data;
//   } catch (error) {
//     console.error('Failed to fetch tile by ID:', error);
//     throw error;
//   }
// };

// // Update tile
// export const updateTile = async (id, data) => {
//   try {
//     const response = await axiosHandler.put(`${BASE_URL}/api/v1/tiles/updatetiles/${id}`, data);
//     return response.data;
//   } catch (error) {
//     console.error('Failed to update tile:', error);
//     throw error;
//   }
// };

// // Delete tile
// export const deleteTile = async id => {
//   try {
//     const response = await axiosHandler.delete(`${BASE_URL}/api/v1/tiles/deletetiles/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error('Failed to delete tile:', error);
//     throw error;
//   }
// };
