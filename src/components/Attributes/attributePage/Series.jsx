import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '@/components/common/Layout';
import DataTable from '@/components/common/DataTable';
import { toast, Bounce, ToastContainer } from 'react-toastify';

import { fetchSeries, deleteSeries } from '@/redux/slice/series/seriesThunks';
import DeleteConfirmationModal from '@/components/common/DeleteConfirmationModal';
import { DeleteIcon } from '@/components/common/icons/svgs/DeleteIcon';
import { EditIcon } from '@/components/common/icons/svgs/EditIcon';
import Loader from '@/components/common/Loader';

const Series = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { list: seriesData, loading, error } = useSelector(state => state.series);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const columns = [
    {
      header: 'Series Name',
      accessor: 'series',
    },
    {
      header: 'Actions',
      className: 'w-32 text-center',
      cell: row => (
        <div className="btns flex gap-5 text-xl ml-4">
          <div className="cursor-pointer" onClick={() => handleEdit(row)}>
            <EditIcon className="text-[#a98f7d]" />
          </div>
          <div className="cursor-pointer" onClick={() => handleDeleteClick(row._id)}>
            <DeleteIcon className="text-[#a98f7d] cursor-pointer" />
          </div>
        </div>
      ),
    },
  ];

  useEffect(() => {
    dispatch(fetchSeries());
  }, [dispatch]);

  useEffect(() => {
    if (location.state?.toastMessage) {
      toast.success(location.state.toastMessage);

      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleDeleteClick = id => {
    setSelectedSeries(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (!selectedSeries) return;
      setIsDeleting(true);

      dispatch(deleteSeries(selectedSeries));
      dispatch(fetchSeries());
      toast.success('Series deleted successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to delete series.');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setSelectedSeries(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedSeries(null);
  };

  const handleEdit = item => {
    navigate(`/admin/series/edit/${item._id}`);
  };

  const handleSearchInput = query => {
    setSearchQuery(query);
  };

  // Filter series based on search query
  const filteredSeries = useMemo(() => {
    const lower = searchQuery.toLowerCase();
    return seriesData?.data?.filter(series => series?.series?.toLowerCase().includes(lower));
  }, [searchQuery, seriesData]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <Loader />
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title="Series"
      buttonLabel="Add Series"
      onButtonClick={() => navigate('/admin/series/add')}
    >
      <DataTable
        data={filteredSeries}
        columns={columns}
        onSearch={handleSearchInput}
        searchPlaceholder="Search series"
        addButtonText="Add Series"
        emptyStateMessage="No series found."
        loading={loading}
      />

      {showDeleteModal && (
        <DeleteConfirmationModal
          tile={{ description: 'This action cannot be undone. Do you want to continue?' }}
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          isLoading={isDeleting}
        />
      )}
    </Layout>
  );
};

export default Series;
