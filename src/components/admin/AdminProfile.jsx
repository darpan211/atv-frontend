import { useEffect, useRef, useState } from 'react';
import { Pencil } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axiosHandler from '@/services/axiosHandler';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const Card = ({ children, className = '' }) => (
  <div className={`rounded-lg border bg-[#FFF5EE] text-black shadow-sm ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = '' }) => (
  <div className={`p-4 sm:p-6 lg:p-8 ${className}`}>{children}</div>
);

const Input = ({ className = '', ...props }) => (
  <input
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6F4E37] focus:border-[#6F4E37] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

const Label = ({ children, className = '', ...props }) => (
  <label className={`text-sm font-medium text-gray-700 ${className}`} {...props}>
    {children}
  </label>
);

const validationSchema = Yup.object({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
});

export default function AdminProfile() {
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=320&h=320&fit=crop&crop=face'
  );
  const [fetchedData, setFetchedData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef();
  const { user } = useSelector(state => state.auth.user);

  const initialValues = fetchedData || {
    name: '',
    email: '',
  };

  useEffect(() => {
    const fetchAdminData = async () => {
      setIsLoading(true);
      try {
        const res = await axiosHandler.get(`${BASE_URL}/api/v1/auth/getUserById/${user.id}`);
        const data = res.data?.data;
        setFetchedData({
          name: data.owner_name || '',
          email: data.email || '',
        });
        setImageUrl(data.imageUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=320&h=320&fit=crop&crop=face');
      } catch (err) {
        console.error('Error fetching admin data:', err.message);
        toast.error('Failed to fetch admin data.');
        setFetchedData({
          name: '',
          email: '',
        });
        setImageUrl('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=320&h=320&fit=crop&crop=face');
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      fetchAdminData();
    } else {
      setIsLoading(false);
      setFetchedData({
        name: '',
        email: '',
      });
    }
  }, [user]);

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };

  const handleEditClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const payload = {
        owner_name: values.name,
        email: values.email,
      };

      const res = await axiosHandler.put(`${BASE_URL}/api/v1/auth/updateUser/${user.id}`, payload);

      if (res.status === 200) {
        toast.success('Profile updated successfully!');
      } else {
        toast.error('Failed to update profile.');
      }
    } catch (err) {
      console.error('Update error:', err.message);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      <div className="absolute top-0 left-0 w-full h-1/3 sm:h-1/2 bg-[#6F4E37] z-0"></div>
      <div className="absolute top-1/3 sm:top-1/2 left-0 w-full h-2/3 sm:h-1/2 bg-white z-0"></div>

      <div className="relative z-10 flex items-start sm:items-center justify-center p unlabeled-sm:p-6 min-h-screen pt-8 sm:pt-6">
        <div className="w-full max-w-7xl">
          <div className="mb-4 sm:mb-6">
            <h1 className="text-white text-xl sm:text-2xl lg:text-3xl font-semibold">Admin Profile</h1>
          </div>

          {isLoading ? (
            <div className="text-center text-gray-600">Loading...</div>
          ) : (
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              enableReinitialize
              onSubmit={handleSubmit}
            >
              {({ values, errors, touched, handleChange, isSubmitting }) => (
                <Form>
                  <Card className="border border-gray-200 shadow-lg">
                    <CardContent>
                      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                        {/* Profile Image Section */}
                        <div className="flex justify-center lg:justify-start flex-shrink-0">
                          <div className="relative inline-block">
                            <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 xl:w-80 xl:h-80 rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-100 relative">
                              <img
                                src={imageUrl}
                                alt="Profile"
                                className="w-full h-full object-cover"
                              />
                              <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                className="hidden"
                              />
                              <div
                                className="absolute bottom-0 right-0 sm:bottom-0 sm:right-0 bg-white rounded-tl-lg rounded-br-lg cursor-pointer hover:bg-gray-100 transition-colors shadow-sm"
                                onClick={handleEditClick}
                              >
                                <div className="p-1.5 sm:p-2">
                                  <Pencil size={14} className="text-gray-600 sm:w-4 sm:h-4" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Form Fields */}
                        <div className="flex-1 w-full">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                            <div className="space-y-2">
                              <Label htmlFor="name">Name</Label>
                              <Field
                                as={Input}
                                id="name"
                                name="name"
                                placeholder="Enter name"
                                value={values.name}
                                onChange={handleChange}
                                disabled={isSubmitting}
                              />
                              {touched.name && errors.name && (
                                <div className="text-red-500 text-sm">{errors.name}</div>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email">Email</Label>
                              <Field
                                as={Input}
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter email address"
                                value={values.email}
                                onChange={handleChange}
                                disabled={isSubmitting}
                              />
                              {touched.email && errors.email && (
                                <div className="text-red-500 text-sm">{errors.email}</div>
                              )}
                            </div>
                          </div>
                          <div className="mt-12 text-right">
                            <button
                              type="submit"
                              disabled={isSubmitting}
                              className="px-6 py-2 bg-[#6F4E37] text-white rounded-md hover:bg-[#5c3f2c] transition disabled:opacity-50"
                            >
                              {isSubmitting ? 'Updating...' : 'Update Profile'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Form>
              )}
            </Formik>
          )}
        </div>
      </div>
    </div>
  );
}