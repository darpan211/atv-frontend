import React, { useMemo, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import DataTable from '../common/DataTable';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { EditIcon } from '../common/icons/svgs/EditIcon';
import { DeleteIcon } from '../common/icons/svgs/DeleteIcon';
import { toast, Bounce } from 'react-toastify';
import Layout from '@/components/common/Layout';
import { fetchSellers, deleteSeller } from '@/redux/slice/seller/sellerThunks';
import DeleteConfirmationModal from '../common/DeleteConfirmationModal';

const Seller = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const { list: sellers, loading, error } = useSelector(state => state.seller);
// console.log("All Sellers",sellers);

  // Show toast from location state
  useEffect(() => {
    if (location.state?.toastMessage) {
      toast.success(location.state.toastMessage);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Fetch sellers on component mount
  useEffect(() => {
    dispatch(fetchSellers())
      .unwrap()
      .then(response => {
        if (!response || response.length === 0) {
          toast.info('No sellers found.');
        }
      })
      .catch(error => {
        toast.error(error?.message || 'Failed to fetch sellers');
      });
  }, [dispatch, location.state?.toastMessage]);

  const handleAddSeller = () => {
    navigate('/admin/seller/create');
  };

  const handleEdit = (seller) => {
    navigate(`/admin/seller/edit/${seller._id}`);
  };

  const handleDeleteClick = (seller) => {
    setSelectedSeller(seller);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (!selectedSeller) return;
      setIsDeleting(true);
      await dispatch(deleteSeller(selectedSeller._id)).unwrap();
      await dispatch(fetchSellers());
      toast.success('Seller deleted successfully!');
    } catch (error) {
      toast.error(error?.message || 'Failed to delete seller');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setSelectedSeller(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedSeller(null);
  };

  const handleSearchInput = query => {
    setSearchQuery(query);
  };

  const filteredSellers = useMemo(() => {
    if (!sellers) return [];
    const lower = searchQuery.toLowerCase();
    return sellers.filter(seller => 
      seller.company_name?.toLowerCase().includes(lower) ||
      seller.owner_name?.toLowerCase().includes(lower) ||
      seller.email?.toLowerCase().includes(lower) ||
      seller.mobile?.toLowerCase().includes(lower)
    );
  }, [searchQuery, sellers]);

  const columns = [
    {
      header: 'Seller Name',
      accessor: 'company_name',
    },
    {
      header: 'Owner Name',
      accessor: 'owner_name',
    },
    {
      header: 'Email',
      accessor: 'email',
    },
    {
      header: 'Mobile',
      accessor: 'mobile',
    },
    {
      header: 'Status',
      cell: row => {
        const getStatusColor = status => {
          switch (status?.toLowerCase()) {
            case 'active':
              return 'bg-green-800 text-white';
            case 'inactive':
              return 'bg-[#6E6E6E] text-white';
            default:
              return 'bg-gray-100 text-gray-800';
          }
        };
        return (
          <Badge className={`font-normal ${getStatusColor(row.status)}`}>
            {row.status || 'N/A'}
          </Badge>
        );
      },
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
      <Layout title="Sellers" buttonLabel="Add Seller" onButtonClick={handleAddSeller}>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading sellers...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Sellers" buttonLabel="Add Seller" onButtonClick={handleAddSeller}>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600">{error}</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Sellers" buttonLabel="Add Seller" onButtonClick={handleAddSeller}>
      <DataTable
        data={filteredSellers}
        columns={columns}
        onSearch={handleSearchInput}
        onAddClick={handleAddSeller}
        searchPlaceholder="Search Seller"
        addButtonText="Add Seller"
        emptyStateMessage="No sellers found."
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

export default Seller;
