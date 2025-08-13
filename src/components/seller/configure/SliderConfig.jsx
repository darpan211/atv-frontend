import { useState, useCallback, useEffect, useRef } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Upload, X, ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboards } from '@/redux/slice/dashboard/dashboardThunk';

const validationSchema = Yup.object({
  images: Yup.array()
    .of(
      Yup.object({
        url: Yup.string().required('Image preview is required'),
        file: Yup.mixed().nullable().notRequired(),
      })
    )
    .min(3, 'At least 3 images are required')
    .max(10, 'A maximum of 10 images is allowed')
    .required('Images are required'),
});

const Thumbnail = ({ image, index, moveImage, handleRemove }) => {
  const ref = useRef(null);
  const [{ isDragging }, drag] = useDrag({
    type: 'THUMBNAIL',
    item: { index },
    collect: monitor => ({
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
      <img
        src={image.url || '/placeholder.svg'}
        alt={`Thumbnail ${index + 1}`}
        className="w-full h-full object-cover"
      />
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

const SliderConfig = ({ onDataChange }) => {
  const dispatch = useDispatch();
  const { dashboardData, loading, error } = useSelector(state => state.dashboard);

  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animationDirection, setAnimationDirection] = useState(null);
  const fileInputRef = useRef();
  const initialImages = useRef([]);
  const hasCalledDataChange = useRef(false);

  useEffect(() => {
    dispatch(fetchDashboards());
  }, [dispatch]);

  useEffect(() => {
    if (Array.isArray(dashboardData) && dashboardData[0]?.slider_images) {
      initialImages.current = dashboardData[0].slider_images.map(url => ({ url, file: null }));
    }
  }, [dashboardData]);

  const moveImage = useCallback((fromIndex, toIndex, setFieldValue, images) => {
    const updatedImages = [...images];
    const [movedImage] = updatedImages.splice(fromIndex, 1);
    updatedImages.splice(toIndex, 0, movedImage);
    setFieldValue('images', updatedImages);
    setCurrentSlide(toIndex);
    setAnimationDirection(fromIndex < toIndex ? 'right' : 'left');
  }, []);

  const handlePrevSlide = length => {
    setAnimationDirection('left');
    setCurrentSlide(prev => (prev === 0 ? length - 1 : prev - 1));
  };

  const handleNextSlide = length => {
    setAnimationDirection('right');
    setCurrentSlide(prev => (prev === length - 1 ? 0 : prev + 1));
  };
  const saveImages = async images => {
    return new Promise(resolve => {
      setTimeout(() => resolve({ status: 200 }), 1000);
    });
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 bg-[#FFF5EE]">
      <Formik
        enableReinitialize
        initialValues={{
          images: initialImages.current || [],
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const res = await saveImages(values.images);
            if (res.status === 200) {
              toast.success('Slider images saved successfully!');
              onDataChange?.(values);
            } else {
              toast.error('Failed to save images.');
            }
          } catch {
            toast.error('Something went wrong.');
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ values, setFieldValue, isSubmitting, errors, touched, isValid }) => {
          useEffect(() => {
            const hasMinImages = values.images.length >= 3;
            const allFromBackend = values.images.every(img => img.file === null);
            const isSameAsInitial =
              values.images.length === initialImages.current.length &&
              values.images.every((img, index) => img.url === initialImages.current[index]?.url);

            if (hasMinImages && allFromBackend && isSameAsInitial && !hasCalledDataChange.current) {
              hasCalledDataChange.current = true;
              onDataChange?.(values);
            }
          }, [values.images]);

          return (
            <Form>
              {/* Upload UI */}
              <div
                className={`border-2 border-dashed rounded-lg p-6 mb-6 text-center ${
                  isDraggingOver ? 'border-[#6F4E37] bg-[#6F4E37]/10' : 'border-[#6F4E37] bg-white'
                } transition-all duration-300`}
                onDragOver={e => {
                  e.preventDefault();
                  setIsDraggingOver(true);
                }}
                onDragLeave={() => setIsDraggingOver(false)}
                onDrop={e => {
                  e.preventDefault();
                  setIsDraggingOver(false);
                  const files = Array.from(e.dataTransfer.files).filter(file =>
                    file.type.startsWith('image/')
                  );
                  const newImages = files.map(file => ({
                    url: URL.createObjectURL(file),
                    file,
                  }));
                  setFieldValue('images', [...values.images, ...newImages]);
                }}
                onClick={() => fileInputRef.current.click()}
              >
                <Upload className="w-8 h-8 text-[#6F4E37] mx-auto mb-2" />
                <p className="text-gray-600">Drag & drop or click to upload (Min. 3 images)</p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  ref={fileInputRef}
                  className="hidden"
                  onChange={e => {
                    const files = Array.from(e.target.files);
                    const newImages = files.map(file => ({
                      url: URL.createObjectURL(file),
                      file,
                    }));
                    setFieldValue('images', [...values.images, ...newImages]);
                  }}
                />
              </div>

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
                        src={values.images[currentSlide]?.url || '/placeholder.svg'}
                        alt={`Slide ${currentSlide + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {values.images.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() => handlePrevSlide(values.images.length)}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-[#6F4E37]/50 text-white rounded-full p-2 hover:bg-[#6F4E37] transition z-10"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleNextSlide(values.images.length)}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#6F4E37]/50 text-white rounded-full p-2 hover:bg-[#6F4E37] transition z-10"
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
                          handleRemove={idx => {
                            if (window.confirm('Remove this image?')) {
                              const updatedImages = [...values.images.filter((_, i) => i !== idx)];
                              const removedImage = values.images[idx];
                              if (removedImage?.file && removedImage?.url?.startsWith('blob:')) {
                                URL.revokeObjectURL(removedImage.url);
                              }
                              setFieldValue('images', updatedImages);
                              setCurrentSlide(prev =>
                                prev >= updatedImages.length ? updatedImages.length - 1 : prev
                              );
                            }
                          }}
                        />
                      ))}
                    </div>
                  </DndProvider>
                </div>
              )}

              {/* Save Button */}
              <div className="text-right">
                <button
                  type="submit"
                  disabled={isSubmitting || !isValid}
                  className="flex items-center px-6 py-2 bg-[#6F4E37] text-white rounded-md hover:bg-[#5c3f2c] transition disabled:opacity-50"
                >
                  <Save className="w-4 h-4 mr-2" />
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

export default SliderConfig;