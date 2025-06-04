import { useFormik } from 'formik';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

const CommonAddForm = ({
  label,
  buttonText,
  onSubmit,
  formType = '',
  initialValues = { name: '' },
}) => {
  const navigate = useNavigate();

  const validationSchema =
    formType === 'sizes'
      ? Yup.object().shape({
          height: Yup.number()
            .typeError('Height must be a number')
            .positive('Height must be positive')
            .required('Height is required'),
          width: Yup.number()
            .typeError('Width must be a number')
            .positive('Width must be positive')
            .required('Width is required'),
        })
      : Yup.object().shape({
          name: Yup.string()
            .min(3, 'Name must be at least 3 characters')
            .required('Name is required'),
        });

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    validateOnChange: true,
    // validateOnBlur: false, 
    onSubmit: values => {
      if (onSubmit) onSubmit(values);
    },
    // onReset: () => formik.resetForm(),
  });

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="bg-[#FFF5EE] p-6 rounded-lg w-full">
      <form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
        {formType === 'sizes' ? (
          <>
            <div className="mb-4">
              <label htmlFor="height" className="block text-sm font-medium text-black mb-1">
                Height
              </label>
              <input
                id="height"
                name="height"
                type="text"
                placeholder="Enter height"
                value={formik.values.height || ''}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-2xl px-4 py-2 border bg-white rounded-md focus:outline-none"
              />
              {formik.touched.height && formik.errors.height ? (
                <div className="text-red-600 text-sm">{formik.errors.height}</div>
              ) : null}
            </div>

            <div className="mb-6">
              <label htmlFor="width" className="block text-sm font-medium text-black mb-1">
                Width
              </label>
              <input
                id="width"
                name="width"
                type="text"
                placeholder="Enter width"
                value={formik.values.width || ''}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-2xl px-4 py-2 border bg-white rounded-md focus:outline-none"
              />
              {formik.touched.width && formik.errors.width ? (
                <div className="text-red-600 text-sm">{formik.errors.width}</div>
              ) : null}
            </div>
          </>
        ) : (
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium text-black mb-1">
              {label}
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder={`Enter ${label.toLowerCase()}`}
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-2xl px-4 py-2 border bg-white rounded-md focus:outline-none"
            />
            {formik.touched.name && formik.errors.name ? (
              <div className="text-red-600 text-sm">{formik.errors.name}</div>
            ) : null}
          </div>
        )}

        <div className="flex justify-center gap-4 items-center mt-6">
          <button
            type="button"
            onClick={handleCancel}
            className="bg-white text-black border px-6 py-2 rounded-md shadow-sm shadow-black hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            type="reset"
            className="bg-gray-700 text-white px-6 py-2 shadow-sm shadow-black rounded-md hover:bg-gray-800 transition"
          >
            Reset
          </button>
          <button
            type="submit"
            className="bg-[#6F4E37] text-white px-6 py-2 shadow-sm shadow-black rounded-md hover:bg-[#a98f7d] transition"
          >
            {buttonText}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommonAddForm;
