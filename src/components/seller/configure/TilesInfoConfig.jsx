import React, { useState, useRef, useEffect } from 'react';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { Upload, X, Plus, Trash } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboards } from '@/redux/slice/dashboard/dashboardThunk';

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required').max(100, 'Title must be 100 characters or less'),
  description: Yup.string().required('Description is required').max(1000, 'Description must be 1000 characters or less'),
  features: Yup.array()
    .of(Yup.string().max(50, 'Feature must be 50 characters or less'))
    .min(1, 'At least one feature is required'),
  tiles: Yup.array()
    .of(
      Yup.object({
        url: Yup.string().required('Image preview is required'),
        file: Yup.mixed()
          .required('Image file is required')
          .test('fileType', 'Only image files are allowed', (value) => value && value.type && value.type.startsWith('image/')),
      })
    )
    .min(1, 'At least one tile image is required'),
});

const TilesInfoConfig = ({ onDataChange }) => {
  const [tileImages, setTileImages] = useState([{ url: '', file: null }]);
  const fileInputRefs = useRef([]);
  const dispatch = useDispatch();
  const { dashboardData } = useSelector((state) => state.dashboard);

  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    dispatch(fetchDashboards());
  }, [dispatch]);

  useEffect(() => {
  const info = dashboardData?.[0]?.tiles_info;

  const formattedTiles =
    info?.tiles?.length > 0
      ? info.tiles.map((img) => ({
          url: img,
          file: null,
        }))
      : [{ url: '', file: null }];

  const formatted = {
    title: info?.title || '',
    description: info?.description || '',
    features: info?.features?.length ? info.features : [''],
    tiles: formattedTiles,
  };

  setInitialValues(formatted);
  setTileImages(formattedTiles);

  // Auto pass data up if no edit
  onDataChange?.(formatted);
}, [dashboardData]);

  useEffect(() => {
    fileInputRefs.current = tileImages.map((_, i) => fileInputRefs.current[i] || React.createRef());
  }, [tileImages]);

  const saveTilesInfo = async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ status: 200 }), 1000);
    });
  };

  const handleImageUpload = (index, file, setFieldValue) => {
    if (file && file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      setTileImages((prev) => {
        const newImages = [...prev];
        newImages[index] = { url: imageUrl, file };
        return newImages;
      });
      setFieldValue(`tiles[${index}]`, { url: imageUrl, file });
    } else {
      toast.error('Please select a valid image file!');
    }
  };

  const handleFileInputChange = (index, e, setFieldValue) => {
    const file = e.target.files?.[0];
    handleImageUpload(index, file, setFieldValue);
    e.target.value = null;
  };

  const handleDrop = (index, e, setFieldValue) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    handleImageUpload(index, file, setFieldValue);
  };

  const handleImageRemove = (index, setFieldValue, remove) => {
    if (window.confirm('Remove this image?')) {
      setTileImages((prev) => {
        const newImages = [...prev];
        if (newImages[index]?.url) URL.revokeObjectURL(newImages[index].url);
        newImages[index] = { url: '', file: null };
        return newImages;
      });
      setFieldValue(`tiles[${index}]`, { url: '', file: null });
      remove(index);
    }
  };

  useEffect(() => {
    return () => {
      tileImages.forEach((img) => img?.url && URL.revokeObjectURL(img.url));
    };
  }, [tileImages]);

  if (!initialValues) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 sm:p-6 bg-[#FFF5EE] min-h-screen">
      <h2 className="text-xl font-bold mb-4">Tiles Information Configuration</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const res = await saveTilesInfo(values);
            if (res.status === 200) {
              toast.success('Product features saved successfully!');
              onDataChange?.(values);
            } else {
              toast.error('Failed to save.');
            }
          } catch {
            toast.error('Something went wrong.');
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ values, setFieldValue, isSubmitting, errors, touched, isValid, dirty }) => (
          <Form>
            {/* TITLE & DESCRIPTION */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border shadow">
                <label className="block text-sm font-medium">Title</label>
                <Field name="title" className="w-full p-2 border rounded mt-1" />
                {touched.title && errors.title && (
                  <div className="text-red-500 text-sm mt-1">{errors.title}</div>
                )}

                <label className="block text-sm font-medium mt-4">Description</label>
                <Field
                  name="description"
                  as="textarea"
                  className="w-full p-2 border rounded mt-1"
                  rows="4"
                />
                {touched.description && errors.description && (
                  <div className="text-red-500 text-sm mt-1">{errors.description}</div>
                )}

                <FieldArray name="features">
                  {({ push, remove }) => (
                    <>
                      <label className="block text-sm font-medium mt-4">Features</label>
                      {values.features.map((_, index) => (
                        <div key={index} className="flex items-center mt-2">
                          <Field
                            name={`features[${index}]`}
                            className="flex-1 p-2 border rounded"
                          />
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            disabled={values.features.length <= 1}
                            className="ml-2 text-sm text-red-600"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => push('')}
                        className="mt-2 px-3 py-1 bg-[#6F4E37] text-white rounded text-sm"
                      >
                        <Plus className="inline w-4 h-4 mr-1" />
                        Add Feature
                      </button>
                      {errors.features && touched.features && (
                        <div className="text-red-500 text-sm mt-1">{errors.features}</div>
                      )}
                    </>
                  )}
                </FieldArray>
              </div>

              {/* IMAGE TILES */}
              <div className="bg-white p-4 rounded-lg border shadow">
                <label className="block text-sm font-medium mb-2">Tile Images</label>
                <FieldArray name="tiles">
                  {({ push, remove }) => (
                    <>
                      {values.tiles.map((tile, index) => (
                        <div key={index} className="mb-4">
                          <div
                            className={`border-2 border-dashed rounded-lg p-4 text-center ${
                              tile.url ? 'border-gray-300' : 'border-[#6F4E37]'
                            }`}
                            onClick={() => fileInputRefs.current[index]?.click()}
                            onDrop={(e) => handleDrop(index, e, setFieldValue)}
                            onDragOver={(e) => e.preventDefault()}
                          >
                            {tile.url ? (
                              <div className="relative">
                                <img
                                  src={tile.url}
                                  alt=""
                                  className="w-full h-32 object-cover rounded"
                                />
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleImageRemove(index, setFieldValue, remove);
                                  }}
                                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <>
                                <Upload className="w-8 h-8 mx-auto text-[#6F4E37]" />
                                <p className="text-sm text-gray-600 mt-2">Click or drag to upload</p>
                              </>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              ref={(el) => (fileInputRefs.current[index] = el)}
                              className="hidden"
                              onChange={(e) => handleFileInputChange(index, e, setFieldValue)}
                            />
                          </div>
                          {touched.tiles?.[index] && errors.tiles?.[index] && (
                            <div className="text-red-500 text-sm mt-1">
                              {errors.tiles[index]?.url || errors.tiles[index]}
                            </div>
                          )}
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => {
                          push({ url: '', file: null });
                          setTileImages((prev) => [...prev, { url: '', file: null }]);
                        }}
                        className="px-4 py-1 bg-[#6F4E37] text-white rounded text-sm"
                      >
                        <Plus className="inline w-4 h-4 mr-1" />
                        Add Tile Image
                      </button>
                    </>
                  )}
                </FieldArray>
              </div>
            </div>

            {/* SUBMIT */}
            <div className="text-right mt-6">
              <button
                type="submit"
                disabled={isSubmitting || !dirty || !isValid}
                className="px-6 py-2 bg-[#6F4E37] text-white rounded hover:bg-[#5c3f2c] disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Save Step'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default TilesInfoConfig;