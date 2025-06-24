import React, { useState, useCallback, useRef } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Upload, X, ChevronLeft, ChevronRight } from 'lucide-react';

const validationSchema = Yup.object({
  images: Yup.array()
    .of(Yup.string().required('Image is required'))
    .min(3, 'At least 3 images are required')
    .required('Images are required'),
});

// Draggable Thumbnail Component
const Thumbnail = ({ image, index, moveImage, handleRemove }) => {
  const ref = useRef(null);
  const [{ isDragging }, drag] = useDrag({
    type: 'THUMBNAIL',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const [, drop] = useDrop({
    accept: 'THUMBNAIL',
    hover(item) {
      if (item.index !== index) {
        moveImage(item.index, index);
        item.index = index;
      }
    },
  });
  drag(drop(ref));
  return (
    <div
      ref={ref}
      className={`relative w-16 h-16 rounded-md overflow-hidden border-2 ${
        isDragging ? 'opacity-50' : 'opacity-100'
      } ${index === 0 ? 'border-[#6F4E37]' : 'border-gray-300'}`}
    >
      <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
      <button
        type="button"
        onClick={() => handleRemove(index)}
        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
};

const SliderConfig = () => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animationDirection, setAnimationDirection] = useState(null);
  const fileInputRef = useRef();

  const saveImages = async (images) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ status: 200 }), 1000);
    });
  };

  const moveImage = useCallback((fromIndex, toIndex, setFieldValue, images) => {
    const updatedImages = [...images];
    const [movedImage] = updatedImages.splice(fromIndex, 1);
    updatedImages.splice(toIndex, 0, movedImage);
    setFieldValue('images', updatedImages);
    setCurrentSlide(toIndex);
    setAnimationDirection(fromIndex < toIndex ? 'right' : 'left');
  }, []);

  // Handle navigation with animation
  const handlePrevSlide = (imagesLength) => {
    setAnimationDirection('left');
    setCurrentSlide((prev) => (prev === 0 ? imagesLength - 1 : prev - 1));
  };

  const handleNextSlide = (imagesLength) => {
    setAnimationDirection('right');
    setCurrentSlide((prev) => (prev === imagesLength - 1 ? 0 : prev + 1));
  };

  return (
    <div className="p-6 bg-[#FFF5EE]">
      <h2 className="text-2xl font-bold text-black mb-4">Slider Images</h2>
      <Formik
        initialValues={{ images: [] }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const res = await saveImages(values.images);
            if (res.status === 200) {
              toast.success('Slider images saved successfully!');
            } else {
              toast.error('Failed to save images.');
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
            {/* Drag-and-Drop Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-6 mb-6 text-center ${
                isDraggingOver ? 'border-[#6F4E37] bg-[#6F4E37]/10' : 'border-gray-300'
              } transition-all duration-300`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingOver(true);
              }}
              onDragLeave={() => setIsDraggingOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDraggingOver(false);
                const files = Array.from(e.dataTransfer.files).filter((file) =>
                  file.type.startsWith('image/')
                );
                const newImages = files.map((file) => URL.createObjectURL(file));
                setFieldValue('images', [...values.images, ...newImages]);
              }}
              onClick={() => fileInputRef.current.click()}
            >
              <Upload className="w-8 h-8 text-[#6F4E37] mx-auto mb-2" />
              <p className="text-gray-600">
                Drag & drop images or click to select (Min. 3 images)
              </p>
              <input
                type="file"
                accept="image/*"
                multiple
                ref={fileInputRef}
                className="hidden"
                onChange={(e) => {
                  const files = Array.from(e.target.files);
                  const newImages = files.map((file) => URL.createObjectURL(file));
                  setFieldValue('images', [...values.images, ...newImages]);
                }}
              />
            </div>

            {/* Error Message */}
            {touched.images && errors.images && (
              <div className="text-red-500 text-sm mb-4">{errors.images}</div>
            )}

            {/* Slider Preview */}
            {values.images.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-black mb-4">Slider Preview</h3>
                <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-100">
                  <div
                    className={`w-full h-full ${
                      animationDirection === 'right'
                        ? 'animate-slide-right'
                        : animationDirection === 'left'
                        ? 'animate-slide-left'
                        : ''
                    }`}
                    key={currentSlide}
                  >
                    <img
                      src={values.images[currentSlide]}
                      alt={`Slide ${currentSlide + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {values.images.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => handlePrevSlide(values.images.length)}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-[#6F4E37]/50 text-white rounded-full p-2 hover:bg-[#6F4E37] transition"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleNextSlide(values.images.length)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#6F4E37]/50 text-white rounded-full p-2 hover:bg-[#6F4E37] transition"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}
                </div>
                <DndProvider backend={HTML5Backend}>
                  <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                    {values.images.map((image, index) => (
                      <Thumbnail
                        key={index}
                        image={image}
                        index={index}
                        moveImage={(from, to) =>
                          moveImage(from, to, setFieldValue, values.images)
                        }
                        handleRemove={(idx) => {
                          if (window.confirm('Remove this image?')) {
                            const updatedImages = values.images.filter(
                              (_, i) => i !== idx
                            );
                            URL.revokeObjectURL(values.images[idx]);
                            setFieldValue('images', updatedImages);
                            setCurrentSlide((prev) =>
                              prev >= updatedImages.length ? 0 : prev
                            );
                          }
                        }}
                      />
                    ))}
                  </div>
                </DndProvider>
              </div>
            )}

            {/* Submit Button */}
            <div className="text-right">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-[#6F4E37] text-white rounded-md hover:bg-[#5c3f2c] transition disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Save Slider'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SliderConfig;
