import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import DataTable from '../common/DataTable';
import { useNavigate } from 'react-router-dom';
import { EditIcon } from '../common/icons/svgs/EditIcon';
import { DeleteIcon } from '../common/icons/svgs/DeleteIcon';

const Admin = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Sample Admin User Data
  const originalAdmins = [
    {
      id: 1,
      userName: 'vinod.chandra',
      email: 'vinod@example.com',
      password: '********',
    },
    {
      id: 2,
      userName: 'deepa.shah',
      email: 'deepa@example.com',
      password: '********',
    },
    {
      id: 3,
      userName: 'rahul.yadav',
      email: 'rahul@example.com',
      password: '********',
    },
  ];

  const handleAddAdmin = () => {
    navigate('/admin/dashboard/create');
  };

  const handleSearchInput = query => {
    setSearchQuery(query);
  };

  const filteredAdmins = useMemo(() => {
    const lower = searchQuery.toLowerCase();
    return originalAdmins.filter(admin =>
      admin.userName.toLowerCase().includes(lower)
    );
  }, [searchQuery, originalAdmins]);

  const columns = [
    {
      header: 'User Name',
      accessor: 'userName',
    },
    {
      header: 'Email',
      accessor: 'email',
    },
    {
      header: 'Password',
      accessor: 'password',
      cell: () => '********', // Masked password
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
        <h1 className="text-3xl font-bold text-gray-900">List of Admin Users</h1>
        <Button
          onClick={handleAddAdmin}
          className="bg-[#6F4E37] cursor-pointer hover:bg-[#a98f7d] text-white"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Admin User
        </Button>
      </div>

      <DataTable
        data={filteredAdmins}
        columns={columns}
        onSearch={handleSearchInput}
        onAddClick={handleAddAdmin}
        searchPlaceholder="Search Admin"
        addButtonText="Add Admin"
        emptyStateMessage="No admins found."
      />
    </div>
  );
};

export default Admin;
