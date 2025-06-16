import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '@/components/common/Layout';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFinishes, deleteFinish } from '@/redux/slice/finish/finishThunks';
import DeleteConfirmationModal from '@/components/common/DeleteConfirmationModal';
import DataTable from '@/components/common/DataTable';
import { DeleteIcon } from '@/components/common/icons/svgs/DeleteIcon';
import { EditIcon } from '@/components/common/icons/svgs/EditIcon';

const FinishPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { list: finish, loading, error } = useSelector(state => state.finish);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFinish, setSelectedFinish] = useState(null);

  const columns = [
    {
      header: 'Finish Name',
      accessor: 'finish', // ✅ Fixed accessor to lowercase 'finish'
    },
    {
      header: 'Actions',
      className: 'w-32 text-center',
      cell: row => (
        <div className="btns flex gap-5 text-xl ml-4">
          <div
            className="cursor-pointer"
            onClick={() => navigate(`/admin/finish/edit/${row._id}`, { state: row })}
          >
            <EditIcon className="text-[#a98f7d]" /> {/* ✅ Uses currentColor */}
          </div>
          <div className="cursor-pointer" onClick={() => handleDeleteClick(row._id)}>
            <DeleteIcon className="text-[#a98f7d] cursor-pointer" /> {/* ✅ Uses currentColor */}
          </div>
        </div>
      ),
    },
  ];

  useEffect(() => {
    dispatch(fetchFinishes());
  }, [dispatch]);

  useEffect(() => {
    if (location.state?.toastMessage) {
      toast.success(location.state.toastMessage);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleDeleteClick = id => {
    setSelectedFinish(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (!selectedFinish) return;
      await dispatch(deleteFinish(selectedFinish)).unwrap();
      await dispatch(fetchFinishes());
      toast.success('Finish deleted successfully!');
    } catch {
      toast.error('Failed to delete finish.');
    } finally {
      setShowDeleteModal(false);
      setSelectedFinish(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedFinish(null);
  };

  const handleSearchInput = query => {
    setSearchQuery(query);
  };

  // ✅ Safer filtering logic
  const filteredFinishes = useMemo(() => {
    const lower = searchQuery.toLowerCase();
    return finish?.data?.filter(item =>
      (item?.finish || '').toLowerCase().includes(lower)
    );
  }, [searchQuery, finish]);

  return (
    <Layout
      title="Finish"
      buttonLabel="Add Finish"
      onButtonClick={() => navigate('/admin/finish/add')}
    >
      <DataTable
        data={filteredFinishes}
        columns={columns}
        onSearch={handleSearchInput}
        searchPlaceholder="Search finish"
        addButtonText="Add Finish"
        emptyStateMessage="No finish found."
      />

      {showDeleteModal && (
        <DeleteConfirmationModal
          tile={{ description: 'This action cannot be undone. Do you want to continue?' }}
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
        />
      )}
    </Layout>
  );
};

export default FinishPage;
