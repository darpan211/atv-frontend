import axios from 'axios';
const baserUrl = import.meta.env.VITE_API_BASE_URL;
// Create a pre-configured Axios instance
const API = axios.create({
  baseURL: `${baserUrl}/api/v1`,
  withCredentials: true, // Useful if using cookies/sessions
});

// 1. REGISTER - ✅ Correct
export const registerUser = async credentials => {
  const res = await API.post('/auth/register', credentials);
  return res.data;
};

// 2. LOGIN - ✅ Correct
export const loginUser = async credentials => {
  const res = await API.post('/auth/login', credentials);
  return res.data;
};

// 3. GET USER - ✅ Correct
export const getUser = async () => {
  const res = await API.get('/auth/getuser');
  return res.data;
};

// 4. UPDATE USER - ✅ Correct
export const updateUser = async (id, userData) => {
  const res = await API.put(`/auth/updateuser/${id}`, userData);
  return res.data;
};

// 5. DELETE USER - ✅ Correct
export const deleteUser = async id => {
  const res = await API.delete(`/auth/deleteuser/${id}`);
  return res.data;
};
