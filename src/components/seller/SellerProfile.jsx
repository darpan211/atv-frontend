import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { ChevronDown } from 'lucide-react';
import { Icon } from '../common/icons';
import axiosHandler from '@/services/axiosHandler';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const DEFAULT_PROFILE_IMAGE = '/assests/Profileimage.png';
const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

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

const Card = ({ children, className = '' }) => (
  <div className={`rounded-lg border bg-[#FFF5EE] text-black shadow-sm ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = '' }) => (
  <div className={`p-4 sm:p-6 lg:p-8 ${className}`}>{children}</div>
);

const Input = ({ className = '', type, disabled, ...props }) => {
  const isEmail = type === 'email';
  return (
    <input
      type={type}
      disabled={isEmail || disabled}
      className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6F4E37] focus:border-[#6F4E37] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
};

const Label = ({ children, className = '', ...props }) => (
  <label className={`text-sm font-medium text-gray-700 ${className}`} {...props}>
    {children}
  </label>
);

const Select = ({ name, placeholder, value, onChange, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');

  useEffect(() => {
    const matchedOption = STATUS_OPTIONS.find(option => option.value === value);
    setSelectedValue(matchedOption ? matchedOption.label : '');
  }, [value]);

  const handleSelect = useCallback((val, label) => {
    setSelectedValue(label);
    setIsOpen(false);
    onChange?.({ target: { name, value: val } });
  }, [name, onChange]);

  const toggleDropdown = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  return (
    <div className="relative">
      <button
        type="button"
        className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6F4E37] focus:border-[#6F4E37] ${className}`}
        onClick={toggleDropdown}
      >
        <span className={selectedValue ? 'text-gray-900' : 'text-gray-400'}>
          {selectedValue || placeholder}
        </span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute top-full z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
          {STATUS_OPTIONS.map((option) => (
            <div
              key={option.value}
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

const ErrorMessage = ({ error, touched }) => {
  if (!touched || !error) return null;
  return <div className="text-red-500 text-sm">{error}</div>;
};

const ProfileImage = ({ imageUrl, onImageChange }) => {
  const fileInputRef = useRef();

  const handleEditClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="relative">
      <div className="w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-lg overflow-hidden relative">
        <img src={imageUrl} alt="Profile" className="w-full h-full object-cover" />
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={onImageChange}
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
  );
};

const FormFields = ({ values, errors, touched, handleChange, setFieldValue }) => {
  const fields = [
    [
      { name: 'sellerName', label: 'Seller Name', placeholder: 'Enter company name' },
      { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter email address' },
      { name: 'address', label: 'Address', placeholder: 'Enter address' },
    ],
    [
      { name: 'mobile', label: 'Seller Mobile', placeholder: 'Enter mobile number' },
      { name: 'gst', label: 'GST Number', placeholder: 'Enter GST number' },
      { name: 'city', label: 'City', placeholder: 'Enter city' },
    ],
    [
      { name: 'ownerName', label: 'Owner Name', placeholder: 'Enter owner name' },
      { name: 'status', label: 'Status', type: 'select', placeholder: 'Select status' },
    ],
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {fields.map((column, colIndex) => (
        <div key={colIndex} className={`space-y-4 sm:space-y-6 ${colIndex === 2 ? 'sm:col-span-2 lg:col-span-1' : ''}`}>
          {column.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>{field.label}</Label>
              {field.type === 'select' ? (
                <Select
                  name={field.name}
                  placeholder={field.placeholder}
                  value={values[field.name]}
                  onChange={(e) => setFieldValue(field.name, e.target.value)}
                />
              ) : (
                <Field
                  as={Input}
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={values[field.name]}
                  onChange={handleChange}
                />
              )}
              <ErrorMessage error={errors[field.name]} touched={touched[field.name]} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const useSellerData = (userId) => {
  const [sellerData, setSellerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellerData = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const response = await axiosHandler.get(`${BASE_URL}/api/v1/profile/getprofile/${userId}`);
        const data = response.data?.data;

        setSellerData({
          sellerName: data.company_name || '',
          email: data.email || '',
          address: data.metadata?.address || '',
          mobile: data.mobile || '',
          gst: data.metadata?.gst || '',
          city: data.metadata?.city || '',
          ownerName: data.owner_name || '',
          status: data.status || '',
          profileImage: data.profile_image || DEFAULT_PROFILE_IMAGE,
        });
      } catch (error) {
        console.error('Error fetching seller data:', error.message);
        toast.error('Failed to fetch seller data.');
        setSellerData({
          sellerName: '',
          email: '',
          address: '',
          mobile: '',
          gst: '',
          city: '',
          ownerName: '',
          status: '',
          profileImage: DEFAULT_PROFILE_IMAGE,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSellerData();
  }, [userId]);

  return { sellerData, loading };
};

export default function SellerProfile() {
  const { user } = useSelector(state => state.auth.user);
  const { sellerData, loading } = useSellerData(user?.id);
  const [imageUrl, setImageUrl] = useState(DEFAULT_PROFILE_IMAGE);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (sellerData?.profileImage) {
      setImageUrl(sellerData.profileImage);
    }
  }, [sellerData]);

  const handleImageChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  }, []);

  const handleSubmit = useCallback(async (values, { setSubmitting }) => {
    try {
      const payload = new FormData();
      
      payload.append('company_name', values.sellerName);
      payload.append('mobile', values.mobile);
      payload.append('owner_name', values.ownerName);
      payload.append('status', values.status);
      payload.append('address', values.address);
      payload.append('gst', values.gst);
      payload.append('city', values.city);
      
      if (selectedFile) {
        payload.append('profile_image', selectedFile);
      }

      const response = await axiosHandler.put(
        `${BASE_URL}/api/v1/profile/updateprofile/${user.id}`,
        payload,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        toast.success('Profile updated successfully!');
        window.location.reload();
      } else {
        toast.error('Failed to update profile.');
      }
    } catch (error) {
      console.error('Update error:', error.message);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [selectedFile, user?.id]);

  const initialValues = useMemo(() => {
    return sellerData || {
      sellerName: '',
      email: '',
      address: '',
      mobile: '',
      gst: '',
      city: '',
      ownerName: '',
      status: '',
    };
  }, [sellerData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Background layers */}
      <div className="absolute top-0 left-0 w-full h-1/3 sm:h-1/2 bg-[#6F4E37] z-0" />
      <div className="absolute top-1/3 sm:top-1/2 left-0 w-full h-2/3 sm:h-1/2 bg-white z-0" />

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
                        <ProfileImage imageUrl={imageUrl} onImageChange={handleImageChange} />
                      </div>

                      <div className="flex-1">
                        <FormFields
                          values={values}
                          errors={errors}
                          touched={touched}
                          handleChange={handleChange}
                          setFieldValue={setFieldValue}
                        />
                        
                        <div className="mt-8 text-right">
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
        </div>
      </div>
    </div>
  );
}