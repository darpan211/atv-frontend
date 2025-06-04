// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { ToastContainer, toast, Bounce } from 'react-toastify';
// import { useEffect } from 'react';
// import 'react-toastify/dist/ReactToastify.css';

// import {
//   fetchSuitablePlaces,
//   deleteSuitablePlace,
// } from '@/redux/slice/suitablePlace/suitablePlaceThunks';
// import { clearSuitablePlacesState } from '@/redux/slice/suitablePlace/suitablePlaceSlice';

// import Layout from '@/components/common/Layout';
// import CommonTable from '@/components/common/CommonTable';

// const SuitablePlacePage = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const suitablePlaceState = useSelector(state => state.suitablePlace);
//   const places = suitablePlaceState?.list || [];
//   const loading = suitablePlaceState?.loading || false;
//   const error = suitablePlaceState?.error || null;

//   useEffect(() => {
//     dispatch(fetchSuitablePlaces());
//     return () => {
//       dispatch(clearSuitablePlacesState());
//     };
//   }, [dispatch]);

//   useEffect(() => {
//     if (location.state?.toastMessage) {
//       toast.success(location.state.toastMessage, {
//         position: 'top-right',
//         autoClose: 3000,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         theme: 'light',
//         transition: Bounce,
//         className: 'bg-white rounded-md shadow-md border-2',
//         style: { borderColor: '#6F4E37' },
//         bodyClassName: 'text-[#6F4E37] font-semibold text-lg',
//         progressStyle: { backgroundColor: '#6F4E37' },
//       });

//       window.history.replaceState({}, document.title);
//     }
//   }, [location]);

//   useEffect(() => {
//     if (error) {
//       toast.error('Failed to load suitable places.', {
//         position: 'top-right',
//         autoClose: 3000,
//         theme: 'light',
//       });
//     }
//   }, [error]);

//   const handleDelete = async id => {
//     try {
//       await dispatch(deleteSuitablePlace(id)).unwrap();
//       toast.success('Place deleted successfully!', {
//         position: 'top-right',
//         autoClose: 3000,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         theme: 'light',
//         transition: Bounce,
//         className: 'bg-white rounded-md shadow-md border-2',
//         style: { borderColor: '#6F4E37' },
//         bodyClassName: 'text-[#6F4E37] font-semibold text-lg',
//         progressStyle: { backgroundColor: '#6F4E37' },
//       });
//     } catch {
//       toast.error('Failed to delete place.', {
//         position: 'top-right',
//         autoClose: 3000,
//         theme: 'light',
//       });
//     }
//   };

//   if (loading) return <div className="p-4 text-center">Loading...</div>;

//   return (
//     <>
//       <Layout
//         title="Suitable Places"
//         buttonLabel="Add Suitable Place"
//         onButtonClick={() => navigate('/admin/places/add')}
//       >
//         <CommonTable
//           type="suitablePlace"
//           data={places}
//           onEdit={item => navigate(`/admin/places/edit/${item._id}`, { state: item })}
//           onDelete={handleDelete}
//         />
//       </Layout>

//       {/* ✅ Ensure ToastContainer is rendered */}
//       <ToastContainer />
//     </>
//   );
// };

// export default SuitablePlacePage;

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';

import {
  fetchSuitablePlaces,
  deleteSuitablePlace,
} from '@/redux/slice/suitablePlace/suitablePlaceThunks';
import { clearSuitablePlacesState } from '@/redux/slice/suitablePlace/suitablePlaceSlice';

import Layout from '@/components/common/Layout';
import CommonTable from '@/components/common/CommonTable';

const SuitablePlacePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const suitablePlaceState = useSelector(state => state.suitablePlace);
  const places = suitablePlaceState?.list || [];
  const loading = suitablePlaceState?.loading || false;
  const error = suitablePlaceState?.error || null;

  // ✅ Show success toast from location.state
  useEffect(() => {
    const toastMessage = location.state?.toastMessage;

    if (toastMessage) {
      toast.success(toastMessage, {
        position: 'top-right',
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'light',
        transition: Bounce,
        className: 'bg-white rounded-md shadow-md border-2',
        style: { borderColor: '#6F4E37' },
        bodyClassName: 'text-[#6F4E37] font-semibold text-lg',
        progressStyle: { backgroundColor: '#6F4E37' },
      });

      // ✅ Clear the toastMessage from location.state so it doesn’t persist
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  useEffect(() => {
    dispatch(fetchSuitablePlaces());
    return () => {
      dispatch(clearSuitablePlacesState());
    };
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error('Failed to load suitable places.', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'light',
      });
    }
  }, [error]);

  const handleDelete = async id => {
    try {
      await dispatch(deleteSuitablePlace(id)).unwrap();
      toast.success('Place deleted successfully!', {
        position: 'top-right',
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'light',
        transition: Bounce,
        className: 'bg-white rounded-md shadow-md border-2',
        style: { borderColor: '#6F4E37' },
        bodyClassName: 'text-[#6F4E37] font-semibold text-lg',
        progressStyle: { backgroundColor: '#6F4E37' },
      });
    } catch {
      toast.error('Failed to delete place.', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'light',
      });
    }
  };

  if (loading) return <div className="p-4 text-center">Loading...</div>;

  return (
    <>
      <Layout
        title="Suitable Places"
        buttonLabel="Add Suitable Place"
        onButtonClick={() => navigate('/admin/places/add')}
      >
        <CommonTable
          type="suitablePlace"
          data={places}
          onEdit={item => navigate(`/admin/places/edit/${item._id}`, { state: item })}
          onDelete={handleDelete}
        />
      </Layout>
      <ToastContainer />
    </>
  );
};

export default SuitablePlacePage;
