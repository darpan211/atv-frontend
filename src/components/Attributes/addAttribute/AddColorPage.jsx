// import { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import Layout from '@/components/common/Layout';
// import CommonAddForm from '@/components/common/CommonAddForm';
// import { addColor, updateColor, getColorById } from '@/services/attributeServices/colorService';

// const AddColorPage = () => {
//   const navigate = useNavigate();
//   const { mode, id } = useParams();
//   const isEdit = mode === 'edit';

//   const [colorData, setColorData] = useState(null);
//   const [loading, setLoading] = useState(isEdit);

//   useEffect(() => {
//     if (isEdit && id) {
//       const fetchColor = async () => {
//         try {
//           const result = await getColorById(id);

//           // ✅ Normalize to match Formik field names
//           const transformedData = {
//             _id: result._id,
//             name: result.colors, // map "colors" → "name"
//           };

//           setColorData(transformedData);
//         } catch (error) {
//           console.error('Failed to fetch color:', error);
//         } finally {
//           setLoading(false);
//         }
//       };

//       fetchColor();
//     }
//   }, [isEdit, id]);

//   const handleSubmit = async values => {
//     try {
//       const payload = { colors: values.name };

//       if (isEdit) {
//         await updateColor(colorData._id, payload);
//       } else {
//         await addColor(payload);
//       }

//       navigate('/admin/colors', {
//         state: {
//           toastMessage: isEdit ? 'Color updated successfully!' : 'Color added successfully!',
//         },
//       });
//     } catch (error) {
//       console.error('Failed to submit:', error);
//     }
//   };

//   if (loading) return <div className="p-4 text-center">Loading...</div>;
//   if (isEdit && !colorData) return <div className="p-4 text-gray-600">Loading color...</div>;

//   const initialValues = colorData || { name: '' };

//   return (
//     <Layout title="Colors" isEdit={isEdit}>
//       <CommonAddForm
//         label="Color Name"
//         buttonText={isEdit ? 'Update Color' : 'Add Color'}
//         initialValues={initialValues}
//         onSubmit={handleSubmit}
//       />
//     </Layout>
//   );
// };

// export default AddColorPage;
import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '@/components/common/Layout';
import CommonAddForm from '@/components/common/CommonAddForm';
import { fetchColorById, addColor, updateColor } from '@/redux/slice/colors/colorThunks';

const AddColorPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mode, id } = useParams();
  const isEdit = mode === 'edit';

  // Get relevant state from Redux store
  const { selectedColor, loading, error } = useSelector(state => state.colors);

  useEffect(() => {
    if (isEdit && id) {
      dispatch(fetchColorById(id));
    }
  }, [dispatch, isEdit, id]);

  const initialValues = useMemo(() => {
    if (isEdit && selectedColor) {
      return { name: selectedColor.colors || '' };
    }
    return { name: '' };
  }, [isEdit, selectedColor]);

  const handleSubmit = async values => {
    const payload = { colors: values.name };

    try {
      if (isEdit) {
        await dispatch(updateColor({ id, data: payload })).unwrap();
      } else {
        await dispatch(addColor(payload)).unwrap();
      }

      navigate('/admin/colors', {
        state: {
          toastMessage: isEdit ? 'Color updated successfully!' : 'Color added successfully!',
        },
      });
    } catch (err) {
      console.error('Failed to submit:', err);
      // Optionally, you can handle error state or toast here
    }
  };

  if (isEdit && loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <Layout title="Colors" isEdit={isEdit}>
      <CommonAddForm
        label="Color Name"
        buttonText={isEdit ? 'Update Color' : 'Add Color'}
        initialValues={initialValues}
        onSubmit={handleSubmit}
      />
    </Layout>
  );
};

export default AddColorPage;
