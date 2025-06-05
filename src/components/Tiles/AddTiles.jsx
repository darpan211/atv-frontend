import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { Icon } from '../common/icons';
import TilePreview from './TilesPreview';
import { MultiSelectDropdown } from '../common/MultiSelectDropdown';
import { clearTilesState, clearSelectedTile } from '@/redux/slice/tiles/tileSlice';
import { fetchSuitablePlaces } from '@/redux/slice/suitablePlace/suitablePlaceThunks';
import { fetchSizes } from '@/redux/slice/sizes/sizeThunks';
import { fetchSeries } from '@/redux/slice/series/seriesThunks';
import { fetchCategories } from '@/redux/slice/categories/categoryThunks';
import { Input } from '../ui/input';

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

const validationSchema = Yup.object().shape({
  tileImages: Yup.array()
    .min(1, 'At least one tile image is required')
    .required('Tile images are required'),
  series: Yup.array().min(1, 'Please select at least one series'),
  suitablePlace: Yup.array(),
  size: Yup.array(),
  description: Yup.string(),
  status: Yup.string().oneOf(['active', 'inactive']).required('Status is required'),
});

const AddTiles = () => {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector(state => state.tiles);
  const { categories, series, sizes, suitablePlace } = useSelector(state => state);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    dispatch(fetchSuitablePlaces());
    dispatch(fetchSizes());
    dispatch(fetchSeries());
  }, []);

  const formik = useFormik({
    initialValues: {
      tileImages: [],
      series: [],
      category: [],
      suitablePlace: [],
      size: [],
      description: '',
      status: 'active',
    },
    validationSchema,
    onSubmit: values => {
      setShowPreview(true);
    },
  });

  // useEffect(() => {
  //   if (success) {
  //     toast.success('New tiles added successfully!');
  //     formik.resetForm();
  //     dispatch(clearSelectedTile());
  //     dispatch(clearTilesState());
  //   } else if (error) {
  //     toast.error(error);
  //     dispatch(clearTilesState());
  //   }
  // }, [success, error, dispatch]);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-[#FFF5EE] max-w-7xl mx-auto p-6 sm:p-8 lg:p-10 rounded-2xl shadow-lg border border-gray-200">
        <form onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Tile Images */}
            <div className="w-full">
              <label className="text-lg font-semibold mb-2 block text-gray-800">
                Tile Images{' '}
                {formik.values.tileImages.length ? `(${formik.values.tileImages.length})` : ''}
              </label>
              <label
                htmlFor="tileImagesUpload"
                className="font-semibold bg-[#7b4f28] hover:bg-[#633e1f] text-white text-sm px-6 py-3 rounded-lg cursor-pointer flex items-center gap-3 transition-colors duration-200 w-[200px]"
              >
                <Icon name="Upload" height="24px" width="24px" />
                {'Upload Images'}
                <Input
                  id="tileImagesUpload"
                  name="tileImages"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={e => {
                    const files = Array.from(e.target.files);
                    formik.setFieldValue('tileImages', files);
                  }}
                />
              </label>
              {formik.touched.tileImages && formik.errors.tileImages && (
                <p className="text-red-500 text-sm">{formik.errors.tileImages}</p>
              )}
              {/* {formik.values.tileImages.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formik.values.tileImages.map((file, idx) => (
                    <img
                      key={idx}
                      src={URL.createObjectURL(file)}
                      alt={`preview-${idx}`}
                      className="w-20 h-20 object-cover rounded border"
                    />
                  ))}
                </div>
              )} */}
            </div>

            {/* Series */}
            <div className="w-full">
              <MultiSelectDropdown
                label="Series"
                options={series?.list?.map(item => {
                  return {
                    label: item?.series,
                    value: item?.id,
                  };
                })}
                selectedValues={formik.values.series}
                onChange={vals => formik.setFieldValue('series', vals)}
              />
              {formik.touched.series && formik.errors.series && (
                <p className="text-red-500 text-sm">{formik.errors.series}</p>
              )}
            </div>

            {/* Suitable Place */}
            <div className="w-full">
              <MultiSelectDropdown
                label="Suitable Place"
                options={suitablePlace?.list?.map(item => {
                  return {
                    label: item?.suitablePlace,
                    value: item?.id,
                  };
                })}
                selectedValues={formik.values.suitablePlace}
                onChange={vals => formik.setFieldValue('suitablePlace', vals)}
              />
            </div>

            {/* Size */}
            <div className="w-full">
              <MultiSelectDropdown
                label="Size"
                options={sizes?.list?.map(item => {
                  return {
                    label: item?.sizes,
                    value: item?.id,
                  };
                })}
                selectedValues={formik.values.size}
                onChange={vals => formik.setFieldValue('size', vals)}
              />
            </div>

            {/* Description */}
            <div className="col-span-2">
              <label className="text-lg font-semibold mb-2 block text-gray-800">Description</label>
              <textarea
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white resize-none"
              />
            </div>

            {/* Status */}
            <div className="col-span-1 flex justify-center items-center">
              <div className="bg-[#fdf5f0] text-[18px]">
                <label className="text-lg font-semibold mb-2 block text-gray-800">Status</label>
                <div className="flex gap-6 items-center">
                  {['active', 'inactive'].map(status => (
                    <label key={status} className="flex items-center gap-2 cursor-pointer">
                      <Input
                        type="radio"
                        name="status"
                        value={status}
                        checked={formik.values.status === status}
                        onChange={formik.handleChange}
                        className="accent-[#633e1f] cursor-pointer w-4 h-4 border-2 border-[#6b4a3f] rounded-full"
                      />
                      <span className="capitalize">{status}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-10">
            <button
              type="submit"
              className="bg-[#633e1f] cursor-pointer text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 text-lg shadow-md hover:shadow-lg"
            >
              Tiles Preview
            </button>
          </div>
        </form>
      </div>

      {/* Preview Modal */}
      <TilePreview
        visible={showPreview}
        onClose={() => setShowPreview(false)}
        tiles={formik.values.tileImages}
      />
    </div>
  );
};

export default AddTiles;
