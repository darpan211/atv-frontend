import React from 'react';
import { useFormik } from 'formik';
import { Upload, X } from 'lucide-react';
import * as Yup from 'yup';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { addRoom, fetchRoomById, updateRoom } from '@/redux/slice/room/roomThunks';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchCategories } from '@/redux/slice/categories/categoryThunks';

// Validation schema using Yup
const RoomSchema = Yup.object().shape({
  template_name: Yup.string().required('Template name is required'),
  category: Yup.string().required('Category is required'),
  room_type: Yup.string().required('Room type is required'),
  status: Yup.string().oneOf(['active', 'inactive']).required('Status is required'),
  description: Yup.string(), // Removed required validation
  upload_image: Yup.mixed().nullable(),
});

const AddNewRoom = () => {
  const { categories } = useSelector(state => state);
  console.log(categories);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const categoriesOptions =
    categories?.list?.data?.map(category => ({
      label: category.category,
      value: category.category,
    })) || [];

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id'); // ← works with ?id=...
  // const { id } = useParams();
  console.log(id, 'id=>>>>>>');
  const isEditMode = Boolean(id);
  // Get loading state from Redux store
  const { loading, error } = useSelector(state => state.rooms);

  const formik = useFormik({
    initialValues: {
      template_name: '',
      category: '',
      room_type: '',
      status: 'active',
      description: '',
      upload_image: null,
    },
    validationSchema: RoomSchema,
    onSubmit: async values => {
      const formData = new FormData();
      formData.append('template_name', values.template_name);
      formData.append('category', values.category);
      formData.append('room_type', values.room_type);
      formData.append('status', values.status);
      formData.append('description', values.description);
      if (values.image) {
        formData.append('upload_image', values.image);
      }

      try {
        if (isEditMode) {
          await dispatch(updateRoom({ id, formData })).unwrap();
          toast.success('Room updated successfully');
        } else {
          await dispatch(addRoom(formData)).unwrap();
          toast.success('Room added successfully');
        }
        navigate('/admin/room/list');
      } catch (err) {
        toast.error(err.message || 'Something went wrong');
      }
    },
  });

  const handleCancel = () => {
    formik.resetForm();
    setPreviewUrl(null);
    navigate('/admin/room/list');
  };

  const fileInputRef = React.useRef(null);
  const [previewUrl, setPreviewUrl] = React.useState(null);

  const handleFileChange = event => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      // Validate file size (e.g., max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        toast.error('File size must be less than 5MB');
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Only JPEG, JPG, and PNG files are allowed');
        return;
      }

      // Set the file in formik values
      formik.setFieldValue('image', file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.onerror = () => {
        toast.error('Error reading file');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    formik.setFieldValue('image', null);
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  useEffect(() => {
    if (isEditMode) {
      dispatch(fetchRoomById(id))
        .unwrap()
        .then(room => {
          formik.setValues({
            template_name: room.template_name || '',
            category: room.category || '',
            room_type: room.room_type || '',
            status: room.status || 'active',
            description: room.description || '',
            image: null, // Image upload remains empty
          });
        })
        .catch(() => {
          toast.error('Failed to fetch room details');
        });
    }
  }, [id]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 text-left">
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditMode ? 'Edit Room Template' : 'Add New Room Template'}
        </h1>
      </div>
      <div className="p-6 bg-[#FFF5EE] rounded-md shadow-sm">
        <form onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-[#FFF5EE]">
            {/* Template Name */}
            <div className="space-y-2">
              <Label htmlFor="template_name" className="font-medium">
                Template Name
              </Label>
              <Input
                id="template_name"
                name="template_name"
                placeholder="Enter template name"
                value={formik.values.template_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={loading}
                className={`bg-white text-black h-10 hover:bg-white font-[400] ${
                  formik.touched.template_name && formik.errors.template_name
                    ? 'border-red-500'
                    : ''
                }`}
              />
              {formik.touched.template_name && formik.errors.template_name && (
                <div className="text-red-500 text-sm">{formik.errors.template_name}</div>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category" className="font-medium">
                Category
              </Label>
              <Select
                name="category"
                value={formik.values.category}
                onValueChange={value => formik.setFieldValue('category', value)}
                disabled={loading}
              >
                <SelectTrigger
                  id="category"
                  className={`bg-white h-10 ${
                    formik.touched.category && formik.errors.category ? 'border-red-500' : ''
                  }`}
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>

                <SelectContent>
                  {categoriesOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formik.touched.category && formik.errors.category && (
                <div className="text-red-500 text-sm">{formik.errors.category}</div>
              )}
            </div>

            {/* Room Type */}
            <div className="space-y-2">
              <Label htmlFor="room_type" className="font-medium">
                Room Type
              </Label>
              <Select
                name="room_type"
                value={formik.values.room_type}
                onValueChange={value => formik.setFieldValue('room_type', value)}
                disabled={loading}
              >
                <SelectTrigger
                  id="room_type"
                  className={`bg-white h-10 ${
                    formik.touched.room_type && formik.errors.room_type ? 'border-red-500' : ''
                  }`}
                >
                  <SelectValue placeholder="Select room type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bathroom">bathroom</SelectItem>
                  <SelectItem value="kitchen">kitchen</SelectItem>
                  <SelectItem value="living room">living room</SelectItem>
                </SelectContent>
              </Select>
              {formik.touched.room_type && formik.errors.room_type && (
                <div className="text-red-500 text-sm">{formik.errors.room_type}</div>
              )}
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status" className="font-medium">
                Status
              </Label>
              <Select
                name="status"
                value={formik.values.status}
                onValueChange={value => formik.setFieldValue('status', value)}
                disabled={loading}
              >
                <SelectTrigger
                  id="status"
                  className={`bg-white h-10 ${
                    formik.touched.status && formik.errors.status ? 'border-red-500' : ''
                  }`}
                >
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              {formik.touched.status && formik.errors.status && (
                <div className="text-red-500 text-sm">{formik.errors.status}</div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 bg-[#FFF5EE] mt-6">
            {/* Description field (50%) */}
            <div className="space-y-2 w-full">
              <Label htmlFor="description" className="font-medium">
                Description
              </Label>
              <textarea
                id="description"
                name="description"
                placeholder="Enter room description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={loading}
                className={`bg-white text-black h-28 w-full resize-none p-2 rounded-md font-[400] ${
                  formik.touched.description && formik.errors.description
                    ? 'border border-red-500'
                    : 'border border-gray-300'
                }`}
              />
              {formik.touched.description && formik.errors.description && (
                <div className="text-red-500 text-sm">{formik.errors.description}</div>
              )}
            </div>

            {/* Upload Image section (50%) */}
            <div className="space-y-2 w-full">
              <label className="text-black font-medium">Upload Image</label>

              {/* Image preview with cross icon - positioned above upload button */}
              {previewUrl && (
                <div className="relative  w-50 h-28">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    disabled={loading}
                    className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    title="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Upload button */}
              <div className="flex flex-row gap-4 mt-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                  className="flex cursor-pointer items-center gap-2 bg-[#6F4E37] text-white px-4 py-2 rounded-md hover:bg-[#a98f7d] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload className="w-4 h-4" />
                  <span className="font-medium">Upload Image</span>
                </button>
              </div>

              {formik.touched.upload_image && formik.errors.upload_image && (
                <div className="text-red-500 text-sm">{formik.errors.upload_image}</div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-center gap-4 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
              className="bg-white text-[#6F4E37] border-[#6F4E37] hover:bg-[#6F4E37] hover:text-white disabled:opacity-50"
            >
              Cancel
            </Button>
            <Button type="submit" className="...">
              {loading ? 'Saving...' : isEditMode ? 'Update Template' : 'Add Template'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewRoom;
