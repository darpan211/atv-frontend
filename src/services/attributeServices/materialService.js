// const BASE_URL = import.meta.env.VITE_API_BASE_URL;
// // import axiosHandler from './axiosHandler';
// import axiosHandler from '../axiosHandler';

// export const getMaterials = async () => {
//   try {
//     const response = await axiosHandler.get(`${BASE_URL}/api/v1/material/getmaterial`);
//     return response.data.data;
//   } catch (error) {
//     console.error('Failed to fetch materials:', error);
//     throw error;
//   }
// };

// export const addMaterial = async data => {
//   try {
//     const response = await axiosHandler.post(`${BASE_URL}/api/v1/material/addmaterial`, data);
//     return response.data;
//   } catch (error) {
//     console.error('Failed to add material:', error);
//     throw error;
//   }
// };

// export const deleteMaterial = async id => {
//   try {
//     const response = await axiosHandler.delete(`${BASE_URL}/api/v1/material/deletematerial/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error('Failed to delete material:', error);
//     throw error;
//   }
// };

// export const getMaterialById = async id => {
//   try {
//     const response = await axiosHandler.get(`${BASE_URL}/api/v1/material/getmaterial/${id}`);
//     return response.data.data;
//   } catch (error) {
//     console.error('Failed to fetch material by ID:', error);
//     throw error;
//   }
// };

// export const updateMaterial = async (id, data) => {
//   try {
//     const response = await axiosHandler.put(
//       `${BASE_URL}/api/v1/material/updatematerial/${id}`,
//       data
//     );
//     return response.data;
//   } catch (error) {
//     console.error('Failed to update material:', error);
//     throw error;
//   }
// };
