import React from 'react';
// import DataTable from './DataTable';
import { Button } from '@/components/ui/button';
import { CiEdit } from 'react-icons/ci';

import { RiDeleteBinLine } from 'react-icons/ri';

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
const Rooms = () => {
  const navigate = useNavigate();
  // Sample data
  const roomsData = [
    {
      id: 1,
      image: 'https://via.placeholder.com/100x60?text=Room+1',
      templateName: 'Modern Minimalist',
      category: 'Living Room',
      roomType: 'Lounge',
      description: 'A sleek and modern room with neutral tones.',
      status: 'Active',
    },
    {
      id: 2,
      image: 'https://via.placeholder.com/100x60?text=Room+2',
      templateName: 'Cozy Cottage',
      category: 'Bedroom',
      roomType: 'Master Bedroom',
      description: 'Warm and inviting space with wooden accents.',
      status: 'Inactive',
    },
    {
      id: 3,
      image: 'https://via.placeholder.com/100x60?text=Room+3',
      templateName: 'Urban Loft',
      category: 'Studio',
      roomType: 'Multi-purpose',
      description: 'Open-concept design with industrial features.',
      status: 'Active',
    },
  ];

  // Table column definitions
  const columns = [
    {
      header: 'Room Image',
      accessor: 'sellerName',
    },
    {
      header: 'Template Name',
      accessor: 'ownerName',
    },
    {
      header: 'Category',
      accessor: 'mobile',
    },
    {
      header: 'Room Type',
      accessor: 'mobile',
    },
    {
      header: 'Descrpition',
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
              return 'bg-green-800 text-white';
            case 'Overdue':
              return 'bg-[#4D4D4D] text-white ';
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
              return 'bg-green-800 text-white ';
            case 'Inactive':
              return 'bg-[#6E6E6E] text-white ';
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
        // <DropdownMenu>
        //   <DropdownMenuTrigger asChild>
        //     <Button variant="ghost" className="h-8 w-8 p-0">
        //       <span className="sr-only">Open menu</span>
        //       <MoreHorizontal className="h-4 w-4" />
        //     </Button>
        //   </DropdownMenuTrigger>
        //   <DropdownMenuContent align="end">
        //     <DropdownMenuLabel>Actions</DropdownMenuLabel>
        //     <DropdownMenuSeparator />
        //     <DropdownMenuItem className="cursor-pointer">
        //       <Eye className="mr-2 h-4 w-4" />
        //       <span>View Details</span>
        //     </DropdownMenuItem>
        //     <DropdownMenuItem className="cursor-pointer">
        //       <Edit className="mr-2 h-4 w-4" />
        //       <span>Edit</span>
        //     </DropdownMenuItem>
        //     <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-500">
        //       <Trash2 className="mr-2 h-4 w-4" />
        //       <span>Delete</span>
        //     </DropdownMenuItem>
        //   </DropdownMenuContent>
        // </DropdownMenu>

        // Edit and Delete Buttons
        <div className="btns flex gap-4 text-xl">
          <CiEdit className="text-[#a98f7d]" />
          <RiDeleteBinLine className="text-[#a98f7d]" />
        </div>
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
    navigate('/admin/roomform');
    // Implement add seller logic here
  };

  return (
    <div className="p-6 max-w-full sm:mx-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">List of Sellers</h1>
        <Button onClick={handleAddSeller} className="bg-[#6F4E37] hover:bg-[#a98f7d] text-white cursor-pointer">
          <Plus className="mr-2 h-4 w-4" /> Add Room
        </Button>
      </div>
      <DataTable
        data={roomsData}
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

export default Rooms;
