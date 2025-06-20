import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import DeleteConfirmationModal from '@/components/common/DeleteConfirmationModal';
import { deleteRoom, fetchRooms } from '@/redux/slice/room/roomThunks';
import { toast } from 'react-toastify';
import { Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import DataTable from '../common/DataTable';
import { useNavigate } from 'react-router-dom';
import { DeleteIcon } from '../common/icons/svgs/DeleteIcon';
import { EditIcon } from '../common/icons/svgs/EditIcon';

const Rooms = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    list: rooms,
    currentPage: storePage,
    totalPages,
    totalItems,
  } = useSelector(state => state.rooms);

  useEffect(() => {
    dispatch(fetchRooms({ page: currentPage, limit: rowsPerPage }));
  }, [dispatch, currentPage, rowsPerPage]);

  const roomsData = Array.isArray(rooms?.data) ? rooms.data : Array.isArray(rooms) ? rooms : [];
  const handleDeleteClick = id => {
    setSelectedRoomId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedRoomId) return;
    setIsDeleting(true);

    try {
      await dispatch(deleteRoom(selectedRoomId)).unwrap();
      toast.success('Room deleted successfully!');
      dispatch(fetchRooms({ page: currentPage, limit: rowsPerPage }));
    } catch (err) {
      toast.error(err.message || 'Failed to delete room.');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setSelectedRoomId(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedRoomId(null);
  };

  const handleEdit = id => {
    navigate(`/admin/room/edit?id=${id}`);
  };

  const handleAddRoom = () => {
    navigate('/admin/room/add');
  };

  const handlePageChange = page => {
    setCurrentPage(page);
    dispatch(fetchRooms({ page, limit: rowsPerPage }));
  };

  const columns = [
    {
      header: 'Room Image',
      cell: row => (
        <img
          src={row.upload_image}
          alt={row.template_name}
          className="h-12 w-12 object-cover rounded"
        />
      ),
    },
    { header: 'Template Name', accessor: 'template_name' },
    { header: 'Category', accessor: 'category' },
    { header: 'Room Type', accessor: 'room_type' },
    { header: 'Description', accessor: 'description' },
    {
      header: 'Created At',
      cell: row => {
        const date = new Date(row.createdAt);
        return date.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });
      },
    },
    {
      header: 'Status',
      cell: row => {
        const getStatusColor = status => {
          switch (status) {
            case 'active':
              return 'bg-green-800 text-white';
            case 'inactive':
              return 'bg-gray-500 text-white';
            default:
              return 'bg-gray-200 text-black';
          }
        };

        return (
          <Badge className={`font-normal capitalize ${getStatusColor(row.status)}`}>
            {row.status}
          </Badge>
        );
      },
    },
    {
      header: 'Actions',
      cell: row => (
        <div className="btns flex gap-4 text-xl">
          <span
            className="cursor-pointer text-gray-700 hover:text-blue-600 transition duration-200"
            onClick={() => handleEdit(row._id)}
          >
            <EditIcon />
          </span>
          <span
            className="cursor-pointer text-gray-700 hover:text-red-600 transition duration-200"
            onClick={() => handleDeleteClick(row._id)}
          >
            <DeleteIcon />
          </span>
        </div>
      ),
    },
  ];

  const handleSearch = query => {
    setCurrentPage(1);
    dispatch(fetchRooms({ page: 1, limit: rowsPerPage, search: query }));
  };

  return (
    <div className="p-6 max-w-full sm:mx-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Rooms</h1>
        <Button
          onClick={handleAddRoom}
          className="bg-[#6F4E37] hover:bg-[#a98f7d] text-white cursor-pointer"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Room
        </Button>
      </div>

      <DataTable
        data={roomsData}
        columns={columns}
        title="Rooms"
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={limit => {
          setRowsPerPage(limit);
          setCurrentPage(1);
          dispatch(fetchRooms({ page: 1, limit }));
        }}
        onSearch={handleSearch}
        searchPlaceholder="Search Room..."
        emptyStateMessage="No rooms found. Add a room to get started."
      />

      {showDeleteModal && (
        <DeleteConfirmationModal
          tile={{ description: 'This action cannot be undone. Do you want to continue?' }}
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
};

export default Rooms;
