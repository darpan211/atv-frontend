import React from 'react';
import { useFormik } from 'formik';
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
import { useNavigate } from 'react-router-dom';

// Validation schema using Yup
const SellerSchema = Yup.object().shape({
  company_name: Yup.string().required('Seller name is required'),
  owner_name: Yup.string().required('Owner name is required'),
  mobile: Yup.string()
    .matches(/^\d{10,12}$/, 'Mobile number must be between 10-12 digits')
    .required('Mobile number is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  status: Yup.string().oneOf(['active', 'inactive']).required('Status is required'),
  metadata: Yup.object().shape({
    gst: Yup.string()
      .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GST format')
      .required('GST number is required'),
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
  }),
});

const AddNewSeller = () => {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      company_name: '',
      owner_name: '',
      email: '',
      mobile: '',
      password: '',
      status: '',
      role: 'seller',
      metadata: {
        gst: '',
        address: '',
        city: '',
      },
    },
    validationSchema: SellerSchema,
    onSubmit: async values => {
      // Transform the values to match the required structure
      const sellerData = {
        company_name: values.company_name,
        owner_name: values.owner_name,
        email: values.email,
        mobile: values.mobile,
        password: values.password,
        status: values.status,
        role: values.role,
        metadata: {
          gst: values.metadata.gst,
          address: values.metadata.address,
          city: values.metadata.city,
        },
      };

      try {
        // Here you would typically make an API call to save the seller
        console.log('Submitting seller data:', sellerData);

        // Reset form after successful submission
        formik.resetForm();
      } catch (error) {
        console.error('Error adding seller:', error);
      }
    },
  });

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
    navigate('/admin/seller/list');
  };
  return (
    <div className="sm:mx-10 p-6">
      <h1 className="text-3xl font-bold mb-6">Add New Seller</h1>
      <form onSubmit={formik.handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Seller Name */}
          <div className="space-y-2">
            <Label htmlFor="company_name">Seller Name</Label>
            <Input
              id="company_name"
              name="company_name"
              placeholder="Enter company name"
              value={formik.values.company_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`bg-white text-black h-12 hover:bg-white ${
                formik.touched.company_name && formik.errors.company_name ? 'border-red-500' : ''
              }`}
            />
            {formik.touched.company_name && formik.errors.company_name && (
              <div className="text-red-500 text-sm">{formik.errors.company_name}</div>
            )}
          </div>

          {/* Seller Mobile */}
          <div className="space-y-2">
            <Label htmlFor="mobile">Seller Mobile</Label>
            <Input
              id="mobile"
              name="mobile"
              placeholder="Enter mobile number"
              type="text"
              value={formik.values.mobile}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`bg-white text-black h-12 hover:bg-white ${
                formik.touched.mobile && formik.errors.mobile ? 'border-red-500' : ''
              }`}
            />
            {formik.touched.mobile && formik.errors.mobile && (
              <div className="text-red-500 text-sm">{formik.errors.mobile}</div>
            )}
          </div>

          {/* Owner Name */}
          <div className="space-y-2">
            <Label htmlFor="owner_name">Owner Name</Label>
            <Input
              id="owner_name"
              name="owner_name"
              placeholder="Enter owner name"
              value={formik.values.owner_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`bg-white text-black h-12 hover:bg-white ${
                formik.touched.owner_name && formik.errors.owner_name ? 'border-red-500' : ''
              }`}
            />
            {formik.touched.owner_name && formik.errors.owner_name && (
              <div className="text-red-500 text-sm">{formik.errors.owner_name}</div>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              placeholder="Enter email address"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`bg-white text-black h-12 hover:bg-white ${
                formik.touched.email && formik.errors.email ? 'border-red-500' : ''
              }`}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 text-sm">{formik.errors.email}</div>
            )}
          </div>

          {/* Password - New Field */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              placeholder="Enter password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`bg-white text-black h-12 hover:bg-white ${
                formik.touched.password && formik.errors.password ? 'border-red-500' : ''
              }`}
            />
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-500 text-sm">{formik.errors.password}</div>
            )}
          </div>

          {/* Status - New Field */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              name="status"
              value={formik.values.status}
              onValueChange={value => formik.setFieldValue('status', value)}
            >
              <SelectTrigger
                id="status"
                className={`bg-white h-12 ${
                  formik.touched.status && formik.errors.status ? 'border-red-500' : ''
                }`}
              >
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            {formik.touched.status && formik.errors.status && (
              <div className="text-red-500 text-sm">{formik.errors.status}</div>
            )}
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="metadata.address">Address</Label>
            <Input
              id="metadata.address"
              name="metadata.address"
              placeholder="Enter address"
              value={formik.values.metadata.address}
              onChange={handleMetadataChange}
              onBlur={formik.handleBlur}
              className={`bg-white text-black h-12 hover:bg-white ${
                formik.touched.metadata?.address && formik.errors.metadata?.address
                  ? 'border-red-500'
                  : ''
              }`}
            />
            {formik.touched.metadata?.address && formik.errors.metadata?.address && (
              <div className="text-red-500 text-sm">{formik.errors.metadata?.address}</div>
            )}
          </div>

          {/* City */}
          <div className="space-y-2">
            <Label htmlFor="metadata.city">City</Label>
            <Input
              id="metadata.city"
              name="metadata.city"
              placeholder="Enter city"
              value={formik.values.metadata.city}
              onChange={handleMetadataChange}
              onBlur={formik.handleBlur}
              className={`bg-white text-black h-12 hover:bg-white ${
                formik.touched.metadata?.city && formik.errors.metadata?.city
                  ? 'border-red-500'
                  : ''
              }`}
            />
            {formik.touched.metadata?.city && formik.errors.metadata?.city && (
              <div className="text-red-500 text-sm">{formik.errors.metadata.city}</div>
            )}
          </div>

          {/* GST Number */}
          <div className="space-y-2">
            <Label htmlFor="metadata.gst">GST Number</Label>
            <Input
              id="metadata.gst"
              name="metadata.gst"
              placeholder="Enter GST number"
              value={formik.values.metadata.gst}
              onChange={handleMetadataChange}
              onBlur={formik.handleBlur}
              className={`bg-white text-black h-12 hover:bg-white ${
                formik.touched.metadata?.gst && formik.errors.metadata?.gst ? 'border-red-500' : ''
              }`}
            />
            {formik.touched.metadata?.gst && formik.errors.metadata?.gst && (
              <div className="text-red-500 text-sm">{formik.errors.metadata.gst}</div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end mt-8 space-x-4">
          <Button
            variant="outline"
            type="button"
            className="h-12 cursor-pointer"
            onClick={() => handleCancel()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-[#03c9d7] hover:bg-[#02a1ac] text-white h-12 cursor-pointer"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Saving...' : 'Add Seller'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddNewSeller;
