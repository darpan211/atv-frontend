import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Icon } from '../common/icons';
import axiosHandler from '@/services/axiosHandler';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useMemo } from 'react';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

const Select = ({ name, placeholder, value, onChange, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || '');

  const options = useMemo(() => [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' },
    { value: 'suspended', label: 'Suspended' },
  ], []);

  useEffect(() => {
    const matchedOption = options.find(option => option.value === value);
    if (matchedOption) {
      setSelectedValue(matchedOption.label);
    } else {
      setSelectedValue('');
    }
  }, [value, options]);

  const handleSelect = (val, label) => {
    setSelectedValue(label);
    setIsOpen(false);
    if (onChange) onChange({ target: { name, value: val } });
  };

  return (
    <div className="relative">
      <button
        type="button"
        className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6F4E37] focus:border-[#6F4E37] ${className}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selectedValue ? 'text-gray-900' : 'text-gray-400'}>
          {selectedValue || placeholder}
        </span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute top-full z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
          {options.map((option, index) => (
            <div
              key={index}
              className="cursor-pointer select-none px-3 py-2 text-sm hover:bg-gray-100"
              onClick={() => handleSelect(option.value, option.label)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const validationSchema = Yup.object({
  sellerName: Yup.string()
    .required('Seller Name is required')
    .min(2, 'Seller Name must be at least 2 characters'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  address: Yup.string()
    .required('Address is required')
    .min(5, 'Address must be at least 5 characters'),
  mobile: Yup.string()
    .matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits')
    .required('Mobile number is required'),
  gst: Yup.string()
    .matches(/^[0-9A-Z]{15}$/, 'GST number must be 15 alphanumeric characters')
    .required('GST number is required'),
  city: Yup.string()
    .required('City is required')
    .min(2, 'City must be at least 2 characters'),
  ownerName: Yup.string()
    .required('Owner Name is required')
    .min(2, 'Owner Name must be at least 2 characters'),
  status: Yup.string()
    .required('Status is required')
    .oneOf(['active', 'inactive', 'pending', 'suspended'], 'Invalid status'),
});

export default function SellerProfile() {
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&crop=face'
  );
  const [fetchedData, setFetchedData] = useState(null);
  const fileInputRef = useRef();
  const { user } = useSelector(state => state.auth.user);

  const initialValues = fetchedData || {
    sellerName: '',
    email: '',
    address: '',
    mobile: '',
    gst: '',
    city: '',
    ownerName: '',
    status: '',
  };

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        const res = await axiosHandler.get(`${BASE_URL}/api/v1/profile/getprofile/${user.id}`);
        const data = res.data?.data;
        setFetchedData({
          sellerName: data.company_name || '',
          email: data.email || '',
          address: data.metadata?.address || '',
          mobile: data.mobile || '',
          gst: data.metadata?.gst || '',
          city: data.metadata?.city || '',
          ownerName: data.owner_name || '',
          status: data.status || '',
        });
      } catch (err) {
        console.error('Error fetching seller data:', err.message);
        toast.error('Failed to fetch seller data.');
        setFetchedData({
          sellerName: '',
          email: '',
          address: '',
          mobile: '',
          gst: '',
          city: '',
          ownerName: '',
          status: '',
        });
      }
    };

    if (user?.id) {
      fetchSellerData();
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
        company_name: values.sellerName,
        email: values.email,
        mobile: values.mobile,
        owner_name: values.ownerName,
        status: values.status,
        metadata: {
          address: values.address,
          gst: values.gst,
          city: values.city,
        },
        // profile_image: imageUrl,
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

      <div className="relative z-10 flex items-start sm:items-center justify-center p-4 sm:p-6 min-h-screen pt-8 sm:pt-6">
        <div className="w-full max-w-7xl">
          <div className="mb-4 sm:mb-6">
            <h1 className="text-white text-xl sm:text-2xl lg:text-3xl font-semibold">
              Seller Profile
            </h1>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            enableReinitialize
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, handleChange, setFieldValue, isSubmitting }) => (
              <Form>
                <Card className="border border-gray-200 shadow-lg">
                  <CardContent>
                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                      <div className="flex justify-center lg:justify-start flex-shrink-0">
                        <div className="relative">
                          <div className="w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-lg overflow-hidden relative">
                            <img src={imageUrl} alt="Profile" className="w-full h-full object-cover" />
                            <input
                              type="file"
                              accept="image/*"
                              ref={fileInputRef}
                              onChange={e => handleImageChange(e)}
                              className="hidden"
                            />
                            <div
                              className="absolute bottom-0 right-0 bg-white p-1.5 rounded-tl-lg rounded-br-lg cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
                              onClick={handleEditClick}
                            >
                              <Icon name="EditPencil" size={16} />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                          <div className="space-y-4 sm:space-y-6">
                            <div className="space-y-2">
                              <Label htmlFor="sellerName">Seller Name</Label>
                              <Field
                                as={Input}
                                id="sellerName"
                                name="sellerName"
                                placeholder="Enter company name"
                                value={values.sellerName}
                                onChange={handleChange}
                              />
                              {touched.sellerName && errors.sellerName && (
                                <div className="text-red-500 text-sm">{errors.sellerName}</div>
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
                              />
                              {touched.email && errors.email && (
                                <div className="text-red-500 text-sm">{errors.email}</div>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="address">Address</Label>
                              <Field
                                as={Input}
                                id="address"
                                name="address"
                                placeholder="Enter address"
                                value={values.address}
                                onChange={handleChange}
                              />
                              {touched.address && errors.address && (
                                <div className="text-red-500 text-sm">{errors.address}</div>
                              )}
                            </div>
                          </div>

                          <div className="space-y-4 sm:space-y-6">
                            <div className="space-y-2">
                              <Label htmlFor="mobile">Seller Mobile</Label>
                              <Field
                                as={Input}
                                id="mobile"
                                name="mobile"
                                placeholder="Enter mobile number"
                                value={values.mobile}
                                onChange={handleChange}
                              />
                              {touched.mobile && errors.mobile && (
                                <div className="text-red-500 text-sm">{errors.mobile}</div>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="gst">GST Number</Label>
                              <Field
                                as={Input}
                                id="gst"
                                name="gst"
                                placeholder="Enter GST number"
                                value={values.gst}
                                onChange={handleChange}
                              />
                              {touched.gst && errors.gst && (
                                <div className="text-red-500 text-sm">{errors.gst}</div>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="city">City</Label>
                              <Field
                                as={Input}
                                id="city"
                                name="city"
                                placeholder="Enter city"
                                value={values.city}
                                onChange={handleChange}
                              />
                              {touched.city && errors.city && (
                                <div className="text-red-500 text-sm">{errors.city}</div>
                              )}
                            </div>
                          </div>

                          <div className="space-y-4 sm:space-y-6 sm:col-span-2 lg:col-span-1">
                            <div className="space-y-2">
                              <Label htmlFor="ownerName">Owner Name</Label>
                              <Field
                                as={Input}
                                id="ownerName"
                                name="ownerName"
                                placeholder="Enter owner name"
                                value={values.ownerName}
                                onChange={handleChange}
                              />
                              {touched.ownerName && errors.ownerName && (
                                <div className="text-red-500 text-sm">{errors.ownerName}</div>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="status">Status</Label>
                              <Select
                                name="status"
                                placeholder="Select status"
                                value={values.status}
                                onChange={e => setFieldValue('status', e.target.value)}
                              />
                              {touched.status && errors.status && (
                                <div className="text-red-500 text-sm">{errors.status}</div>
                              )}
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
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}