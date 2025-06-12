import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { Icon } from '../common/icons';
import TilesPreview from './TilesPreview';
import TileUploadModal from './TileUploadModal';
import { MultiSelectDropdown } from '../common/MultiSelectDropdown';
import { Input } from '../ui/input';

import { clearTilesState, clearSelectedTile } from '@/redux/slice/tiles/tileSlice';
import { fetchSuitablePlaces } from '@/redux/slice/suitablePlace/suitablePlaceThunks';
import { fetchSizes } from '@/redux/slice/sizes/sizeThunks';
import { fetchSeries } from '@/redux/slice/series/seriesThunks';
import { fetchCategories } from '@/redux/slice/categories/categoryThunks';
import { fetchMaterials } from '@/redux/slice/material/materialThunks';
import { fetchFinishes } from '@/redux/slice/finish/finishThunks';
import { data } from 'react-router-dom';
import AddSizePage from '../Attributes/addAttribute/AddSizePage';
import AddSeriesPage from '../Attributes/addAttribute/AddSeriesPage';
import AddMaterialPage from '../Attributes/addAttribute/AddMaterialPage';
import AddPlacePage from '../Attributes/addAttribute/AddPlacePage';
import AddCategoryPage from '../Attributes/addAttribute/AddCategoryPage';
import AddColorPage from '../Attributes/addAttribute/AddColorPage';

const validationSchema = Yup.object().shape({
  size: Yup.array().min(1, 'Please select at least one size').required('Size is required'),
  material: Yup.array(),
  finish: Yup.array(),
  tileImages: Yup.array()
    .min(1, 'At least one tile image is required')
    .required('Tile images are required'),
  series: Yup.array(),
  suitablePlace: Yup.array(),
  description: Yup.string(),
  status: Yup.string().oneOf(['active', 'inactive']).default('active'),
});

const AddTiles = () => {
  const dispatch = useDispatch();
  const { categories, series, sizes, suitablePlace, finishes, materials } = useSelector(
    state => state
  );
  const [showPreview, setShowPreview] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [tileImages, setTileImages] = useState([]); // [{ file, thickness, name }]
  const [errors, setErrors] = useState({});
  const [openPopup, setOpenPopup] = useState(null); // null or 'size' | 'series' | 'material' | 'finish' | 'suitablePlace' | etc.

  useEffect(() => {
    dispatch(fetchSuitablePlaces());
    dispatch(fetchSizes());
    dispatch(fetchSeries());
    dispatch(fetchCategories());
    dispatch(fetchMaterials());
    dispatch(fetchFinishes());
  }, [dispatch]);

  console.log(series);

  const formik = useFormik({
    initialValues: {
      name: '',
      tileImages: [],
      series: [],
      material: [],
      finish: [],
      suitablePlace: [],
      size: [],
      description: '',
      status: 'active',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setShowPreview(true);
        toast.success('Tile added successfully!');
      } catch (error) {
        toast.error(error?.message || 'Failed to add tile.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Map redux data to dropdown options (using .list.data)
  const sizeOptions =
    sizes?.list?.data?.map(size => ({
      label: size.sizes,
      value: size.sizes,
    })) || [];

  const seriesOptions =
    series?.list?.data?.map(item => ({
      label: item.series,
      value: item.series,
    })) || [];

  const materialOptions =
    materials?.list?.data?.map(cat => ({
      label: cat.material,
      value: cat.material,
    })) || [];

  // Update finishOptions to use Redux data
  const finishOptions =
    finishes?.list?.map(f => ({
      label: f.finish,
      value: f.finish,
    })) || [];

  const suitablePlaceOptions =
    suitablePlace?.list?.data?.map(place => ({
      label: place.suitablePlace,
      value: place.suitablePlace,
    })) || [];

  const DropdownWithAdd = ({ label, options, selectedValues, onChange, error }) => (
    <div className="w-full">
      <label className="text-sm font-semibold block text-gray-800 mb-1">{label}</label>
      <div className="flex gap-1 items-center space-between">
        <div className="flex-1">
          <MultiSelectDropdown
            label={label}
            options={options}
            selectedValues={selectedValues}
            onChange={onChange}
            heightClass="h-10 w-full rounded-md"
          />
          {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
        </div>
        <button
          type="button"
          className="h-10 w-10 rounded-md p-0 bg-[#7b4f28] text-white flex items-center justify-center hover:bg-[#633e1f] border border-gray-300"
          // style={{ minWidth: '44px', minHeight: '44px' }}
          onClick={() => {
            if (label === 'Size') setOpenPopup('size');
            else if (label === 'Series') setOpenPopup('series');
            else if (label === 'Material') setOpenPopup('material');
            else if (label === 'Finish') setOpenPopup('finish');
            else if (label === 'Suitable Place') setOpenPopup('suitablePlace');
            else if (label === 'Category') setOpenPopup('category');
            else if (label === 'Color') setOpenPopup('color');
          }}
        >
          <Icon name="Plus" width={20} height={20} />
        </button>
      </div>
    </div>
  );

  const handleUploadComplete = newImages => {
    setTileImages(prevImages => [...prevImages, ...newImages]);
    setShowModal(false);
  };

  const setTileImageName = (index, name) => {
    setTileImages(prev => prev.map((img, i) => (i === index ? { ...img, name } : img)));
  };

  const setTileImageThickness = (index, thickness) => {
    setTileImages(prev => prev.map((img, i) => (i === index ? { ...img, thickness } : img)));
  };

  const handleDeleteImage = index => {
    setTileImages(prev => prev.filter((_, i) => i !== index));
  };

  const canSubmit =
    tileImages.length > 0 &&
    tileImages.every(
      img =>
        img.name &&
        img.name.trim() !== '' &&
        img.thickness !== undefined &&
        String(img.thickness).trim() !== ''
    );

  // Overlay popup rendering
  const renderPopup = () => {
    if (!openPopup) return null;
    let PopupComponent = null;
    if (openPopup === 'size') PopupComponent = AddSizePage;
    else if (openPopup === 'series') PopupComponent = AddSeriesPage;
    else if (openPopup === 'material') PopupComponent = AddMaterialPage;
    else if (openPopup === 'suitablePlace') PopupComponent = AddPlacePage;
    else if (openPopup === 'category') PopupComponent = AddCategoryPage;
    else if (openPopup === 'color') PopupComponent = AddColorPage;
    // For finish, you may need a separate component if available
    if (!PopupComponent) return null;
    return (
      // <div className="absolute left-1/2 top-10 z-50 transform -translate-x-1/2 bg-white rounded-xl shadow-lg p-6 border border-gray-200" style={{minWidth: 400, maxWidth: 500}}>
      <div className="absolute left-1/2 top-10 z-50 transform -translate-x-1/2 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl font-bold"
          onClick={() => setOpenPopup(null)}
          aria-label="Close"
        >
          &times;
        </button>
        <PopupComponent />
      </div>
    );
  };

  return (
    <div className="w-full  px-4 sm:px-6 lg:px-8 py-6">
      <div className="text-center  mb-6">
        <h1 className="text-3xl  font-bold text-gray-900 mb-2">Add New Tiles</h1>
        <div className="flex justify-center mb-10">
          <div className="h-[2px] w-[170px] bg-gray-300 relative">
            <div className="absolute -top-1 left-1/2 w-5 h-5 bg-[#6F4E37] -translate-1/4 "></div>
          </div>
        </div>
      </div>

      <div className="bg-[#FFF5EE] max-w-7xl mx-auto p-6 rounded-xl shadow-md border border-gray-200">
        <form onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <DropdownWithAdd
              label="Size"
              options={sizeOptions}
              selectedValues={formik.values.size}
              onChange={vals => formik.setFieldValue('size', vals)}
              error={formik.touched.size && formik.errors.size}
            />
            <DropdownWithAdd
              label="Series"
              options={seriesOptions}
              selectedValues={formik.values.series}
              onChange={vals => formik.setFieldValue('series', vals)}
              error={formik.touched.series && formik.errors.series}
            />
            <DropdownWithAdd
              label="Material"
              options={materialOptions}
              selectedValues={formik.values.material}
              onChange={vals => formik.setFieldValue('material', vals)}
              error={formik.touched.material && formik.errors.material}
            />
            <DropdownWithAdd
              label="Suitable Place"
              options={suitablePlaceOptions}
              selectedValues={formik.values.suitablePlace}
              onChange={vals => formik.setFieldValue('suitablePlace', vals)}
              error={formik.touched.suitablePlace && formik.errors.suitablePlace}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="lg:col-span-2 lg:row-span-2">
              <label className="text-sm font-semibold block text-gray-800 mb-1">Description</label>
              <textarea
                name="description"
                rows={6}
                placeholder="Enter short description (optional)"
                value={formik.values.description}
                onChange={formik.handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 bg-white resize-none focus:outline-none"
              />
            </div>
            {/* Finish in third column */}
            <div>
              <DropdownWithAdd
                label="Finish"
                options={finishOptions}
                selectedValues={formik.values.finish}
                onChange={vals => formik.setFieldValue('finish', vals)}
                error={formik.touched.finish && formik.errors.finish}
              />
              {/* Title Image directly below Finish */}
              <div className="mt-6 w-fit">
                <label className="text-sm font-semibold mb-1 block text-gray-800">
                  Title Image
                </label>
                <label
                  onClick={() => setShowModal(true)}
                  className="font-semibold bg-[#7b4f28] hover:bg-[#633e1f] text-white text-xs px-5 py-2.5 rounded-md cursor-pointer flex items-center gap-2 transition-colors duration-200 h-10"
                >
                  <Icon name="Upload" height="16px" width="16px" />
                  Upload Image
                </label>
                {formik.touched.tileImages && formik.errors.tileImages && (
                  <p className="text-red-600 text-sm mt-1">{formik.errors.tileImages}</p>
                )}
              </div>
            </div>
            {/* Status in fourth column */}
            <div>
              <label className="text-sm font-semibold block text-gray-800 mb-1">Status</label>
              <div className="flex gap-4 h-10 items-center">
                {['active', 'inactive'].map(status => (
                  <label key={status} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="status"
                      value={status}
                      checked={formik.values.status === status}
                      onChange={formik.handleChange}
                      className="accent-[#633e1f] cursor-pointer w-4 h-4"
                    />
                    <span className="capitalize text-sm">{status}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </form>
      </div>
      <TileUploadModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onUploadComplete={handleUploadComplete}
      />
      {tileImages.length > 0 && (
        <>
          <TilesPreview
            images={tileImages}
            setTileImageName={setTileImageName}
            setTileImageThickness={setTileImageThickness}
            onDelete={handleDeleteImage}
          />
          <div className="flex justify-center mt-6">
            <button
              type="button"
              className={`bg-[#633e1f] text-white font-semibold px-6 py-2.5 rounded-md transition-colors duration-200 text-sm shadow-md hover:shadow-lg ${!canSubmit ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!canSubmit}
              onClick={() => {
                /* handle submit logic here */
              }}
            >
              Submit
            </button>
          </div>
        </>
      )}
      {renderPopup()}
    </div>
  );
};

export default AddTiles;
