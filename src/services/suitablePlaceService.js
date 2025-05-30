const BASE_URL = import.meta.env.VITE_API_BASE_URL;
import axiosHandler from './axiosHandler';
export const getSuitablePlaces = async () => {
  try {
    const response = await axiosHandler.get(`${BASE_URL}/api/v1/suitablePlace/getsuitablePlace`);
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch suitable places:', error);
    throw error;
  }
};

export const addSuitablePlace = async data => {
  try {
    const response = await axiosHandler.post(
      `${BASE_URL}/api/v1/suitablePlace/addsuitablePlace`,
      data
    );
    return response.data;
  } catch (error) {
    console.error('Failed to add suitable place:', error);
    throw error;
  }
};

export const deleteSuitablePlace = async id => {
  try {
    const response = await axiosHandler.delete(
      `${BASE_URL}/api/v1/suitablePlace/deletesuitablePlace/${id}`
    );
    return response.data;
  } catch (error) {
    console.error('Failed to delete suitable place:', error);
    throw error;
  }
};

export const getSuitablePlaceById = async id => {
  try {
    const response = await axiosHandler.get(
      `${BASE_URL}/api/v1/suitablePlace/getsuitablePlace/${id}`
    );
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch suitable place:', error);
    throw error;
  }
};

export const updateSuitablePlace = async (id, data) => {
  try {
    const response = await axiosHandler.put(
      `${BASE_URL}/api/v1/suitablePlace/updatesuitablePlace/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error('Failed to update suitable place:', error);
    throw error;
  }
};
