import React, { useState, useRef, useEffect } from 'react';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { Upload, X, Plus, Trash } from 'lucide-react';

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required').max(100, 'Title must be 100 characters or less'),
  description: Yup.string().required('Description is required').max(1000, 'Description must be 1000 characters or less'),
  features: Yup.array()
    .of(Yup.string().max(50, 'Feature must be 50 characters or less'))
    .min(1, 'At least one feature is required'),
  tiles: Yup.array()
    .of(Yup.string().required('Image is required'))
    .min(1, 'At least one tile image is required'),
});

const TilesInfoConfig = () => {
  const [tileImages, setTileImages] = useState(['']);
  const fileInputRefs = useRef([]);

  // Initialize refs for the initial tile
  useEffect(() => {
    fileInputRefs.current = tileImages.map((_, i) => fileInputRefs.current[i] || React.createRef());
  }, [tileImages]);

  // Mock API call to save product features
  const saveTilesInfo = async (data) => {
    console.log('TilesInfo ', data);
    return new Promise((resolve) => {
      setTimeout(() => resolve({ status: 200 }), 1000);
    });
  };

  // Handle image upload for a specific tile
  const handleImageUpload = (index, file, setFieldValue) => {
    if (file && file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      setTileImages((prev) => {
        const newImages = [...prev];
        newImages[index] = imageUrl;
        return newImages;
      });
      setFieldValue(`tiles[${index}]`, imageUrl);
    } else {
      toast.error('Please select a valid image file (e.g., JPG, PNG)!');
    }
  };

  // Handle file input change
  const handleFileInputChange = (index, e, setFieldValue) => {
    const file = e.target.files?.[0];
    handleImageUpload(index, file, setFieldValue);
    e.target.value = null;
  };

  // Handle drag and drop
  const handleDrop = (index, e, setFieldValue) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    handleImageUpload(index, file, setFieldValue);
  };

  // Handle drag over
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Handle image removal
  const handleImageRemove = (index, setFieldValue, remove) => {
    if (window.confirm('Remove this image?')) {
      setTileImages((prev) => {
        const newImages = [...prev];
        newImages[index] = '';
        return newImages;
      });
      setFieldValue(`tiles[${index}]`, '');
      URL.revokeObjectURL(tileImages[index]);
      remove(index);
    }
  };

  // Cleanup URLs on unmount
  useEffect(() => {
    return () => {
      tileImages.forEach((url) => url && URL.revokeObjectURL(url));
    };
  }, [tileImages]);

  return (
    <div className="p-4 sm:p-6 bg-[#FFF5EE] bg-grid-white-[0.2] min-h-screen">
      <h2 className="text-xl sm:text-2xl font-bold text-black mb-4">Product Features Configuration</h2>
      <Formik
        initialValues={{
          title: '',
          description: '',
          features: [''],
          tiles: [''],
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const res = await saveTilesInfo(values);
            if (res.status === 200) {
              toast.success('Product features saved successfully!');
            } else {
              toast.error('Failed to save product features.');
            }
          } catch {
            toast.error('Something went wrong. Please try again.');
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ values, setFieldValue, isSubmitting, errors, touched }) => (
          <Form>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Left Side - Text Content */}
              <div className="bg-white border border-gray-200 shadow-md rounded-lg p-4 sm:p-6">
                {/* Title */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <Field
                    name="title"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#6F4E37] text-sm"
                  />
                  {touched.title && errors.title && (
                    <div className="text-red-500 text-sm mt-1">{errors.title}</div>
                  )}
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <Field
                    name="description"
                    as="textarea"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#6F4E37] text-sm min-h-[150px]"
                    rows="6"
                  />
                  {touched.description && errors.description && (
                    <div className="text-red-500 text-sm mt-1">{errors.description}</div>
                  )}
                </div>

                {/* Features */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Features</label>
                  <FieldArray name="features">
                    {({ push, remove }) => (
                      <div>
                        {values.features.map((feature, index) => (
                          <div key={index} className="flex items-center mb-2">
                            <Field
                              name={`features[${index}]`}
                              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#6F4E37] text-sm"
                            />
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              disabled={values.features.length <= 1}
                              className="ml-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition disabled:opacity-50"
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        {touched.features && errors.features && (
                          <div className="text-red-500 text-sm mt-1">{errors.features}</div>
                        )}
                        <button
                          type="button"
                          onClick={() => push('')}
                          className="mt-2 px-4 py-1 bg-[#6F4E37] text-white rounded-md hover:bg-[#5c3f2c] transition text-sm"
                        >
                          <Plus className="w-4 h-4 inline mr-1" /> Add Feature
                        </button>
                      </div>
                    )}
                  </FieldArray>
                </div>
              </div>

              {/* Right Side - Tiles */}
              <div className="bg-white border border-gray-200 shadow-md rounded-lg p-4 sm:p-6">
                <label className="block text-sm font-medium text-gray-700 mb-4">Tile Images</label>
                <FieldArray name="tiles">
                  {({ push, remove }) => (
                    <div>
                      {values.tiles.map((tile, index) => (
                        <div key={index} className="mb-4 last:mb-0">
                          <div
                            className={`border-2 border-dashed rounded-lg p-4 text-center ${
                              tileImages[index]
                                ? 'border-gray-300'
                                : 'border-[#6F4E37] hover:border-[#5c3f2c]'
                            } transition-all duration-300 cursor-pointer`}
                            onClick={() => fileInputRefs.current[index]?.current?.click()}
                            onDrop={(e) => handleDrop(index, e, setFieldValue)}
                            onDragOver={handleDragOver}
                          >
                            {tileImages[index] ? (
                              <div className="relative">
                                <img
                                  src={tileImages[index]}
                                  alt={`Tile ${index + 1}`}
                                  className="w-full h-32 sm:h-40 object-cover rounded-md"
                                />
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleImageRemove(index, setFieldValue, remove);
                                  }}
                                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <>
                                <Upload className="w-8 h-8 text-[#6F4E37] mx-auto mb-2" />
                                <p className="text-gray-600 text-sm">Click or drag to upload image</p>
                              </>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              ref={fileInputRefs.current[index]}
                              className="hidden"
                              onChange={(e) => handleFileInputChange(index, e, setFieldValue)}
                            />
                          </div>
                          {touched.tiles?.[index] && errors.tiles?.[index] && (
                            <div className="text-red-500 text-sm mt-1">{errors.tiles[index]}</div>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          push('');
                          setTileImages((prev) => [...prev, '']);
                        }}
                        className="mt-2 px-4 py-1 bg-[#6F4E37] text-white rounded-md hover:bg-[#5c3f2c] transition text-sm"
                      >
                        <Plus className="w-4 h-4 inline mr-1" /> Add Tile Image
                      </button>
                    </div>
                  )}
                </FieldArray>
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-right mt-4 sm:mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 sm:px-6 py-2 bg-[#6F4E37] text-white rounded-md hover:bg-[#5c3f2c] transition disabled:opacity-50 text-sm sm:text-base"
              >
                {isSubmitting ? 'Saving...' : 'Save Product Features'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default TilesInfoConfig;