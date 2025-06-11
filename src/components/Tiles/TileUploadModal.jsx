import { X } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const MAX_IMAGES = 10;

const validationSchema = Yup.object().shape({
  thickness: Yup.number()
    .required('Thickness is required')
    .min(1, 'Thickness must be greater than 0')
    .typeError('Please enter a valid number'),
});

const TileUploadModal = ({ isOpen, onClose, onUploadComplete }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef();

  if (!isOpen) return null;

  const handleDropAreaClick = () => {
    if (selectedFiles.length < MAX_IMAGES) {
      fileInputRef.current.click();
    } else {
      alert(`You can upload only up to ${MAX_IMAGES} images.`);
    }
  };

  const handleUpload = (values) => {
    const filesWithThickness = selectedFiles.map(file => ({ file, thickness: values.thickness, name: '' }));
    onUploadComplete(filesWithThickness);
    setSelectedFiles([]);
    onClose();
  };

  const handleFileChange = e => {
    const files = Array.from(e.target.files);
    const newFiles = [...selectedFiles, ...files].slice(0, MAX_IMAGES); // limit to 10 total
    setSelectedFiles(newFiles);
    fileInputRef.current.value = '';
  };

  const handleRemoveImage = index => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
  };

  return (
    <div className="fixed inset-0 bg-[#05050580] z-50">
      <div className="absolute top-40 left-1/2 transform -translate-x-1/2 bg-[#fff5ee] opacity-100 rounded-lg shadow-2xl w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Upload Tiles Image</h2>
          <button
            onClick={onClose}
            className="p-2 px-0 py-0 absolute top-0 right-0"
            aria-label="Close popup"
          >
            <X size={20} className="bg-[#6F4E37] rounded-bl-sm text-white" />
          </button>
        </div>

        <Formik
          initialValues={{ thickness: '' }}
          validationSchema={validationSchema}
          onSubmit={handleUpload}
        >
          {({ errors, touched }) => (
            <Form>
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tile Thickness (mm)
                </label>
                <Field
                  type="number"
                  name="thickness"
                  min="0"
                  step="0.1"
                  placeholder="Enter Tile Thickness (mm)"
                  className={`w-full px-3 py-2 border ${errors.thickness && touched.thickness ? 'border-red-500' : 'border-gray-300'} bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#7b4f28]`}
                />
                {errors.thickness && touched.thickness && (
                  <p className="text-red-600 text-sm mt-1">{errors.thickness}</p>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Images</label>
                <div
                  className="w-full border-2 border-dashed border-gray-300 rounded-md py-6 px-4 text-center text-sm text-gray-500 bg-white transition"
                  onClick={handleDropAreaClick}
                >
                  {selectedFiles.length === 0 ? (
                    <>Drag & drop tile images here or click to browse files.</>
                  ) : (
                    <div className="flex flex-wrap gap-3">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="relative">
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              handleRemoveImage(index);
                            }}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full cursor-pointer p-1 hover:bg-red-600 z-10"
                            aria-label="Remove image"
                          >
                            <X size={14} />
                          </button>
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index}`}
                            className="mx-auto object-cover h-[70px] w-[70px] rounded border"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                </div>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  disabled={selectedFiles.length === 0}
                  className={`bg-[#7b4f28] hover:bg-[#633e1f] text-white font-semibold px-5 py-2 rounded-md ${
                    selectedFiles.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Upload & Process
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default TileUploadModal;
