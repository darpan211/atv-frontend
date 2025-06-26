import React, { useState, useRef, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { Upload, X, Plus, Trash2 } from 'lucide-react';

// Yup validation schema
const validationSchema = Yup.object().shape({
  tiles: Yup.array()
    .of(
      Yup.object().shape({
        image: Yup.string().required('Image is required'),
        name: Yup.string().max(50, 'Name must be 50 characters or less'),
        description: Yup.string().max(150, 'Description must be 150 characters or less'),
      })
    )
    .min(1, 'At least 1 tile is required')
    .max(6, 'Maximum 6 tiles allowed'),
});

// FeaturedImage Component
const FeaturedImage = () => {
  const [tileImages, setTileImages] = useState(['']);
  const fileInputRefs = useRef([]);

  // Initialize refs for tiles
  useEffect(() => {
    fileInputRefs.current = tileImages.map((_, i) => fileInputRefs.current[i] || React.createRef());
  }, [tileImages]);

  // Mock API call to save tiles
  const saveTiles = async (tiles) => {
    console.log('Feature Images', tiles);
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
      setFieldValue(`tiles[${index}].image`, imageUrl);
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
  const handleImageRemove = (index, setFieldValue) => {
    if (window.confirm('Remove this image?')) {
      setTileImages((prev) => {
        const newImages = [...prev];
        newImages[index] = '';
        return newImages;
      });
      setFieldValue(`tiles[${index}].image`, '');
      URL.revokeObjectURL(tileImages[index]);
    }
  };

  // Handle tile deletion
  const handleDeleteTile = (index, values, setFieldValue) => {
    if (values.tiles.length <= 1) {
      toast.error('At least one tile is required!');
      return;
    }
    if (window.confirm('Delete this tile?')) {
      setTileImages((prev) => prev.filter((_, i) => i !== index));
      setFieldValue('tiles', values.tiles.filter((_, i) => i !== index));
      URL.revokeObjectURL(tileImages[index]);
      fileInputRefs.current = fileInputRefs.current.filter((_, i) => i !== index);
    }
  };

  // Add new tile
  const addTile = (values, setFieldValue) => {
    if (values.tiles.length < 6) {
      setTileImages((prev) => [...prev, '']);
      setFieldValue('tiles', [...values.tiles, { image: '', name: '', description: '' }]);
    } else {
      toast.error('Maximum 6 images allowed!');
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
      <h2 className="text-xl sm:text-2xl font-bold text-black mb-4">Featured Image Configuration</h2>
      <Formik
        initialValues={{
          tiles: [{ image: '', name: '', description: '' }],
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const res = await saveTiles(values.tiles);
            if (res.status === 200) {
              toast.success('Featured image section saved successfully!');
            } else {
              toast.error('Failed to save featured image section.');
            }
          } catch (err) {
            toast.error('Something went wrong. Please try again.');
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ values, setFieldValue, isSubmitting, errors, touched }) => (
          <Form>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {values.tiles.map((tile, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 shadow-md rounded-lg p-4 animate-fade-in w-full max-w-sm mx-auto sm:max-w-none relative"
                >
                  {/* Delete Tile Button */}
                  <button
                    type="button"
                    onClick={() => handleDeleteTile(index, values, setFieldValue)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition disabled:opacity-50"
                    disabled={values.tiles.length <= 1}
                    title="Delete Tile"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Image Upload */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image {index + 1}
                    </label>
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
                            alt={`Image ${index + 1}`}
                            className="w-full h-32 object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleImageRemove(index, setFieldValue);
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
                    {touched.tiles?.[index]?.image && errors.tiles?.[index]?.image && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.tiles[index].image}
                      </div>
                    )}
                  </div>

                  {/* Tile Name */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name {index + 1}
                    </label>
                    <Field
                      name={`tiles[${index}].name`}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#6F4E37] text-sm"
                    />
                    {touched.tiles?.[index]?.name && errors.tiles?.[index]?.name && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.tiles[index].name}
                      </div>
                    )}
                  </div>

                  {/* Tile Description */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description {index + 1}
                    </label>
                    <Field
                      name={`tiles[${index}].description`}
                      as="textarea"
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#6F4E37] text-sm"
                      rows="3"
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

            {/* Add Tile Button */}
            <div className="mt-4">
              <button
                type="button"
                onClick={() => addTile(values, setFieldValue)}
                disabled={values.tiles.length >= 6}
                className="flex items-center px-4 py-2 bg-[#6F4E37] text-white rounded-md hover:bg-[#5c3f2c] transition disabled:opacity-50"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Image
              </button>
            </div>

            {/* Error for overall tiles array */}
            {errors.tiles && typeof errors.tiles === 'string' && (
              <div className="text-red-500 text-sm mt-2">{errors.tiles}</div>
            )}

            {/* Submit Button */}
            <div className="text-right mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-[#6F4E37] text-white rounded-md hover:bg-[#5c3f2c] transition disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Save Featured Images'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default FeaturedImage;