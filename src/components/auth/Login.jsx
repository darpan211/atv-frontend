import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageSlider } from '@/components/common/ImageSlider';
import { SLIDES } from '@/utils/constants';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../common/icons';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '@/redux/slice/auth/authThunks';
import { FaRegEye } from 'react-icons/fa';
import { FaRegEyeSlash } from 'react-icons/fa';
import Spinner from '../common/Spinner';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  rememberMe: Yup.boolean(),
});

const Login = () => {
  const dispatch = useDispatch();
  const authState = useSelector(state => state.auth);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (authState?.user?.user) {
      navigate('/admin/dashboard');
    }
  }, [authState?.user?.user, navigate]);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    validationSchema: LoginSchema,
    onSubmit: async values => {
      try {
        const resultAction = await dispatch(
          login({ email: values.email, password: values.password })
        );

        if (login.fulfilled.match(resultAction)) {
          console.log('Login successful');
          navigate('/admin/dashboard');
        } else {
          alert(resultAction.payload || 'Login failed. Please check your credentials.');
        }
      } catch (error) {
        alert('Login failed. Please check your credentials.');
      }
    },
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen justify-center items-stretch bg-white">
      <div className="hidden md:flex md:w-1/2 h-[40vh] md:h-auto lg:h-screen items-center justify-center">
        <ImageSlider slides={SLIDES} buttonShow={false} autoPlay={true} autoPlayInterval={4000} />
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-10 md:p-12 lg:p-16 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center md:text-left">
            <div className="mb-4 flex justify-center md:justify-start">
              <Icon name="Logo" height="69px" width="70px" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Login</h1>
            <p className="text-muted-foreground">Enter your credentials to access your account</p>
          </div>
          <form onSubmit={formik.handleSubmit} className="space-y-6" noValidate>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`h-12 ${formik.touched.email && formik.errors.email ? 'border-red-500' : ''}`}
                autoComplete="email"
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-base">
                  Password
                </Label>
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto text-sm font-normal text-[#6C4A34] cursor-pointer"
                  onClick={() => alert('Forgot password functionality would go here')}
                >
                  Forgot password?
                </Button>
              </div>

              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`h-12 ${formik.touched.password && formik.errors.password ? 'border-red-500' : ''}`}
                  autoComplete="current-password"
                />
                {formik.touched.password && formik.errors.password && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
                )}
                {showPassword ? (
                  <FaRegEye
                    className="absolute right-2 top-4"
                    onClick={() => setShowPassword(false)}
                  />
                ) : (
                  <FaRegEyeSlash
                    className="absolute right-2 top-4"
                    onClick={() => setShowPassword(true)}
                  />
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                className="custom-checkbox"
                checked={formik.values.rememberMe}
                onChange={e => formik.setFieldValue('rememberMe', e.target.checked)}
              />
              <Label
                htmlFor="rememberMe"
                className="text-sm font-normal cursor-pointer"
                onClick={() => formik.setFieldValue('rememberMe', !formik.values.rememberMe)}
              >
                Remember me
              </Label>
            </div>

            {authState.error && (
              <div className="text-red-600 text-center text-sm">
                {authState.error?.message || ''}
              </div>
            )}

            <Button
              type="submit"
              disabled={authState?.loading}
              className="w-full h-12 text-base bg-[#6C4A34] hover:bg-[#5c3a24] hover:shadow-lg cursor-pointer transition-shadow text-white flex items-center justify-center gap-2"
            >
              {authState?.loading && <Spinner size={20} color="#ffffff" />} Sign in
            </Button>
          </form>
          <div className="mt-8 text-center md:text-left">
            <p className="text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Button variant="link" className="p-0 h-auto cursor-pointer text-[#6C4A34]">
                Sign up
              </Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
