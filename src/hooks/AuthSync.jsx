import { logout } from "@/redux/slice/auth/authSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
logout

const AuthSync = () => {
  const dispatch = useDispatch(); 
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    if (!token) {
      dispatch(logout());
    }
  }, [token, dispatch]);

  return null;
};

export default AuthSync;