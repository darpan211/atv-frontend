import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { Check } from 'lucide-react';

// Yup validation schema
const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required').max(50, 'Name must be 50 characters or less'),
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email format'),
  phone: Yup.string()
    .required('Phone number is required')
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
  address: Yup.string().max(200, 'Address must be 200 characters or less'),
  website: Yup.string().url('Invalid URL format').nullable(),
  socialMedia: Yup.string().url('Invalid URL format').nullable(),
});

// ContactConfig Component
const ContactConfig = () => {
  // Mock API call to save contact info
  const saveContactInfo = async (contact) => {
    console.log('Saving contact info:', contact);
    return new Promise((resolve) => {
      setTimeout(() => resolve({ status: 200 }), 1000);
    });
  };

  return (
    <div className="p-6 bg-[#FFF5EE] bg-grid-white-[0.2] animate-fade-in">
      <h2 className="text-2xl font-bold text-black mb-4">Contact Information Configuration</h2>
      <Formik
        initialValues={{
          name: '',
          email: '',
          phone: '',
          address: '',
          website: '',
          socialMedia: '',
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const res = await saveContactInfo(values);
            if (res.status === 200) {
              toast.success('Contact information saved successfully!');
            } else {
              toast.error('Failed to save contact information.');
            }
          } catch (err) {
            toast.error('Something went wrong. Please try again.');
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ values, setFieldValue, isSubmitting, errors, touched }) => (
          <Form>
            <div className="bg-white border border-gray-200 shadow-md rounded-lg p-6">
              {/* Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <Field
                  name="name"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#6F4E37]"
                />
                {touched.name && errors.name && (
                  <div className="text-red-500 text-sm mt-1">{errors.name}</div>
                )}
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Field
                  name="email"
                  type="email"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#6F4E37]"
                />
                {touched.email && errors.email && (
                  <div className="text-red-500 text-sm mt-1">{errors.email}</div>
                )}
              </div>

              {/* Phone */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <Field
                  name="phone"
                  type="tel"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#6F4E37]"
                />
                {touched.phone && errors.phone && (
                  <div className="text-red-500 text-sm mt-1">{errors.phone}</div>
                )}
              </div>

              {/* Address */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <Field
                  name="address"
                  as="textarea"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#6F4E37]"
                  rows="3"
                />
                {touched.address && errors.address && (
                  <div className="text-red-500 text-sm mt-1">{errors.address}</div>
                )}
              </div>

              {/* Website */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <Field
                  name="website"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#6F4E37]"
                />
                {touched.website && errors.website && (
                  <div className="text-red-500 text-sm mt-1">{errors.website}</div>
                )}
              </div>

              {/* Social Media */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Social Media (URL)
                </label>
                <Field
                  name="socialMedia"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#6F4E37]"
                />
                {touched.socialMedia && errors.socialMedia && (
                  <div className="text-red-500 text-sm mt-1">{errors.socialMedia}</div>
                )}
              </div>

              {/* Submit Button */}
              <div className="text-right">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-[#6F4E37] text-white rounded-md hover:bg-[#5c3f2c] transition disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Contact Info'}
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ContactConfig;