import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { Upload, X, Plus, Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboards } from '@/redux/slice/dashboard/dashboardThunk';

const validationSchema = Yup.object().shape({
  tiles: Yup.array()
    .of(
      Yup.object().shape({
        image: Yup.object({
          url: Yup.string().required('Image preview is required'),
          file: Yup.mixed()
            .nullable()
            .test(
              'fileType',
              'Only image files are allowed',
              value => !value || (value.type && value.type.startsWith('image/'))
            ),
        }),
        name: Yup.string().max(50, 'Name must be 50 characters or less'),
        description: Yup.string().max(150, 'Description must be 150 characters or less'),
      })
    )
    .min(1, 'At least 1 tile is required')
    .max(6, 'Maximum 6 tiles allowed'),
});

const FeaturedImage = ({ onDataChange }) => {
  const fileInputRefs = useRef([]);
  const dispatch = useDispatch();
  const { dashboardData } = useSelector(state => state.dashboard);
  const [initialTiles, setInitialTiles] = useState([
    { image: { url: '', file: null }, name: '', description: '' },
  ]);

  useEffect(() => {
    dispatch(fetchDashboards());
  }, [dispatch]);

  useEffect(() => {
    const featureImages = dashboardData?.[0]?.feature_images;
    if (featureImages && Array.isArray(featureImages)) {
      const mapped = featureImages.map(item => ({
        image: { url: item.image || '', file: null },
        name: item.name || '',
        description: item.description || '',
      }));
      setInitialTiles(mapped);
    }
  }, [dashboardData]);

  const saveTiles = async tiles => {
    console.log('Saving Feature Images:', tiles);
    return new Promise(resolve => setTimeout(() => resolve({ status: 200 }), 300));
  };

  const handleImageUpload = useCallback((index, file, setFieldValue) => {
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Invalid image file!');
      return;
    }
    const imageUrl = URL.createObjectURL(file);
    setFieldValue(`tiles[${index}].image`, { url: imageUrl, file });
  }, []);

  const handleFileInputChange = useCallback(
    (index, e, setFieldValue) => {
      const file = e.target.files?.[0];
      handleImageUpload(index, file, setFieldValue);
      e.target.value = null;
    },
    [handleImageUpload]
  );

  const handleDrop = useCallback(
    (index, e, setFieldValue) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      handleImageUpload(index, file, setFieldValue);
    },
    [handleImageUpload]
  );

  const handleImageRemove = useCallback((index, setFieldValue, values) => {
    if (window.confirm('Remove this image?')) {
      const removedUrl = values.tiles[index].image?.url;
      if (removedUrl) URL.revokeObjectURL(removedUrl);
      setFieldValue(`tiles[${index}].image`, { url: '', file: null });
    }
  }, []);

  const handleDeleteTile = useCallback((index, values, setFieldValue) => {
    if (values.tiles.length <= 1) {
      toast.error('At least one tile is required!');
      return;
    }
    const removedUrl = values.tiles[index].image?.url;
    if (removedUrl) URL.revokeObjectURL(removedUrl);
    const updated = values.tiles.filter((_, i) => i !== index);
    setFieldValue('tiles', updated);
    fileInputRefs.current = fileInputRefs.current.filter((_, i) => i !== index);
  }, []);

  const addTile = useCallback((values, setFieldValue) => {
    if (values.tiles.length >= 6) {
      toast.error('Maximum 6 images allowed!');
      return;
    }
    const newTile = { image: { url: '', file: null }, name: '', description: '' };
    setFieldValue('tiles', [...values.tiles, newTile]);
    fileInputRefs.current[values.tiles.length] = React.createRef();
  }, []);

  return (
    <div className="p-4 sm:p-6 bg-[#FFF5EE] min-h-screen">
      <h2 className="text-xl sm:text-2xl font-bold text-black mb-4">
        Featured Image Configuration
      </h2>
      <Formik
        enableReinitialize
        initialValues={{ tiles: initialTiles }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const res = await saveTiles(values.tiles);
            if (res.status === 200) {
              toast.success('Featured image section saved successfully!');
              onDataChange?.({ tiles: values.tiles });
            } else {
              toast.error('Failed to save featured image section.');
            }
          } catch {
            toast.error('Something went wrong.');
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ values, setFieldValue, isSubmitting, errors, touched, isValid, dirty }) => {
          useEffect(() => {
            const isComplete = values.tiles.every(
              tile => tile.image?.url && tile.name?.trim() && tile.description?.trim()
            );
            if (isComplete && !dirty) {
              onDataChange?.({ tiles: values.tiles });
            }
          }, [values, dirty]);

          return (
            <Form>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {values.tiles.map((tile, index) => (
                  <div key={index} className="bg-white border rounded-lg p-4 relative shadow">
                    <button
                      type="button"
                      onClick={() => handleDeleteTile(index, values, setFieldValue)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      disabled={values.tiles.length <= 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {/* Image */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">Image {index + 1}</label>
                      <div
                        className={`border-2 border-dashed p-4 rounded-md text-center ${
                          tile.image?.url ? 'border-gray-300' : 'border-[#6F4E37]'
                        }`}
                        onClick={() => fileInputRefs.current[index]?.click()}
                        onDrop={e => handleDrop(index, e, setFieldValue)}
                        onDragOver={e => e.preventDefault()}
                      >
                        {tile.image?.url ? (
                          <div className="relative">
                            <img
                              src={tile.image.url}
                              className="h-32 w-full object-cover rounded-md"
                            />
                            <button
                              type="button"
                              onClick={e => {
                                e.stopPropagation();
                                handleImageRemove(index, setFieldValue, values);
                              }}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-6 h-6 text-[#6F4E37] mx-auto mb-1" />
                            <p className="text-sm text-gray-600">Click or drag to upload</p>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          ref={el => (fileInputRefs.current[index] = el)}
                          className="hidden"
                          onChange={e => handleFileInputChange(index, e, setFieldValue)}
                        />
                      </div>
                      {touched.tiles?.[index]?.image && errors.tiles?.[index]?.image?.url && (
                        <div className="text-red-500 text-sm mt-1">
                          {errors.tiles[index].image.url}
                        </div>
                      )}
                    </div>

                    {/* Name */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">Name {index + 1}</label>
                      <Field
                        name={`tiles[${index}].name`}
                        className="w-full border p-2 rounded text-sm"
                      />
                      {touched.tiles?.[index]?.name && errors.tiles?.[index]?.name && (
                        <div className="text-red-500 text-sm mt-1">{errors.tiles[index].name}</div>
                      )}
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Description {index + 1}
                      </label>
                      <Field
                        name={`tiles[${index}].description`}
                        as="textarea"
                        rows="3"
                        className="w-full border p-2 rounded text-sm"
                      />
                      {touched.tiles?.[index]?.description &&
                        errors.tiles?.[index]?.description && (
                          <div className="text-red-500 text-sm mt-1">
                            {errors.tiles[index].description}
                          </div>
                        )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Tile */}
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => addTile(values, setFieldValue)}
                  disabled={values.tiles.length >= 6}
                  className="flex items-center bg-[#6F4E37] text-white px-4 py-2 rounded hover:bg-[#5c3f2c]"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Image
                </button>
              </div>

              {/* Save Button */}
              <div className="text-right mt-6">
                <button
                  type="submit"
                  disabled={isSubmitting || !isValid || !dirty}
                  className="bg-[#6F4E37] text-white px-6 py-2 rounded hover:bg-[#5c3f2c]"
                >
                  {isSubmitting ? 'Saving...' : 'Save Step'}
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default FeaturedImage;