import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import DataTable from '../common/DataTable';
import { useNavigate } from 'react-router-dom';
import { EditIcon } from '../common/icons/svgs/EditIcon';
import { DeleteIcon } from '../common/icons/svgs/DeleteIcon';

const Seller = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const originalSellers = [
    {
      id: 1,
      sellerName: 'Global Merchandise',
      ownerName: 'John Smith',
      mobile: '+1 (555) 123-4567',
      subscriptionDate: '2023-05-15',
      paymentStatus: 'Paid',
      status: 'Active',
    },
    {
      id: 2,
      sellerName: 'Tech Gadgets Inc',
      ownerName: 'Sarah Johnson',
      mobile: '+1 (555) 987-6543',
      subscriptionDate: '2023-06-22',
      paymentStatus: 'Overdue',
      status: 'Inactive',
    },
    {
      id: 3,
      sellerName: 'Fashionista Store',
      ownerName: 'Michael Brown',
      mobile: '+1 (555) 456-7890',
      subscriptionDate: '2023-04-10',
      paymentStatus: 'Paid',
      status: 'Active',
    },
  ];

  const handleAddSeller = () => {
    navigate('/admin/seller/create');
  };

  const handleSearchInput = query => {
    setSearchQuery(query);
  };

  const filteredSellers = useMemo(() => {
    const lower = searchQuery.toLowerCase();
    return originalSellers.filter(seller => seller.sellerName.toLowerCase().includes(lower));
  }, [searchQuery, originalSellers]);

  const columns = [
    {
      header: 'Seller Name',
      accessor: 'sellerName',
    },
    {
      header: 'Owner Name',
      accessor: 'ownerName',
    },
    {
      header: 'Mobile',
      accessor: 'mobile',
    },
    {
      header: 'Subscription Date',
      accessor: 'subscriptionDate',
      cell: row => {
        const date = new Date(row.subscriptionDate);
        return date.toLocaleDateString();
      },
    },
    {
      header: 'Payment Status',
      cell: row => {
        const getStatusColor = status => {
          switch (status) {
            case 'Paid':
              return 'bg-green-800 text-white';
            case 'Overdue':
              return 'bg-[#4D4D4D] text-white';
            case 'Pending':
              return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
            default:
              return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
          }
        };
        return (
          <Badge className={`font-normal ${getStatusColor(row.paymentStatus)}`}>
            {row.paymentStatus}
          </Badge>
        );
      },
    },
    {
      header: 'Status',
      cell: row => {
        const getStatusColor = status => {
          switch (status) {
            case 'Active':
              return 'bg-green-800 text-white';
            case 'Inactive':
              return 'bg-[#6E6E6E] text-white';
          }
        };
        return <Badge className={`font-normal ${getStatusColor(row.status)}`}>{row.status}</Badge>;
      },
    },
    {
      header: 'Actions',
      className: 'w-32 text-center',
      cell: row => (
        <div className="btns flex gap-5 text-xl ml-4">
          <div className="cursor-pointer">
            <EditIcon className="text-[#a98f7d] cursor-pointer" />
          </div>
          <div className="cursor-pointer">
            <DeleteIcon className="text-[#a98f7d] cursor-pointer" />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 max-w-full sm:mx-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">List of Sellers</h1>
        <Button
          onClick={handleAddSeller}
          className="bg-[#6F4E37] cursor-pointer hover:bg-[#a98f7d] text-white"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Seller
        </Button>
      </div>

      <DataTable
        data={filteredSellers}
        columns={columns}
        onSearch={handleSearchInput}
        onAddClick={handleAddSeller}
        searchPlaceholder="Search Seller"
        addButtonText="Add Seller"
        emptyStateMessage="No sellers found."
      />
    </div>
  );
};

export default Seller;
