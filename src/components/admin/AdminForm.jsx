import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

// Validation schema for three fields
const UserSchema = Yup.object().shape({
  user_name: Yup.string().required('User name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

const AdminForm = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      user_name: '',
      email: '',
      password: '',
      role: 'admin',
    },
    validationSchema: UserSchema,
    onSubmit: async values => {
      try {
        console.log('Submitting user data:', values);
        // TODO: Replace with your actual API call
        formik.resetForm();
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    },
  });

  const handleCancel = () => {
    formik.resetForm();
    navigate('/admin/seller/list');
  };

  return (
    <>
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-3xl font-bold py-4 mt-6 px-4 sm:px-8 md:px-12">
          Add Admin User
        </h1>
      </div>

      <div className="sm:mx-10 p-6 bg-[#FFF5EE]">
        <form onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* User Name */}
            <div className="space-y-2">
              <Label htmlFor="user_name" className="font-medium">User Name</Label>
              <Input
                id="user_name"
                name="user_name"
                placeholder="Enter user name"
                value={formik.values.user_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`bg-white text-black h-10 ${formik.touched.user_name && formik.errors.user_name ? 'border-red-500' : ''}`}
              />
              {formik.touched.user_name && formik.errors.user_name && (
                <div className="text-red-500 text-sm">{formik.errors.user_name}</div>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="font-medium">Email</Label>
              <Input
                id="email"
                name="email"
                placeholder="Enter email address"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`bg-white text-black h-10 ${formik.touched.email && formik.errors.email ? 'border-red-500' : ''}`}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500 text-sm">{formik.errors.email}</div>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="font-medium">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`bg-white text-black h-10 ${formik.touched.password && formik.errors.password ? 'border-red-500' : ''}`}
              />
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-500 text-sm">{formik.errors.password}</div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col md:flex-row justify-center mt-8 space-y-4 md:space-y-0 md:space-x-4 items-center">
            <Button
              variant="outline"
              type="button"
              className="h-10 w-full md:w-40"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#6F4E37] hover:bg-[#a98f7d] text-white h-10 w-full md:w-40"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? 'Saving...' : 'Add User'}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AdminForm;
