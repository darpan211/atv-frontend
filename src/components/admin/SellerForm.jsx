import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import { Upload } from 'lucide-react';
import * as Yup from 'yup';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerSeller, fetchSellerById, updateSeller } from '@/redux/slice/seller/sellerThunks';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Validation schema using Yup
const createValidationSchema = (isEdit) => Yup.object().shape({
  seller_name: Yup.string().required('Seller name is required'),
  seller_mobile: Yup.string()
    .matches(/^\d{10,12}$/, 'Mobile number must be between 10-12 digits')
    .required('Mobile number is required'),
  owner_name: Yup.string().required('Owner name is required'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .matches(
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
      'Please enter a valid email address (e.g., example@domain.com)'
    )
    .max(100, 'Email must not exceed 100 characters')
    .required('Email is required'),
  password: isEdit 
    ? Yup.string()
        .min(8, 'Password must be at least 8 characters long')
        .nullable()
        .transform((value) => (value === '' ? null : value))
    : Yup.string()
        .min(8, 'Password must be at least 8 characters long')
        .required('Password is required'),
  status: Yup.string().oneOf(['active', 'inactive']).required('Status is required'),
  seller_type: Yup.string()
    .oneOf(['retailer', 'distributer', 'supplier'], 'Invalid seller type')
    .required('Seller type is required'),
  metadata: Yup.object().shape({
    gst: Yup.string()
      .matches(
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
        'Invalid GST format. Example: 22AAAAA0000A1Z5'
      )
      .required('GST number is required'),
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
  }),
});

const SellerForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { mode, id } = useParams();
  const isEdit = mode === 'edit';

  const { currentSeller, loading, error } = useSelector((state) => state.seller);
console.log(currentSeller);

  useEffect(() => {
    if (isEdit && id) {
      dispatch(fetchSellerById(id));
    }
  }, [dispatch, isEdit, id]);

  const formik = useFormik({
    initialValues: {
      seller_name: '',
      seller_mobile: '',
      owner_name: '',
      email: '',
      password: '',
      status: '',
      seller_type: '',
      role: 'seller',
      metadata: {
        gst: '',
        address: '',
        city: '',
      },
    },
    validationSchema: createValidationSchema(isEdit),
    enableReinitialize: true,
    onSubmit: async values => {
      try {
        // Transform the values to match the required structure
        const sellerData = {
          company_name: values.seller_name,
          owner_name: values.owner_name,
          email: values.email,
          mobile: values.seller_mobile,
          status: values.status,
          role: 'seller',
          seller_type: values.seller_type,
          metadata: {
            gst: values.metadata.gst,
            address: values.metadata.address,
            city: values.metadata.city,
          },
        };

        // Handle password in edit mode
        if (isEdit) {
          // Only include password if a new one is provided
          if (values.password && values.password.trim() !== '') {
            sellerData.password = values.password;
          }
        } else {
          // In add mode, password is required
          sellerData.password = values.password;
        }

        let resultAction;
        if (isEdit) {
          resultAction = await dispatch(updateSeller({ id, data: sellerData }));
        } else {
          resultAction = await dispatch(registerSeller(sellerData));
        }

        if (resultAction.type.endsWith('/fulfilled')) {
          formik.resetForm();
          navigate('/admin/seller/list', {
            state: {
              toastMessage: isEdit ? 'Seller updated successfully!' : 'Seller added successfully!'
            }
          });
        } else {
          toast.error(resultAction.payload?.message || `Failed to ${isEdit ? 'update' : 'add'} seller`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || `An error occurred while ${isEdit ? 'updating' : 'adding'} the seller`,
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
      }
    },
  });

  // Update form values when currentSeller changes
  useEffect(() => {
    if (isEdit && currentSeller) {
      formik.setValues({
        seller_name: currentSeller.company_name || '',
        seller_mobile: currentSeller.mobile || '',
        owner_name: currentSeller.owner_name || '',
        email: currentSeller.email || '',
        password: '', // Don't show the hashed password
        status: currentSeller.status || '',
        seller_type: currentSeller.seller_type || '',
        role: currentSeller.role || 'seller',
        metadata: {
          gst: currentSeller.metadata?.gst || '',
          address: currentSeller.metadata?.address || '',
          city: currentSeller.metadata?.city || '',
        },
      });
    }
  }, [currentSeller, isEdit]);

  // Helper function to manage nested metadata fields
  const handleMetadataChange = e => {
    const { name, value } = e.target;
    const field = name.split('.')[1]; // Extract the field name after 'metadata.'

    formik.setValues({
      ...formik.values,
      metadata: {
        ...formik.values.metadata,
        [field]: value,
      },
    });
  };

  const handleCancel = () => {
    formik.resetForm();
    toast.info('Form cancelled', {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    navigate('/admin/seller/list');
  };

  if (isEdit && loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading seller data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-3xl font-bold py-4 mt-6 px-4 sm:px-8 md:px-12">
          {isEdit ? 'Edit Seller' : 'Add New Seller'}
        </h1>
      </div>
      <div className="sm:mx-10 p-6 bg-[#FFF5EE] ">
        <form onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-[#FFF5EE] ">
            {/* Seller Name */}
            <div className="space-y-2">
              <Label htmlFor="seller_name" className="font-medium">Seller Name</Label>
              <Input
                id="seller_name"
                name="seller_name"
                placeholder="Enter seller name"
                value={formik.values.seller_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`bg-white text-black h-10 hover:bg-white font-[400] ${
                  formik.touched.seller_name && formik.errors.seller_name ? 'border-red-500' : ''
                }`}
              />
              {formik.touched.seller_name && formik.errors.seller_name && (
                <div className="text-red-500 text-sm">{formik.errors.seller_name}</div>
              )}
            </div>

            {/* Seller Mobile */}
            <div className="space-y-2">
              <Label htmlFor="seller_mobile" className="font-medium">Seller Mobile</Label>
              <Input
                id="seller_mobile"
                name="seller_mobile"
                placeholder="Enter mobile number"
                value={formik.values.seller_mobile}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`bg-white text-black h-10 hover:bg-white font-[400] ${
                  formik.touched.seller_mobile && formik.errors.seller_mobile ? 'border-red-500' : ''
                }`}
              />
              {formik.touched.seller_mobile && formik.errors.seller_mobile && (
                <div className="text-red-500 text-sm">{formik.errors.seller_mobile}</div>
              )}
            </div>

            {/* Owner Name */}
            <div className="space-y-2">
              <Label htmlFor="owner_name" className="font-medium">Owner Name</Label>
              <Input
                id="owner_name"
                name="owner_name"
                placeholder="Enter owner name"
                value={formik.values.owner_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`bg-white text-black h-10 hover:bg-white font-[400] ${
                  formik.touched.owner_name && formik.errors.owner_name ? 'border-red-500' : ''
                }`}
              />
              {formik.touched.owner_name && formik.errors.owner_name && (
                <div className="text-red-500 text-sm">{formik.errors.owner_name}</div>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="font-medium">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter email address"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`bg-white text-black h-10 hover:bg-white font-[400] ${
                  formik.touched.email && formik.errors.email ? 'border-red-500' : ''
                }`}
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
                placeholder={isEdit ? "Enter new password (leave blank to keep current)" : "Enter password"}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`bg-white text-black h-10 hover:bg-white font-[400] ${
                  formik.touched.password && formik.errors.password ? 'border-red-500' : ''
                }`}
              />
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-500 text-sm">{formik.errors.password}</div>
              )}
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status" className="font-medium">Status</Label>
              <Select
                name="status"
                value={formik.values.status}
                onValueChange={value => formik.setFieldValue('status', value)}
              >
                <SelectTrigger
                  id="status"
                  className={`bg-white h-10 ${
                    formik.touched.status && formik.errors.status ? 'border-red-500' : ''
                  }`}
                >
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                {/* <SelectContent className="bg-[#6F4E37] text-white">
                  <SelectItem value="active" className="hover:bg-[#a98f7d] focus:bg-[#a98f7d] focus:text-white">Active</SelectItem>
                  <SelectItem value="inactive" className="hover:bg-[#a98f7d] focus:bg-[#a98f7d] focus:text-white">Inactive</SelectItem>
                </SelectContent> */}

               <SelectContent>
                  <SelectItem value="active" >Active</SelectItem>
                  <SelectItem value="inactive" >Inactive</SelectItem>
                </SelectContent>

              </Select>
              {formik.touched.status && formik.errors.status && (
                <div className="text-red-500 text-sm">{formik.errors.status}</div>
              )}
            </div>

            {/* Seller Type */}
            <div className="space-y-2">
              <Label htmlFor="seller_type" className="font-medium">Seller Type</Label>
              <Select
                name="seller_type"
                value={formik.values.seller_type}
                onValueChange={value => formik.setFieldValue('seller_type', value)}
              >
                <SelectTrigger
                  id="seller_type"
                  className={`bg-white h-10 ${
                    formik.touched.seller_type && formik.errors.seller_type ? 'border-red-500' : ''
                  }`}
                >
                  <SelectValue placeholder="Select seller type" />
                </SelectTrigger>
                {/* <SelectContent className="bg-[#6F4E37] text-white">
                  <SelectItem value="retailer" className="hover:bg-[#a98f7d] focus:bg-[#a98f7d] focus:text-white">Retailer</SelectItem>
                  <SelectItem value="supplier" className="hover:bg-[#a98f7d] focus:bg-[#a98f7d] focus:text-white">Supplier</SelectItem>
                  <SelectItem value="distributor" className="hover:bg-[#a98f7d] focus:bg-[#a98f7d] focus:text-white">Distributor</SelectItem>
                </SelectContent> */}

                <SelectContent>
                  <SelectItem value="retailer">Retailer</SelectItem>
                  <SelectItem value="distributer">Distributer</SelectItem>
                  <SelectItem value="supplier">Supplier</SelectItem>
                </SelectContent>
              </Select>
              {formik.touched.seller_type && formik.errors.seller_type && (
                <div className="text-red-500 text-sm">{formik.errors.seller_type}</div>
              )}
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="metadata.address" className="font-medium">Address</Label>
              <Input
                id="metadata.address"
                name="metadata.address"
                placeholder="Enter address"
                value={formik.values.metadata.address}
                onChange={handleMetadataChange}
                onBlur={formik.handleBlur}
                className={`bg-white text-black h-10 hover:bg-white font-[400] ${
                  formik.touched.metadata?.address && formik.errors.metadata?.address ? 'border-red-500' : ''
                }`}
              />
              {formik.touched.metadata?.address && formik.errors.metadata?.address && (
                <div className="text-red-500 text-sm">{formik.errors.metadata?.address}</div>
              )}
            </div>

            {/* City */}
            <div className="space-y-2">
              <Label htmlFor="metadata.city" className="font-medium">City</Label>
              <Input
                id="metadata.city"
                name="metadata.city"
                placeholder="Enter city"
                value={formik.values.metadata.city}
                onChange={handleMetadataChange}
                onBlur={formik.handleBlur}
                className={`bg-white text-black h-10 hover:bg-white font-[400] ${
                  formik.touched.metadata?.city && formik.errors.metadata?.city ? 'border-red-500' : ''
                }`}
              />
              {formik.touched.metadata?.city && formik.errors.metadata?.city && (
                <div className="text-red-500 text-sm">{formik.errors.metadata?.city}</div>
              )}
            </div>

            {/* GST Number */}
            <div className="space-y-2">
              <Label htmlFor="metadata.gst" className="font-medium">GST Number</Label>
              <Input
                id="metadata.gst"
                name="metadata.gst"
                placeholder="Enter GST number"
                value={formik.values.metadata.gst}
                onChange={handleMetadataChange}
                onBlur={formik.handleBlur}
                className={`bg-white text-black h-10 hover:bg-white font-[400] ${
                  formik.touched.metadata?.gst && formik.errors.metadata?.gst ? 'border-red-500' : ''
                }`}
              />
              {formik.touched.metadata?.gst && formik.errors.metadata?.gst && (
                <div className="text-red-500 text-sm">{formik.errors.metadata?.gst}</div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col md:flex-row justify-center mt-8 space-y-4 md:space-y-0 md:space-x-4 items-center">
            <Button
              variant="outline"
              type="button"
              className="h-10 w-full md:w-40 cursor-pointer"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#6F4E37] hover:bg-[#a98f7d] text-white h-10 w-full md:w-40 cursor-pointer"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? 'Saving...' : isEdit ? 'Update Seller' : 'Add Seller'}
            </Button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SellerForm;
