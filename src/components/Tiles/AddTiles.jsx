import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';

import { Icon } from '../common/icons';
import TilePreview from './TilesPreview';
import TileUploadModal from './TileUploadModal';
import { MultiSelectDropdown } from '../common/MultiSelectDropdown';
import { Input } from '../ui/input';

import { clearTilesState, clearSelectedTile } from '@/redux/slice/tiles/tileSlice';
import { fetchSuitablePlaces } from '@/redux/slice/suitablePlace/suitablePlaceThunks';
import { fetchSizes } from '@/redux/slice/sizes/sizeThunks';
import { fetchSeries } from '@/redux/slice/series/seriesThunks';
import { fetchCategories } from '@/redux/slice/categories/categoryThunks';

const validationSchema = Yup.object().shape({
  tileImages: Yup.array().min(1, 'At least one tile image is required'),
  series: Yup.array().min(1, 'Please select at least one series'),
  suitablePlace: Yup.array(),
  size: Yup.array(),
  description: Yup.string(),
  status: Yup.string().oneOf(['active', 'inactive']).required(),
});

const AddTiles = () => {
  const dispatch = useDispatch();
  const { categories, series, sizes, suitablePlace } = useSelector(state => state);
  const [showPreview, setShowPreview] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(fetchSuitablePlaces());
    dispatch(fetchSizes());
    dispatch(fetchSeries());
    dispatch(fetchCategories());
  }, [dispatch]);

  const formik = useFormik({
    initialValues: {
      name: '',
      tileImages: [],
      series: [],
      category: [],
      suitablePlace: [],
      size: [],
      description: '',
      status: 'active',
    },
    validationSchema,
    onSubmit: () => {
      setShowPreview(true); // 👈 Open preview modal on submit
      console.log(tileImages);
    },
  });

  const DropdownWithAdd = ({ label, options, selectedValues, onChange }) => (
    <div className="w-full">
      <label className="text-sm font-semibold block text-gray-800 mb-1">{label}</label>
      <div className="flex gap-1 items-center">
        <div className="flex-1">
          <MultiSelectDropdown
            options={options}
            selectedValues={selectedValues}
            onChange={onChange}
            heightClass="h-10 w-full"
          />
        </div>
        <button
          type="button"
          className="h-10 w-10 rounded-md p-1 bg-[#7b4f28] text-white flex items-center justify-center hover:bg-[#633e1f]"
        >
          +
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Tiles</h1>
        <div className="w-10 h-1 mx-auto bg-[#7b4f28] rounded mt-4" />
      </div>

      <div className="bg-[#FFF5EE] max-w-7xl mx-auto p-6 rounded-xl shadow-md border border-gray-200">
        {/* <form onSubmit={formik.handleSubmit}> */}
        <div className="grid items-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="text-sm font-semibold block text-gray-800 mb-1">Name</label>
            <Input
              name="name"
              placeholder="Enter name"
              onChange={formik.handleChange}
              value={formik.values.name}
              className="h-10 text-sm bg-white border border-gray-300 rounded-md"
            />
          </div>

          <DropdownWithAdd
            label="Size"
            options={
              Array.isArray(sizes?.list)
                ? sizes.list.map(item => ({
                    label: item?.sizes,
                    value: item?.id,
                  }))
                : []
            }
            selectedValues={formik.values.size}
            onChange={vals => formik.setFieldValue('size', vals)}
          />

          <DropdownWithAdd
            label="Series"
            options={
              Array.isArray(series?.list)
                ? series.list.map(item => ({
                    label: item?.series,
                    value: item?.id,
                  }))
                : []
            }
            selectedValues={formik.values.series}
            onChange={vals => formik.setFieldValue('series', vals)}
          />

          <DropdownWithAdd
            label="Material"
            options={
              Array.isArray(categories?.list)
                ? categories.list.map(item => ({
                    label: item?.category,
                    value: item?.id,
                  }))
                : []
            }
            selectedValues={formik.values.category}
            onChange={vals => formik.setFieldValue('category', vals)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          <div className="lg:col-span-1">
            <label className="text-sm font-semibold block text-gray-800 mb-1">Description</label>
            <textarea
              name="description"
              rows={6}
              placeholder="Enter short description (optional)"
              value={formik.values.description}
              onChange={formik.handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 bg-white resize-none"
            />
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex gap-6">
              <DropdownWithAdd
                label="Finish"
                options={[]} // Placeholder
                selectedValues={[]}
                onChange={() => {}}
              />

              <DropdownWithAdd
                label="Suitable Place"
                options={
                  Array.isArray(suitablePlace?.list)
                    ? suitablePlace.list.map(item => ({
                        label: item?.suitablePlace,
                        value: item?.id,
                      }))
                    : []
                }
                selectedValues={formik.values.suitablePlace}
                onChange={vals => formik.setFieldValue('suitablePlace', vals)}
              />
            </div>

            <div className="w-full mt-6 md:mt-0 md:flex md:justify-between md:items-start gap-6">
              <div className="flex-1">
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

              <div className="mt-6 flex-1 md:mt-0">
                <div className="w-fit">
                  <label className="text-sm font-semibold mb-1 block text-gray-800">
                    Title Image
                  </label>
                  <label
                    onClick={() => setShowModal(true)} // <- open modal on click
                    className="font-semibold bg-[#7b4f28] hover:bg-[#633e1f] text-white text-xs px-4 py-2.5 rounded-md cursor-pointer flex items-center gap-2 transition-colors duration-200 h-10"
                  >
                    <Icon name="Upload" height="16px" width="16px" />
                    Upload Image
                  </label>
                  {formik.touched.tileImages && formik.errors.tileImages && (
                    <p className="text-red-500 text-xs mt-1">{formik.errors.tileImages}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* 
        <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="bg-[#633e1f] text-white font-semibold px-6 py-2.5 rounded-md transition-colors duration-200 text-sm shadow-md hover:shadow-lg"
            >
              Tiles Preview
            </button>
          </div>
        </form>

       
        <TilePreview
          visible={showPreview}
          onClose={() => setShowPreview(false)}
          tiles={formik.values.tileImages}
        /> */}
      </div>
      <TileUploadModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onUploadComplete={files => {
          formik.setFieldValue('tileImages', files);
          setShowModal(false);
        }}
      />
    </div>
  );
};

export default AddTiles;
