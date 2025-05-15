import React from 'react';
// import DataTable from './DataTable';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Edit, Trash2, Eye, Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import DataTable from '../common/DataTable';
import { useNavigate } from 'react-router-dom';

// Example usage of the DataTable component
const Seller = () => {
  const navigate = useNavigate();
  // Sample data
  const sellers = [
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

  // Table column definitions
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
        // Format date for display
        const date = new Date(row.subscriptionDate);
        return date.toLocaleDateString();
      },
    },
    {
      header: 'Payment Status',
      cell: row => {
        // Render payment status with appropriate styling
        const getStatusColor = status => {
          switch (status) {
            case 'Paid':
              return 'bg-green-100 text-green-800 hover:bg-green-100';
            case 'Overdue':
              return 'bg-red-100 text-red-800 hover:bg-red-100';
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
        // Render status with appropriate styling
        const getStatusColor = status => {
          switch (status) {
            case 'Active':
              return 'bg-green-100 text-green-800 hover:bg-green-100';
            case 'Inactive':
              return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
            case 'Suspended':
              return 'bg-red-100 text-red-800 hover:bg-red-100';
            default:
              return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
          }
        };

        return <Badge className={`font-normal ${getStatusColor(row.status)}`}>{row.status}</Badge>;
      },
    },
    {
      header: 'Actions',
      cell: row => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <Eye className="mr-2 h-4 w-4" />
              <span>View Details</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-500">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  // Event handlers
  const handleSearch = query => {
    console.log('Searching for:', query);
    // Implement actual search logic here
  };

  const handleAddSeller = () => {
    console.log('Add seller clicked');
    navigate('/admin/seller/create');
    // Implement add seller logic here
  };

  return (
    <div className="p-6 max-w-full sm:mx-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">List of Sellers</h1>
        <Button onClick={handleAddSeller} className="bg-cyan-500 hover:bg-cyan-600 text-white">
          <Plus className="mr-2 h-4 w-4" /> Add Seller
        </Button>
      </div>
      <DataTable
        data={sellers}
        columns={columns}
        onSearch={handleSearch}
        onAddClick={handleAddSeller}
        searchPlaceholder="Search Seller..."
        addButtonText="Add Seller"
        emptyStateMessage="No sellers found. Add a seller to get started."
      />
    </div>
  );
};

export default Seller;
