import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/common/Layout';
import CommonTable from '@/components/common/CommonTable';
import { toast, Bounce } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { fetchColors } from '@/redux/slice/colors/colorThunks';
import { deleteColor } from '@/redux/slice/colors/colorThunks';

const ColorsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Access colors list and loading/error from redux store
  const { list: colors, loading, error } = useSelector(state => state.colors);

  // Fetch colors on mount
  useEffect(() => {
    dispatch(fetchColors());
  }, [dispatch]);

  // Show toast from location state
  useEffect(() => {
    if (location.state?.toastMessage) {
      toast.success(location.state.toastMessage, {
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
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Handle delete with dispatch
  const handleDelete = async id => {
    try {
      await dispatch(deleteColor(id)).unwrap();
      toast.success('Color deleted successfully!', {
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
      toast.error('Failed to delete color.', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'light',
      });
    }
  };

  return (
    <Layout
      title="Colors"
      buttonLabel="Add Color"
      onButtonClick={() => navigate('/admin/colors/add')}
    >
      <CommonTable
        type="colors"
        data={colors}
        loading={loading}
        onEdit={item => navigate(`/admin/colors/edit/${item._id}`, { state: item })}
        onDelete={handleDelete}
      />
      {/* {error && <p className="text-red-500 mt-2">{error}</p>} */}
      {error && <p className="text-red-500 mt-2">{error?.message || String(error)}</p>}
    </Layout>
  );
};

export default ColorsPage;
