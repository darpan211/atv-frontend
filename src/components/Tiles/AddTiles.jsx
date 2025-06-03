import React, { useState } from 'react';
import Select from 'react-select';
import { Icon } from '../common/icons';
import TilesPreview from './TilesPreview'; // Make sure this is the updated one

const seriesOptions = [
  { value: 'classic', label: 'Classic Series' },
  { value: 'modern', label: 'Modern Series' },
  { value: 'vintage', label: 'Vintage Series' },
  { value: 'premium', label: 'Premium Series' },
];

const categoryOptions = [
  { value: 'floor', label: 'Floor Tiles' },
  { value: 'wall', label: 'Wall Tiles' },
  { value: 'decorative', label: 'Decorative Tiles' },
  { value: 'mosaic', label: 'Mosaic Tiles' },
];

const suitablePlaceOptions = [
  { value: 'bathroom', label: 'Bathroom' },
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'living-room', label: 'Living Room' },
  { value: 'bedroom', label: 'Bedroom' },
  { value: 'outdoor', label: 'Outdoor' },
  { value: 'commercial', label: 'Commercial' },
];

const sizeOptions = [
  { value: 'small', label: 'Small (12x12 inches)' },
  { value: 'medium', label: 'Medium (18x18 inches)' },
  { value: 'large', label: 'Large (24x24 inches)' },
  { value: 'extra-large', label: 'Extra Large (36x36 inches)' },
];

const customSelectStyles = {
  control: (base, state) => ({
    ...base,
    borderColor: state.isFocused ? '#7b4f28' : '#D1D5DB',
    boxShadow: state.isFocused ? '0 0 0 2px rgba(123, 79, 40, 0.4)' : 'none',
    '&:hover': { borderColor: '#7b4f28' },
    borderRadius: '0.5rem',
    padding: '2px',
    fontSize: '1rem',
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? '#7b4f28' : 'white',
    color: state.isFocused ? 'white' : '#374151',
    padding: '10px 12px',
  }),
};

const AddTiles = () => {
  const [tileImage, setTileImage] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    series: [],
    category: [],
    suitablePlace: [],
    size: [],
    description: '',
  });
  const [status, setStatus] = useState('active');
  const [showPreview, setShowPreview] = useState(false);

  const handleImageUpload = e => {
    const file = e.target.files?.[0];
    if (file) setTileImage(file);
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectChange = (field, values) => {
    setFormData(prev => ({ ...prev, [field]: values }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Name is required.');
      return;
    }
    if (!tileImage) {
      alert('Please upload an image.');
      return;
    }
    if (!formData.description.trim()) {
      alert('Description is required.');
      return;
    }

    const form = new FormData();
    form.append('tiles_name', formData.name);
    form.append('description', formData.description);
    form.append('tiles_image', tileImage);
    formData.series.forEach(item => form.append('series', item.value));
    formData.category.forEach(item => form.append('category', item.value));
    formData.suitablePlace.forEach(item => form.append('suitable_place', item.value));
    formData.size.forEach(item => form.append('size', item.value));

    try {
      const response = await addTile(form);
      alert('Tile added successfully!');
      setFormData({
        name: '',
        series: [],
        category: [],
        suitablePlace: [],
        size: [],
        description: '',
      });
      setTileImage(null);
    } catch (error) {
      console.error('Error adding tile:', error.response || error.message);
      alert(error.response?.data?.message || 'Something went wrong on the server.');
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-[#FFF5EE] max-w-7xl mx-auto p-6 sm:p-8 lg:p-10 rounded-2xl shadow-lg border border-gray-200">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left side */}
          <div className="flex flex-col space-y-6">
            <div className="flex flex-col sm:flex-row sm:gap-6">
              <div className="w-full sm:w-1/2 mb-6 sm:mb-0">
                <label className="text-lg font-semibold mb-2 block text-gray-800">Tile Image</label>
                <label
                  htmlFor="tileImageUpload"
                  className="font-semibold bg-[#7b4f28] hover:bg-[#633e1f] text-white text-sm px-6 py-3 rounded-lg cursor-pointer flex items-center gap-3 transition-colors duration-200 w-[186px]"
                >
                  <Icon name="Upload" height="24px" width="24px" />
                  Upload Image
                  {/* </label> */}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
                {tileImage && (
                  <p className="text-sm text-gray-600 mt-2">Selected: {tileImage.name}</p>
                )}
              </div>

              <div className="w-full sm:w-1/2">
                <label className="text-lg font-semibold mb-2 block text-gray-800">Name</label>
                <input
                  id="tileImageUpload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                {tileImage && (
                  <p className="text-sm text-gray-600 mt-2">Selected: {tileImage.name}</p>
                )}
              </div>
              <div className="w-full sm:w-1/2">
                <label htmlFor="name" className="text-lg font-semibold mb-2 block text-gray-800">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7b4f28] outline-none text-gray-700 bg-white"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="description"
                className="text-lg font-semibold mb-2 block text-gray-800"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={5}
                placeholder="Enter short description (optional)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7b4f28] outline-none resize-none text-gray-700 bg-white"
                required
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex flex-col space-y-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="w-full lg:w-1/2">
                <MultiSelectDropdown
                  label="Series"
                  options={optionsData.series}
                  selectedValues={formData.series}
                  onChange={values => handleMultiSelectChange('series', values)}
                />
              </div>
              <div className="w-full lg:w-1/2">
                <MultiSelectDropdown
                  label="Category"
                  options={optionsData.category}
                  selectedValues={formData.category}
                  onChange={values => handleMultiSelectChange('category', values)}
                />
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              <div className="w-full lg:w-1/2">
                <MultiSelectDropdown
                  label="Suitable Place"
                  options={optionsData.suitablePlace}
                  selectedValues={formData.suitablePlace}
                  onChange={values => handleMultiSelectChange('suitablePlace', values)}
                />
              </div>
              <div className="w-full lg:w-1/2">
                <MultiSelectDropdown
                  label="Size"
                  options={optionsData.size}
                  selectedValues={formData.size}
                  onChange={values => handleMultiSelectChange('size', values)}
                />
              </div>
            </div>

            <div className="bg-[#fdf5f0] text-[18px]">
              <label className="text-lg font-semibold mb-2 block text-gray-800 ">Status</label>
              <div className="flex gap-6 items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="active"
                    checked={status === 'active'}
                    onChange={() => setStatus('active')}
                    className="accent-[#633e1f] w-4 h-4 border-2 p-1 border-[#6b4a3f] rounded-full"
                  />
                  <span>Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="inactive"
                    checked={status === 'inactive'}
                    onChange={() => setStatus('inactive')}
                    className="w-4 h-4 border-2 accent-[#633e1f] border-[#6b4a3f] rounded-full"
                  />
                  <span>Inactive</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-10">
            <button
              type="submit"
              onClick={handleSubmit}
              className="bg-[#633e1f] text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 text-lg shadow-md hover:shadow-lg"
            >
              Tiles Preview
            </button>
          </div>
        </form>
      </div>

      {/* Preview Modal */}
      <TilesPreview visible={showPreview} onClose={() => setShowPreview(false)} />
    </div>
  );
};

export default AddTiles;
