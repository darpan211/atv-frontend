import { deleteUser, getUser, loginUser, updateUser, registerUser } from '@/services/authService';
import { useState } from 'react';

export const useAuth = data => {
  const [user, setUser] = useState([]);

  const handleRegisterUser = async () => {
    const res = await registerUser(data);
    setUser(res);
    console.log(res);
  };

  const handleLoginUser = async data => {
    const res = await loginUser(data);
    setUser(res.data);
    console.log(res.data);
  };

  return [handleLoginUser, user];
};
