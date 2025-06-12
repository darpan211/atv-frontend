import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { registerAdmin, fetchAdminById, updateAdmin } from '@/redux/slice/admin/adminThunk';

registerAdmin;
const adminSchema = Yup.object().shape({
  admin_name: Yup.string().required('Admin name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().when('$isEdit', {
    is: true,
    then: schema => schema.optional(),
    otherwise: schema =>
      schema.min(8, 'Password must be at least 8 characters').required('Password is required'),
  }),
});

const AdminForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [initialValues, setInitialValues] = useState({
    admin_name: '',
    email: '',
    password: '',
    role: 'admin',
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: adminSchema,
    context: { isEdit },
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        const payload = {
          admin_name: values.admin_name,
          email: values.email,
          role: values.role,
          ...(isEdit ? {} : { password: values.password }),
        };

        let resultAction;
        if (isEdit) {
          resultAction = await dispatch(updateAdmin({ id, data: payload })).unwrap();
        } else {
          resultAction = await dispatch(registerAdmin(payload)).unwrap();
        }

        if (resultAction.success) {
          resetForm();
          navigate('/admin/dashboard/list', {
            state: {
              toastMessage: isEdit ? 'Admin updated successfully!' : 'Admin added successfully!',
            },
          });
        } else {
          toast.error(
            resultAction.payload?.message || `Failed to ${isEdit ? 'update' : 'add'} seller`
          );
        }
      } catch (error) {
        toast.error(error.message || 'Something went wrong');
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    const loadAdminData = async () => {
      if (isEdit) {
        try {
          const adminData = await dispatch(fetchAdminById(id)).unwrap();
          setInitialValues({
            admin_name: adminData.admin_name || '',
            email: adminData.email || '',
            password: adminData.password || '',
            role: adminData.role || 'admin',
          });
        } catch {
          toast.error('Failed to load admin');
        }
      }
    };
    loadAdminData();
  }, [dispatch, id, isEdit]);

  const handleCancel = () => {
    navigate('/admin/dashboard/list');
  };

  return (
    <>
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-3xl font-bold py-4 mt-6 px-4 sm:px-8 md:px-12">
          {isEdit ? 'Edit Admin User' : 'Add Admin User'}
        </h1>
      </div>

      <div className="sm:mx-10 p-6 bg-[#FFF5EE]">
        <form onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Admin Name */}
            <div className="space-y-2">
              <Label htmlFor="admin_name" className="font-medium">
                Admin Name
              </Label>
              <Input
                id="admin_name"
                name="admin_name"
                placeholder="Enter admin name"
                value={formik.values.admin_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`bg-white text-black h-10 ${formik.touched.admin_name && formik.errors.admin_name ? 'border-red-500' : ''}`}
              />
              {formik.touched.admin_name && formik.errors.admin_name && (
                <div className="text-red-500 text-sm">{formik.errors.admin_name}</div>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="font-medium">
                Email
              </Label>
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
              <Label htmlFor="password" className="font-medium">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="text"
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
              {formik.isSubmitting
                ? isEdit
                  ? 'Updating...'
                  : 'Saving...'
                : isEdit
                  ? 'Update Admin'
                  : 'Add Admin'}
            </Button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </>
  );
};

export default AdminForm;
