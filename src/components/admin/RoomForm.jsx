import React from 'react';
import { useFormik } from 'formik';
import { Upload } from 'lucide-react';
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

// Validation schema using Yup
const RoomSchema = Yup.object().shape({
  template_name: Yup.string().required('Template name is required'),
  category: Yup.string().required('Category is required'),
  room_type: Yup.string().required('Room type is required'),
  status: Yup.string().oneOf(['active', 'inactive']).required('Status is required'),
  description: Yup.string().required('Description is required'),
});

const AddNewRoom = () => {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      template_name: '',
      category: '',
      room_type: '',
      status: '',
      description: '',
    },
    validationSchema: RoomSchema,
    onSubmit: async values => {
      try {
        // Here you would typically make an API call to save the room
        // console.log('Submitting room data:', values);
        toast.success('Room template added successfully!');
        navigate('/admin/room/list');
      } catch (error) {
        console.error('Error adding room:', error);
        toast.error('Failed to add room template');
      }
    },
  });

  const handleCancel = () => {
    formik.resetForm();
    navigate('/admin/room/list');
  };

  const fileInputRef = React.useRef(null);
  const [previewUrl, setPreviewUrl] = React.useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-3xl font-bold py-4 mt-6 px-4 sm:px-8 md:px-12">
          Add New Room Template
        </h1>
      </div>
      <div className="sm:mx-10 p-6 bg-[#FFF5EE]">
        <form onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-[#FFF5EE]">
            {/* Template Name */}
            <div className="space-y-2">
              <Label htmlFor="template_name" className="font-medium">Template Name</Label>
              <Input
                id="template_name"
                name="template_name"
                placeholder="Enter template name"
                value={formik.values.template_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`bg-white text-black h-10 hover:bg-white font-[400] ${
                  formik.touched.template_name && formik.errors.template_name ? 'border-red-500' : ''
                }`}
              />
              {formik.touched.template_name && formik.errors.template_name && (
                <div className="text-red-500 text-sm">{formik.errors.template_name}</div>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category" className="font-medium">Category</Label>
              <Select
                name="category"
                value={formik.values.category}
                onValueChange={value => formik.setFieldValue('category', value)}
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
                  <SelectItem value="luxury">Luxury</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="budget">Budget</SelectItem>
                </SelectContent>
              </Select>
              {formik.touched.category && formik.errors.category && (
                <div className="text-red-500 text-sm">{formik.errors.category}</div>
              )}
            </div>

            {/* Room Type */}
            <div className="space-y-2">
              <Label htmlFor="room_type" className="font-medium">Room Type</Label>
              <Select
                name="room_type"
                value={formik.values.room_type}
                onValueChange={value => formik.setFieldValue('room_type', value)}
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
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="double">Double</SelectItem>
                  <SelectItem value="suite">Suite</SelectItem>
                  <SelectItem value="deluxe">Deluxe</SelectItem>
                </SelectContent>
              </Select>
              {formik.touched.room_type && formik.errors.room_type && (
                <div className="text-red-500 text-sm">{formik.errors.room_type}</div>
              )}
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status" className="font-medium">Status</Label>
              <Select
                name="status"
                value={formik.values.status}
                onValueChange={value => formik.setFieldValue('status', value)}
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
              <Label htmlFor="description" className="font-medium">Description</Label>
              <textarea
                id="description"
                name="description"
                placeholder="Enter room description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
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

            {/* Upload Image button (50%) */}
            <div className="space-y-2 w-full">
              <label className="text-black font-medium">Upload Image</label>
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-50  h-28 object-cover rounded-md"
                />
              )}
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
                  className="flex cursor-pointer items-center gap-2 bg-[#6F4E37] text-white px-4 py-2 rounded-md hover:bg-[#a98f7d] transition"
                >
                  <Upload className="w-4 h-4" />
                  <span className="font-medium">Upload Image</span>
                </button>
                {previewUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="flex cursor-pointer items-center gap-2 bg-[#6F4E37] text-white px-4 py-2 rounded-md hover:bg-[#a98f7d] transition"
                  >
                    <span className="font-medium">Remove</span>
                  </button>
                )}
              </div>
              {formik.touched.image && formik.errors.image && (
                <div className="text-red-500 text-sm">{formik.errors.image}</div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="bg-white text-[#6F4E37] border-[#6F4E37] hover:bg-[#6F4E37] hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#6F4E37] text-white hover:bg-[#a98f7d]"
            >
              Save
            </Button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddNewRoom;