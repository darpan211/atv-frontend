import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast, Bounce } from 'react-toastify';
import { useEffect, useMemo, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';

import {
  fetchSuitablePlaces,
  deleteSuitablePlace,
} from '@/redux/slice/suitablePlace/suitablePlaceThunks';
import { clearSuitablePlacesState } from '@/redux/slice/suitablePlace/suitablePlaceSlice';

import Layout from '@/components/common/Layout';
import DataTable from '@/components/common/DataTable';
import DeleteConfirmationModal from '@/components/common/DeleteConfirmationModal';
import { DeleteIcon } from '@/components/common/icons/svgs/DeleteIcon';
import { EditIcon } from '@/components/common/icons/svgs/EditIcon';
import Loader from '@/components/common/Loader';

const SuitablePlacePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const {list: places, loading, error} = useSelector(state => state.suitablePlace);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const columns = [
    {
      header: 'Suitable Place',
      accessor: 'suitablePlace',
    },
    {
      header: 'Actions',
      className: 'w-32 text-center',
      cell: row => (
        <div className="btns flex gap-5 text-xl ml-4">
          <div
            className="cursor-pointer"
            onClick={() => navigate(`/admin/places/edit/${row._id}`, { state: row })}
          >
            <EditIcon className="text-[#a98f7d]" />
          </div>
          <div className="cursor-pointer" onClick={() => handleDeleteClick(row?._id)}>
            <DeleteIcon className="text-[#a98f7d] cursor-pointer" />
          </div>
        </div>
      ),
    },
  ];

  // Show toast from location state
  useEffect(() => {
    if (location.state?.toastMessage) {
      toast.success(location.state.toastMessage);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Fetch places on mount
  useEffect(() => {
    dispatch(fetchSuitablePlaces());
    return () => {
      dispatch(clearSuitablePlacesState());
    };
  }, [dispatch]);

  // // Show error toast if loading failed
  // useEffect(() => {
  //   if (error) {
  //     toast.error('Failed to load suitable places.');
  //   }
  // }, [error]);

  const handleDeleteClick = id => {
    setSelectedPlace(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (!selectedPlace) return;

      setIsDeleting(true);
      dispatch(deleteSuitablePlace(selectedPlace));
      dispatch(fetchSuitablePlaces());
      toast.success('Place deleted successfully!');
    } catch(err) {
      toast.error(err.message || 'Failed to delete place.');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setSelectedPlace(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedPlace(null);
  };

  const handleSearchInput = query => {
    setSearchQuery(query);
  };

  // Filter places based on search query
  const filteredPlaces = useMemo(() => {
    const lower = searchQuery.toLowerCase();
    return places?.data.filter(place => place?.suitablePlace?.toLowerCase().includes(lower));
  }, [searchQuery, places]);

    if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <Loader/>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title="Suitable Places"
      buttonLabel="Add Suitable Place"
      onButtonClick={() => navigate('/admin/places/add')}
    >
      <DataTable
        data={filteredPlaces}
        columns={columns}
        onSearch={handleSearchInput}
        searchPlaceholder="Search suitable place"
        addButtonText="Add Suitable Place"
        emptyStateMessage="No suitable place found."
        loading={loading}
      />

      {showDeleteModal && (
        <DeleteConfirmationModal
          tile={{
            description: 'This action cannot be undone. Do you want to continue?',
          }}
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          isLoading={isDeleting}
        />
      )}
    </Layout>
  );
};

export default SuitablePlacePage;
