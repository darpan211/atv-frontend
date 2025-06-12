import React, { useMemo, useState, useEffect } from 'react';
import DataTable from '../common/DataTable';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { EditIcon } from '../common/icons/svgs/EditIcon';
import { DeleteIcon } from '../common/icons/svgs/DeleteIcon';
import { toast } from 'react-toastify';
import DeleteConfirmationModal from '../common/DeleteConfirmationModal';
import { fetchAdmins, deleteAdmin } from '@/redux/slice/admin/adminThunk';
import Layout from '@/components/common/Layout';
import Loader from '../common/Loader';

const Admin = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { list: admins, loading, error } = useSelector(state => state.admin);

  // Load admins
  useEffect(() => {
    dispatch(fetchAdmins())
      .unwrap()
      .catch(err => toast.error(err?.message || 'Failed to fetch admins'));
  }, [dispatch]);

  // Show toast from redirect
  useEffect(() => {
    if (location.state?.toastMessage) {
      toast.success(location.state.toastMessage);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleAddAdmin = () => {
    navigate('/admin/dashboard/create');
  };

  const handleEdit = (admin) => {
    navigate(`/admin/dashboard/edit/${admin._id}`);
  };

  const handleDeleteClick = (admin) => {
    setSelectedAdmin(admin);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      await dispatch(deleteAdmin(selectedAdmin._id)).unwrap();
      await dispatch(fetchAdmins());
      toast.success('Admin deleted successfully!');
    } catch (err) {
      toast.error(err?.message || 'Failed to delete admin');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setSelectedAdmin(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedAdmin(null);
  };

  const handleSearchInput = (query) => {
    setSearchQuery(query);
  };

  const filteredAdmins = useMemo(() => {
    if (!admins) return [];
    const lower = searchQuery.toLowerCase();
    return admins.filter(admin =>
      admin.admin_name?.toLowerCase().includes(lower) ||
      admin.email?.toLowerCase().includes(lower)
    );
  }, [searchQuery, admins]);

  const columns = [
    {
      header: 'Admin Name',
      accessor: 'admin_name',
    },
    {
      header: 'Email',
      accessor: 'email',
    },
    {
      header: 'Password',
      accessor: 'password',
    },
    {
      header: 'Actions',
      className: 'w-32 text-center',
      cell: row => (
        <div className="btns flex gap-5 text-xl ml-4">
          <div className="cursor-pointer" onClick={() => handleEdit(row)}>
            <EditIcon className="text-[#a98f7d] cursor-pointer" />
          </div>
          <div className="cursor-pointer" onClick={() => handleDeleteClick(row)}>
            <DeleteIcon className="text-[#a98f7d] cursor-pointer" />
          </div>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <Loader/>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600">{error}</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Admins" buttonLabel="Add Admin" onButtonClick={handleAddAdmin}>
      <DataTable
        data={filteredAdmins}
        columns={columns}
        onSearch={handleSearchInput}
        onAddClick={handleAddAdmin}
        searchPlaceholder="Search Admin"
        addButtonText="Add Admin"
        emptyStateMessage="No admins found."
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

export default Admin;
