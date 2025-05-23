import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ImageSlider } from '@/components/common/ImageSlider';
import { loginUser } from '@/services/authService';
import { SLIDES } from '@/utils/constants';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../common/icons';
import { useAuth } from '@/hooks/api/useAuth';
const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  rememberMe: Yup.boolean().required('pleasce check the box is required'),
});

const Login = () => {
  const [handleLoginUser, user] = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    validationSchema: LoginSchema,
    onSubmit: async values => {
      setIsLoading(true);
      try {
        handleLoginUser({
          email: values.email,
          password: values.password,
        });
        // const response = await loginUser({
        //   email: values.email,
        //   password: values.password,
        // });
        console.log('Login successful:');
        //temp route
        navigate('/admin/dashboard');
      } catch (error) {
        console.log('Login failed:', error);
        alert(error?.response?.data?.message || 'Login failed. Please check your credentials.');
      } finally {
        setIsLoading(false);
      }

      // Simulate API request
      // setTimeout(() => {
      //   setIsLoading(false);
      //   console.log('Login attempt with:', values);
      //   // Here you would typically call your authentication API
      // }, 1500);
    },
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen justify-center items-center">
      <div className="w-full hidden md:block md:w-1/2 h-[40vh] md:h-screen md:flex justify-center items-center ">
        <ImageSlider slides={SLIDES} buttonShow={true} autoPlay={true} autoPlayInterval={4000} />
      </div>

      <div className="w-full md:w-1/2 flex flex-col p-8 md:p-16 justify-center relative md:overflow-auto md:h-screen">
        <div>
          <div className="max-w-md mx-auto w-full">
            <div className="mb-8">
              <div className="mb-3">{<Icon name="Logo" height={'69px'} width={'70px'} />}</div>
              <h1 className="text-3xl font-bold mb-2">Login</h1>
              <p className="text-muted-foreground">Enter your credentials to access your account</p>
            </div>
            <form onSubmit={formik.handleSubmit} className="space-y-6">
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
                  className={`h-12 hover:bg-white ${
                    formik.touched.password && formik.errors.password ? 'border-red-500' : ''
                  }`}
                  style={{
                    WebkitBoxShadow: ' white ',
                    WebkitTextFillColor: 'black',
                  }}
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
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`h-12 ${
                    formik.touched.password && formik.errors.password ? 'border-red-500' : ''
                  }`}
                />
                {formik.touched.password && formik.errors.password && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
                )}
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="rememberMe"
                  name="rememberMe"
                  checked={formik.values.rememberMe}
                  onCheckedChange={checked => {
                    formik.setFieldValue('rememberMe', checked);
                  }}
                />
                <Label
                  htmlFor="rememberMe"
                  className="text-sm font-normal cursor-pointer"
                  onClick={() => formik.setFieldValue('rememberMe', !formik.values.rememberMe)}
                >
                  Remember me
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base bg-[#6C4A34] hover:bg-[#6C4A34]- hover:shadow-xl transition-shadow duration-300 delay-100 text-white cursor-pointer"
                disabled={isLoading || !formik.isValid}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Button variant="link" className="p-0 h-auto text-[#6C4A34] cursor-pointer ">
                  Sign up
                </Button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
