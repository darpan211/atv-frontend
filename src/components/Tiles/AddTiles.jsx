// import React, { useState, useRef, useEffect } from 'react';
// import { Icon } from '../common/icons';
// import { addTile } from '@/services/tilesService';

// const optionsData = {
//   series: [
//     { value: 'classic', label: 'Classic Series' },
//     { value: 'modern', label: 'Modern Series' },
//     { value: 'vintage', label: 'Vintage Series' },
//     { value: 'premium', label: 'Premium Series' },
//   ],
//   category: [
//     { value: 'floor', label: 'Floor Tiles' },
//     { value: 'wall', label: 'Wall Tiles' },
//     { value: 'decorative', label: 'Decorative Tiles' },
//     { value: 'mosaic', label: 'Mosaic Tiles' },
//   ],
//   suitablePlace: [
//     { value: 'bathroom', label: 'Bathroom' },
//     { value: 'kitchen', label: 'Kitchen' },
//     { value: 'living-room', label: 'Living Room' },
//     { value: 'bedroom', label: 'Bedroom' },
//     { value: 'outdoor', label: 'Outdoor' },
//     { value: 'commercial', label: 'Commercial' },
//   ],
//   size: [
//     { value: 'small', label: 'Small (12x12 inches)' },
//     { value: 'medium', label: 'Medium (18x18 inches)' },
//     { value: 'large', label: 'Large (24x24 inches)' },
//     { value: 'extra-large', label: 'Extra Large (36x36 inches)' },
//   ],
// };

// const MultiSelectDropdown = ({ label, options, selectedValues, onChange }) => {
//   const [showDropdown, setShowDropdown] = useState(false);
//   const ref = useRef();

//   useEffect(() => {
//     const handleClickOutside = e => {
//       if (ref.current && !ref.current.contains(e.target)) {
//         setShowDropdown(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const toggleDropdown = () => setShowDropdown(prev => !prev);

//   const handleCheckboxChange = option => {
//     const isSelected = selectedValues.some(item => item.value === option.value);
//     const updatedValues = isSelected
//       ? selectedValues.filter(item => item.value !== option.value)
//       : [...selectedValues, option];
//     onChange(updatedValues);
//   };

//   const getDisplayValue = () => {
//     if (selectedValues.length === 0) return `Select ${label}`;
//     if (selectedValues.length === 1) return selectedValues[0].label;
//     return `${selectedValues.length} ${label} selected`;
//   };

//   return (
//     <div className="relative" ref={ref}>
//       <label className="text-lg font-semibold mb-2 block text-gray-800">{label}</label>
//       <div
//         className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white cursor-pointer"
//         onClick={toggleDropdown}
//       >
//         {getDisplayValue()}
//       </div>
//       {showDropdown && (
//         <div className="absolute z-10 w-full mt-2 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
//           {options.map(option => (
//             <label
//               key={option.value}
//               className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-gray-100"
//             >
//               <input
//                 type="checkbox"
//                 checked={selectedValues.some(item => item.value === option.value)}
//                 onChange={() => handleCheckboxChange(option)}
//                 className="custom-checkbox"
//               />
//               <span className="text-gray-800">{option.label}</span>
//             </label>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// const AddTiles = () => {
//   const [tileImage, setTileImage] = useState(null);
//   const [formData, setFormData] = useState({
//     name: '',
//     series: [],
//     category: [],
//     suitablePlace: [],
//     size: [],
//     description: '',
//   });

//   const handleImageUpload = e => {
//     const file = e.target.files?.[0];
//     if (file) setTileImage(file);
//   };

//   const handleInputChange = e => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleMultiSelectChange = (field, values) => {
//     setFormData(prev => ({ ...prev, [field]: values }));
//   };

//   // const handleSubmit = e => {
//   //   e.preventDefault();
//   //   const submittedData = {
//   //     ...formData,
//   //     series: formData.series.map(opt => opt.value),
//   //     category: formData.category.map(opt => opt.value),
//   //     suitablePlace: formData.suitablePlace.map(opt => opt.value),
//   //     size: formData.size.map(opt => opt.value),
//   //   };
//   //   console.log('Submitted:', submittedData);
//   //   console.log('Tile Image:', tileImage);
//   // };

//   const handleSubmit = async e => {
//     e.preventDefault();

//     if (!tileImage) {
//       alert('Please upload an image.');
//       return;
//     }

//     if (!formData.description.trim()) {
//       alert('Description is required.');
//       return;
//     }

//     const form = new FormData();
//     form.append('name', formData.name);
//     form.append('description', formData.description);
//     form.append('tileImage', tileImage);

//     // Convert array fields
//     formData.series.forEach(item => form.append('series[]', item.value));
//     formData.category.forEach(item => form.append('category[]', item.value));
//     formData.suitablePlace.forEach(item => form.append('suitablePlace[]', item.value));
//     formData.size.forEach(item => form.append('size[]', item.value));

//     try {
//       const response = await addTile(form);
//       console.log('Tile added:', response);
//       alert('Tile added successfully!');
//       setFormData({
//         name: '',
//         series: [],
//         category: [],
//         suitablePlace: [],
//         size: [],
//         description: '',
//       });
//       setTileImage(null);
//     } catch (error) {
//       console.error('Error adding tile:', error.response || error.message);
//       alert(error.response?.data?.message || 'Something went wrong on the server.');
//     }
//   };

//   return (
//     <div className="w-full px-4 sm:px-6 lg:px-8 py-10">
//       <div className="bg-[#FFF5EE] max-w-7xl mx-auto p-6 sm:p-8 lg:p-10 rounded-2xl shadow-lg border border-gray-200">
//         <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
//           {/* Left side */}
//           <div className="flex flex-col space-y-6">
//             <div className="flex flex-col sm:flex-row sm:gap-6">
//               <div className="w-full sm:w-1/2 mb-6 sm:mb-0">
//                 <label className="text-lg font-semibold mb-2 block text-gray-800">Tile Image</label>
//                 <label className="font-semibold bg-[#7b4f28] hover:bg-[#633e1f] text-white text-sm px-6 py-3 rounded-lg cursor-pointer flex items-center gap-3 transition-colors duration-200 w-[186px]">
//                   <Icon name="Upload" height="24px" width="24px" />
//                   Upload Image
//                   <input
//                     type="file"
//                     className="hidden"
//                     accept="image/*"
//                     onChange={handleImageUpload}
//                   />
//                 </label>
//                 {tileImage && (
//                   <p className="text-sm text-gray-600 mt-2">Selected: {tileImage.name}</p>
//                 )}
//               </div>
//               <div className="w-full sm:w-1/2">
//                 <label className="text-lg font-semibold mb-2 block text-gray-800">Name</label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   placeholder="Enter name"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7b4f28] outline-none text-gray-700 bg-white"
//                 />
//               </div>
//             </div>
//             <div>
//               <label className="text-lg font-semibold mb-2 block text-gray-800">Description</label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 rows={5}
//                 placeholder="Enter short description (optional)"
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7b4f28] outline-none resize-none text-gray-700 bg-white"
//               />
//             </div>
//           </div>

//           {/* Right side - dropdowns */}
//           <div className="flex flex-col space-y-6">
//             <div className="flex flex-col lg:flex-row gap-6">
//               <div className="w-full lg:w-1/2">
//                 <MultiSelectDropdown
//                   label="Series"
//                   options={optionsData.series}
//                   selectedValues={formData.series}
//                   onChange={values => handleMultiSelectChange('series', values)}
//                 />
//               </div>
//               <div className="w-full lg:w-1/2">
//                 <MultiSelectDropdown
//                   label="Category"
//                   options={optionsData.category}
//                   selectedValues={formData.category}
//                   onChange={values => handleMultiSelectChange('category', values)}
//                 />
//               </div>
//             </div>

//             <div className="flex flex-col lg:flex-row gap-6">
//               <div className="w-full lg:w-1/2">
//                 <MultiSelectDropdown
//                   label="Suitable Place"
//                   options={optionsData.suitablePlace}
//                   selectedValues={formData.suitablePlace}
//                   onChange={values => handleMultiSelectChange('suitablePlace', values)}
//                 />
//               </div>
//               <div className="w-full lg:w-1/2">
//                 <MultiSelectDropdown
//                   label="Size"
//                   options={optionsData.size}
//                   selectedValues={formData.size}
//                   onChange={values => handleMultiSelectChange('size', values)}
//                 />
//               </div>
//             </div>
//           </div>
//         </form>

//         <div className="flex justify-center mt-10">
//           <button
//             type="submit"
//             onClick={handleSubmit}
//             className="bg-[#7b4f28] hover:bg-[#633e1f] text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 text-lg shadow-md hover:shadow-lg"
//           >
//             Add Tiles
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddTiles;
// ... imports remain the same
import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '../common/icons'; // Assumes custom icon component
import { addTile } from '@/services/tilesService';

const optionsData = {
  series: [
    { value: 'classic', label: 'Classic Series' },
    { value: 'modern', label: 'Modern Series' },
    { value: 'vintage', label: 'Vintage Series' },
    { value: 'premium', label: 'Premium Series' },
  ],
  category: [
    { value: 'floor', label: 'Floor Tiles' },
    { value: 'wall', label: 'Wall Tiles' },
    { value: 'decorative', label: 'Decorative Tiles' },
    { value: 'mosaic', label: 'Mosaic Tiles' },
  ],
  suitablePlace: [
    { value: 'bathroom', label: 'Bathroom' },
    { value: 'kitchen', label: 'Kitchen' },
    { value: 'living-room', label: 'Living Room' },
    { value: 'bedroom', label: 'Bedroom' },
    { value: 'outdoor', label: 'Outdoor' },
    { value: 'commercial', label: 'Commercial' },
  ],
  size: [
    { value: 'small', label: 'Small (12x12 inches)' },
    { value: 'medium', label: 'Medium (18x18 inches)' },
    { value: 'large', label: 'Large (24x24 inches)' },
    { value: 'extra-large', label: 'Extra Large (36x36 inches)' },
  ],
};

const MultiSelectDropdown = ({ label, options, selectedValues, onChange }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = e => {
      if (ref.current && !ref.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => setShowDropdown(prev => !prev);

  const handleCheckboxChange = option => {
    const isSelected = selectedValues.some(item => item.value === option.value);
    const updatedValues = isSelected
      ? selectedValues.filter(item => item.value !== option.value)
      : [...selectedValues, option];
    onChange(updatedValues);
  };

  const getDisplayValue = () => {
    if (selectedValues.length === 0) return `Select ${label}`;
    if (selectedValues.length === 1) return selectedValues[0].label;
    return `${selectedValues.length} ${label} selected`;
  };

  return (
    <div className="relative" ref={ref}>
      <label
        className="text-lg font-semibold mb-2 block text-gray-800"
        htmlFor={`multi-select-${label}`}
      >
        {label}
      </label>
      <div
        id={`multi-select-${label}`}
        role="button"
        tabIndex={0}
        onClick={toggleDropdown}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleDropdown();
          }
        }}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white cursor-pointer"
      >
        {getDisplayValue()}
      </div>
      {showDropdown && (
        <div className="absolute z-10 w-full mt-2 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map(option => (
            <label
              key={option.value}
              className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-gray-100"
            >
              <input
                type="checkbox"
                checked={selectedValues.some(item => item.value === option.value)}
                onChange={() => handleCheckboxChange(option)}
                className="custom-checkbox"
              />
              <span className="text-gray-800">{option.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
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
                </label>
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
          </div>

          {/* Submit Button */}
          <div className="lg:col-span-2 flex justify-center mt-6">
            <button
              type="submit"
              className="inline-flex items-center gap-3 rounded-lg bg-[#7b4f28] px-10 py-3 text-white font-semibold text-lg shadow-lg hover:bg-[#633e1f] transition-colors duration-200"
            >
              Add Tile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTiles;
