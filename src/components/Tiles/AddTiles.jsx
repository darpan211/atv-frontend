import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';
import DropdownWithAdd from '../common/DropdownWithAdd';

import { Icon } from '../common/icons';
import TilesPreview from './TilesPreview';
import TileUploadModal from './TileUploadModal';
import { MultiSelectDropdown } from '../common/MultiSelectDropdown';
import { Input } from '../ui/input';

import { clearTilesState, clearSelectedTile } from '@/redux/slice/tiles/tileSlice';
import { fetchSuitablePlaces } from '@/redux/slice/suitablePlace/suitablePlaceThunks';
import { fetchSizes, addSize } from '@/redux/slice/sizes/sizeThunks';
import { fetchSeries, addSeries } from '@/redux/slice/series/seriesThunks';
import { fetchCategories, addCategory } from '@/redux/slice/categories/categoryThunks';
import { fetchMaterials, addMaterial } from '@/redux/slice/material/materialThunks';
import { fetchFinishes, addFinish } from '@/redux/slice/finish/finishThunks';
import { addSuitablePlace } from '@/redux/slice/suitablePlace/suitablePlaceThunks';
import { addColor } from '@/redux/slice/colors/colorThunks';
import { data } from 'react-router-dom';
import AddSizePage from '../Attributes/addAttribute/AddSizePage';
import AddSeriesPage from '../Attributes/addAttribute/AddSeriesPage';
import AddMaterialPage from '../Attributes/addAttribute/AddMaterialPage';
import AddPlacePage from '../Attributes/addAttribute/AddPlacePage';
import AddCategoryPage from '../Attributes/addAttribute/AddCategoryPage';
import AddColorPage from '../Attributes/addAttribute/AddColorPage';
import AddFinishPage from '../Attributes/addAttribute/AddFinishPage';
import { fetchTiles, addTile, updateTile } from '@/redux/slice/tiles/tileThunks';

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
  category: Yup.string().default('tiles'),
});

const AddTiles = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  // Get category from URL query param
  const searchParams = new URLSearchParams(location.search);
  const categoryFromUrl = searchParams.get('category') || 'wall';

  const { categories, series, sizes, suitablePlace, finish, materials, tiles } = useSelector(
    state => state
  );

  const [showPreview, setShowPreview] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [tileImages, setTileImages] = useState([]); // [{ file, thickness, name, favorite }]

  useEffect(() => {
    dispatch(fetchSuitablePlaces());
    dispatch(fetchSizes());
    dispatch(fetchSeries());
    dispatch(fetchCategories());
    dispatch(fetchMaterials());
    dispatch(fetchFinishes());
    dispatch(fetchTiles());
  }, [dispatch]);

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
      tiles_color: '',
      category: categoryFromUrl,
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        // Validate that we have images
        if (tileImages.length === 0) {
          toast.error('At least one tile image is required');
          return;
        }
        // Validate that names and thicknesses are present for each image
        const missingName = tileImages.some(img => !img.name || img.name.trim() === '');
        const missingThickness = tileImages.some(
          img => !img.thickness || String(img.thickness).trim() === ''
        );
        if (missingName || missingThickness) {
          toast.error('Each image must have a name and thickness.');
          return;
        }
        // Validate that size is selected
        if (!values.size || values.size.length === 0) {
          toast.error('Please select at least one size');
          return;
        }
        // Create FormData object for multipart/form-data
        const formData = new FormData();
        formData.append('description', values.description || '');
        formData.append('status', values.status);
        formData.append('category', categoryFromUrl);
        // Add arrays as comma-separated strings (only value, not label)
        formData.append('size', values.size.map(item => item.value).join(', '));
        formData.append('suitable_place', values.suitablePlace.map(item => item.value).join(', '));
        formData.append('series', values.series.map(item => item.value).join(', '));
        formData.append('material', values.material.map(item => item.value).join(', '));
        formData.append('finish', values.finish.map(item => item.value).join(', '));
        // Add tile names, thicknesses, colors, and favorites as comma-separated strings
        const tileNames = tileImages.map(img => img.name).join(',');
        const tileThicknesses = tileImages.map(img => img.thickness).join(',');
        const tileColors = tileImages.map(img => img.color).join(',');
        const tileFavorites = tileImages.map(img => (img.favorite ? 'true' : 'false')).join(',');
        formData.append('tiles_name', tileNames);
        formData.append('thickness', tileThicknesses);
        formData.append('tiles_color', tileColors);
        formData.append('favorite', tileFavorites);
        // Add all tile images as files only (not as string or name)
        tileImages.forEach(image => {
          formData.append('tiles_image', image.file);
        });
        const resultAction = await dispatch(addTile(formData));
        if (resultAction.error) {
          toast.error(resultAction.error.message || 'Failed to add tile');
        } else {
          setShowPreview(true);
          // Reset form and images
          formik.resetForm();
          setTileImages([]);
          // Navigate to tiles list with toast message in state
          navigate('/tiles/list', {
            state: { toastMessage: 'Tile added successfully!' },
          });
        }
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
    finish?.list?.data?.map(f => ({
      label: f.finish,
      value: f.finish,
    })) || [];

  const suitablePlaceOptions =
    suitablePlace?.list?.data?.map(place => ({
      label: place.suitablePlace,
      value: place.suitablePlace,
    })) || [];

  const handleUploadComplete = newImages => {
    // Add favorite: false by default
    const imagesWithFavorite = newImages.map(img => ({ ...img, favorite: false }));
    setTileImages(prevImages => [...prevImages, ...imagesWithFavorite]);
    formik.setFieldValue('tileImages', [...tileImages, ...imagesWithFavorite]);
    setShowModal(false);
  };

  const setTileImageName = (index, name) => {
    setTileImages(prev => prev.map((img, i) => (i === index ? { ...img, name } : img)));
  };

  const setTileImageThickness = (index, thickness) => {
    setTileImages(prev => prev.map((img, i) => (i === index ? { ...img, thickness } : img)));
  };

  const setTileImageFavorite = (index, favorite) => {
    setTileImages(prev => prev.map((img, i) => (i === index ? { ...img, favorite } : img)));
  };

  const handleDeleteImage = index => {
    setTileImages(prev => prev.filter((_, i) => i !== index));
    formik.setFieldValue(
      'tileImages',
      tileImages.filter((_, i) => i !== index)
    );
  };

  const canSubmit =
    tileImages.length > 0 &&
    tileImages.every(
      img =>
        img.name &&
        img.name.trim() !== '' &&
        img.thickness !== undefined &&
        String(img.thickness).trim() !== ''
    ) &&
    formik.values.size.length > 0;

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
                  onClick={() => {
                    if (formik.values.size.length > 0) {
                      setShowModal(true);
                    } else {
                      toast.error('Please select at least one size before uploading images');
                    }
                  }}
                  className={`font-semibold text-white text-xs px-5 py-2.5 rounded-md flex items-center gap-2 transition-colors duration-200 h-10 ${
                    formik.values.size.length > 0
                      ? 'bg-[#7b4f28] hover:bg-[#633e1f] cursor-pointer'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
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
            setTileImageFavorite={setTileImageFavorite}
            onDelete={handleDeleteImage}
          />
          <div className="flex justify-center mt-6">
            <button
              type="button"
              className={`bg-[#633e1f] text-white font-semibold px-6 py-2.5 rounded-md transition-colors duration-200 text-sm shadow-md hover:shadow-lg ${!canSubmit || formik.isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              disabled={!canSubmit || formik.isSubmitting}
              onClick={formik.handleSubmit}
            >
              {formik.isSubmitting ? 'Saving...' : 'Add Tile'}
            </button>
          </div>
        </>
      )}
      {/* {renderPopup()} */}
    </div>
  );
};

export default AddTiles;
