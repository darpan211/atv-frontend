// // src/pages/admin/series/AddSeriesPage.jsx
// import { useEffect, useState } from 'react';
// import { useLocation, useNavigate, useParams } from 'react-router-dom';
// import Layout from '@/components/common/Layout';
// import CommonAddForm from '@/components/common/CommonAddForm';
// import { addSeries, updateSeries, getSeriesById } from '@/services/attributeServices/seriesService';

// const AddSeriesPage = () => {
//   const navigate = useNavigate();
//   const { mode, id } = useParams();
//   const isEdit = mode === 'edit';

//   const [seriesData, setSeriesData] = useState(null);
//   const [loading, setLoading] = useState(isEdit);

//   useEffect(() => {
//     if (isEdit && id) {
//       const fetchSeries = async () => {
//         try {
//           const result = await getSeriesById(id);
//           setSeriesData(result);
//         } catch (error) {
//           console.error('Failed to fetch series:', error);
//         } finally {
//           setLoading(false);
//         }
//       };

//       fetchSeries();
//     }
//   }, [isEdit, id]);

//   const handleSubmit = async values => {
//     const payload = { series: values.name };
//     try {
//       if (isEdit) {
//         await updateSeries(id, payload);
//       } else {
//         await addSeries(payload);
//       }

//       // navigate('/admin/series');
//       navigate('/admin/series', {
//         state: {
//           toastMessage: isEdit ? 'Series updated successfully!' : 'Series added successfully!',
//         },
//       });
//     } catch (error) {
//       console.error('Failed to submit series:', error);
//     }
//   };

//   const initialValues = isEdit ? { name: seriesData?.series || '' } : { name: '' };
//   if (loading) return <div className="p-4 text-center">Loading...</div>;
//   return (
//     <Layout title="Series" isEdit={isEdit}>
//       <CommonAddForm
//         label="Series Name"
//         buttonText={isEdit ? 'Update Series' : 'Add Series'}
//         // initialValues={{ name: seriesData?.name || '' }}
//         initialValues={initialValues}
//         onSubmit={handleSubmit}
//       />
//     </Layout>
//   );
// };

// export default AddSeriesPage;
import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '@/components/common/Layout';
import CommonAddForm from '@/components/common/CommonAddForm';
import { fetchSeriesById, addSeries, updateSeries } from '@/redux/slice/series/seriesThunks';

const AddSeriesPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { mode, id } = useParams();
  const isEdit = mode === 'edit';

  const { currentItem: seriesData, loading } = useSelector(state => state.series);

  useEffect(() => {
    if (isEdit && id) {
      dispatch(fetchSeriesById(id));
    }
  }, [dispatch, isEdit, id]);

  const handleSubmit = async values => {
    const payload = { series: values.name };
    try {
      if (isEdit) {
        await dispatch(updateSeries({ id, data: payload })).unwrap();
      } else {
        await dispatch(addSeries(payload)).unwrap();
      }

      navigate('/admin/series', {
        state: {
          toastMessage: isEdit ? 'Series updated successfully!' : 'Series added successfully!',
        },
      });
    } catch (error) {
      console.error('Failed to submit series:', error);
    }
  };

  const initialValues = isEdit ? { name: seriesData?.series || '' } : { name: '' };

  if (isEdit && loading) return <div className="p-4 text-center">Loading...</div>;

  return (
    <Layout title="Series" isEdit={isEdit}>
      <CommonAddForm
        label="Series Name"
        buttonText={isEdit ? 'Update Series' : 'Add Series'}
        initialValues={initialValues}
        onSubmit={handleSubmit}
      />
    </Layout>
  );
};

export default AddSeriesPage;
