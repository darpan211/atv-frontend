// import { useFormik } from 'formik';
// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import * as Yup from 'yup';
// import { Input } from '../ui/input';
// import { Label } from '../ui/label';

// const CommonAddForm = ({
//   label,
//   buttonText,
//   onSubmit,
//   formType = '',
//   initialValues = { name: '' },
// }) => {
//   const navigate = useNavigate();

//   const validationSchema =
//     formType === 'sizes'
//       ? Yup.object().shape({
//           height: Yup.number()
//             .typeError('Height must be a number')
//             .positive('Height must be positive')
//             .required('Height is required'),
//           width: Yup.number()
//             .typeError('Width must be a number')
//             .positive('Width must be positive')
//             .required('Width is required'),
//         })
//       : Yup.object().shape({
//           name: Yup.string()
//             .min(3, 'Name should be at least 3 characters long.')
//             .required('Please enter a name.'),
//         });

//   const formik = useFormik({
//     initialValues,
//     validationSchema,
//     enableReinitialize: true,
//     validateOnChange: true,
//     // validateOnBlur: false,
//     onSubmit: values => {
//       if (onSubmit) onSubmit(values);
//     },
//   });

//   const handleCancel = () => {
//     navigate(-1);
//   };

//   const handleReset = () => {
//     formik.setFieldValue('name', '');
//   };

//   return (
//     <div className="bg-[#FFF5EE] p-6 rounded-lg w-full">
//       <form onSubmit={formik.handleSubmit}>
//         {formType === 'sizes' ? (
//           <>
//             <div className="mb-4">
//               <Label htmlFor="height" className="block text-sm font-medium text-black mb-1">
//                 Height
//               </Label>
//               <Input
//                 id="height"
//                 name="height"
//                 type="text"
//                 placeholder="Enter height (In mm)"
//                 value={formik.values.height || ''}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 className="md:w-2xl w-full px-4 py-2 border bg-white rounded-md focus:outline-none"
//               />
//               {formik.touched.height && formik.errors.height ? (
//                 <div className="text-red-600 text-sm">{formik.errors.height}</div>
//               ) : null}
//             </div>

//             <div className="mb-6">
//               <Label htmlFor="width" className="block text-sm font-medium text-black mb-1">
//                 Width
//               </Label>
//               <Input
//                 id="width"
//                 name="width"
//                 type="text"
//                 placeholder="Enter width (In mm)"
//                 value={formik.values.width || ''}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 className="md:w-2xl w-full px-4 py-2 border bg-white rounded-md focus:outline-none"
//               />
//               {formik.touched.width && formik.errors.width ? (
//                 <div className="text-red-600 text-sm">{formik.errors.width}</div>
//               ) : null}
//             </div>
//           </>
//         ) : (
//           <div className="mb-6">
//             <label htmlFor="name" className="block text-sm font-medium text-black mb-1">
//               {label}
//             </label>
//             <Input
//               id="name"
//               name="name"
//               type="text"
//               placeholder={`Enter ${label.toLowerCase()}`}
//               value={formik.values.name}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               className="md:w-2xl w-full px-4 py-2 border bg-white rounded-md focus:outline-none"
//             />
//             {formik.touched.name && formik.errors.name ? (
//               <div className="text-red-600 text-sm">{formik.errors.name}</div>
//             ) : null}
//           </div>
//         )}

//         <div className="flex flex-wrap justify-center gap-4 items-center mt-6">
//           <button
//             type="button"
//             onClick={handleCancel}
//             className="bg-white cursor-pointer text-black border px-6 py-2 rounded-md shadow-sm shadow-black hover:bg-gray-100 transition"
//           >
//             Cancel
//           </button>
//           <button
//             type="reset"
//             className="bg-gray-700 cursor-pointer text-white px-6 py-2 shadow-sm shadow-black rounded-md hover:bg-gray-800 transition"
//             onClick={handleReset}
//           >
//             Reset
//           </button>
//           <button
//             type="submit"
//             className="bg-[#6F4E37] cursor-pointer text-white px-6 py-2 shadow-sm shadow-black rounded-md hover:bg-[#a98f7d] transition"
//           >
//             {buttonText}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CommonAddForm;
import { useFormik } from 'formik';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const CommonAddForm = ({
  label,
  buttonText,
  onSubmit,
  formType = '',
  initialValues = { name: '' },
  hideButtons = false,
  popup = false,
  noFormTag = false,
  onCancel,
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
          name: Yup.string().min(2).required('Please enter a name.'),
        });

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    validateOnChange: true,
    onSubmit: values => {
      if (onSubmit) onSubmit(values);
    },
  });

  const handleCancel = () => {
    if (!hideButtons && !popup) {
      navigate(-1);
    } else {
      onCancel();
    }
  };

  const handleReset = () => {
    formik.setFieldValue('name', '');
  };

  const FormWrapper = noFormTag ? React.Fragment : 'form';

  return (
    <div className="bg-[#FFF5EE] p-6 rounded-lg w-full">
      <FormWrapper onSubmit={formik.handleSubmit}>
        {formType === 'sizes' ? (
          <>
            <div className="mb-4">
              <Label htmlFor="height" className="block text-sm font-medium text-black mb-1">
                Height
              </Label>
              <Input
                id="height"
                name="height"
                type="text"
                placeholder="Enter height (In mm)"
                value={formik.values.height || ''}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`${!popup ? 'md:w-2xl' : 'md:w-full'} w-full px-4 py-2 border bg-white rounded-md focus:outline-none`}
              />
              {formik.touched.height && formik.errors.height && (
                <div className="text-red-600 text-sm mt-1">{formik.errors.height}</div>
              )}
            </div>

            <div className="mb-6">
              <Label htmlFor="width" className="block text-sm font-medium text-black mb-1">
                Width
              </Label>
              <Input
                id="width"
                name="width"
                type="text"
                placeholder="Enter width (In mm)"
                value={formik.values.width || ''}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`${!popup ? 'md:w-2xl' : 'md:w-full'} w-full px-4 py-2 border bg-white rounded-md focus:outline-none`}
              />
              {formik.touched.width && formik.errors.width && (
                <div className="text-red-600 text-sm mt-1">{formik.errors.width}</div>
              )}
            </div>
          </>
        ) : (
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium text-black mb-1">
              {label}
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder={`Enter ${label.toLowerCase()}`}
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`${!popup ? 'md:w-2xl' : 'md:w-full'} w-full px-4 py-2 border bg-white rounded-md focus:outline-none`}
            />
            {formik.touched.name && formik.errors.name && (
              <div className="text-red-600 text-sm">{formik.errors.name}</div>
            )}
          </div>
        )}

        {!hideButtons && (
          <div className="flex flex-wrap justify-center gap-4 items-center mt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-white cursor-pointer text-black border px-6 py-2 rounded-md shadow-sm hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="reset"
              onClick={handleReset}
              className="bg-gray-700 cursor-pointer text-white px-6 py-2 rounded-md shadow-sm hover:bg-gray-800"
            >
              Reset
            </button>
            <button
              type={noFormTag ? 'button' : 'submit'}
              onClick={() => {
                noFormTag ? onSubmit(formik.values) : {};
              }}
              className="bg-[#6F4E37] cursor-pointer text-white px-6 py-2 rounded-md shadow-sm hover:bg-[#a98f7d]"
            >
              {buttonText}
            </button>
          </div>
        )}
      </FormWrapper>
    </div>
  );
};

export default CommonAddForm;
