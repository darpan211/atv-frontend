import React, { useRef, useCallback } from 'react';
import { FaHeart } from 'react-icons/fa';
import { Icon } from '../common/icons';
import img from '../../assets/img1.png';
import { PencilIcon } from '../common/icons/svgs/PencilIcon';
import { HeartIcon } from '../common/icons/svgs/HeartIcon';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  tiles: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required('Name is required'),
      thickness: Yup.number()
        .required('Thickness is required')
        .min(1, 'Thickness must be greater than 0')
        .typeError('Please enter a valid number'),
    })
  ),
});

const TilesPreview = ({
  images,
  setTileImageName,
  onDelete,
  setTileImageThickness,
  setTileImageFavorite,
  errors = {},
}) => {
  const nameRefs = useRef([]);
  const thicknessRefs = useRef([]);

  const handleNameEdit = useCallback(index => {
    const input = nameRefs.current[index];
    if (input) {
      input.focus();
    }
  }, []);

  const handleThicknessEdit = useCallback(index => {
    const input = thicknessRefs.current[index];
    if (input) {
      input.focus();
    }
  }, []);

  const initialValues = {
    tiles: images.map(tile => ({
      name: tile.name || '',
      thickness: tile.thickness || '',
    })),
  };

  const handleSubmit = values => {
    // Handle form submission if needed
  };

  return (
    <div className="p-4 sm:p-6 mt-6 sm:mt-10">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">Tiles Preview</h2>
      <div className="flex justify-center mb-10">
        <div className="h-[2px] w-[170px] bg-gray-300 relative">
          <div className="absolute -top-1 left-1/2 w-5 h-5 bg-[#6F4E37] -translate-1/4 "></div>
        </div>
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ errors: formikErrors, touched }) => (
          <Form>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 justify-items-center">
              {images.map((tile, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-gray-300 shadow-md flex flex-col rounded-[10px] w-full max-w-[348px] min-w-[280px] overflow-hidden mt-2 sm:mt-4"
                >
                  {/* Image Box */}
                  <div className="flex items-center justify-center border border-gray-300 bg-white w-full aspect-[348/220] rounded-t-[10px] overflow-hidden p-2">
                    <img
                      src={URL.createObjectURL(tile.file)}
                      alt="Tile"
                      className="w-full h-full rounded-[10px] border border-gray-200 object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-start p-3 sm:px-2 sm:pt-3 sm:pb-0">
                    <div className="relative mb-2 flex items-center">
                      <Field name={`tiles.${idx}.name`}>
                        {({ field }) => (
                          <input
                            {...field}
                            ref={el => {
                              nameRefs.current[idx] = el;
                            }}
                            type="text"
                            placeholder="Tile name"
                            onChange={e => {
                              field.onChange(e);
                              setTileImageName(idx, e.target.value);
                            }}
                            className={`w-full h-[35px] rounded-[6px] border ${
                              formikErrors.tiles?.[idx]?.name && touched.tiles?.[idx]?.name
                                ? 'border-red-500'
                                : 'border-gray-200'
                            } font-medium pl-3 pr-10 text-sm sm:text-base focus:outline-none`}
                          />
                        )}
                      </Field>
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center cursor-pointer p-1"
                        onClick={() => handleNameEdit(idx)}
                        aria-label="Edit tile name"
                      >
                        <PencilIcon width={20} height={20} />
                      </button>
                    </div>
                    {formikErrors.tiles?.[idx]?.name && touched.tiles?.[idx]?.name && (
                      <p className="text-red-500 text-xs mb-1 ml-1">
                        {formikErrors.tiles[idx].name}
                      </p>
                    )}
                    <div className="relative mb-2 flex items-center">
                      <Field name={`tiles.${idx}.thickness`}>
                        {({ field }) => (
                          <input
                            {...field}
                            ref={el => {
                              thicknessRefs.current[idx] = el;
                            }}
                            type="text"
                            placeholder="Thickness"
                            onChange={e => {
                              field.onChange(e);
                              setTileImageThickness(idx, e.target.value);
                            }}
                            className={`w-full h-[35px] rounded-[6px] border ${
                              formikErrors.tiles?.[idx]?.thickness &&
                              touched.tiles?.[idx]?.thickness
                                ? 'border-red-500'
                                : 'border-gray-200'
                            } bg-gray-100 font-medium pl-3 pr-10 text-sm sm:text-base focus:outline-none`}
                          />
                        )}
                      </Field>
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center cursor-pointer p-1"
                        onClick={() => handleThicknessEdit(idx)}
                        aria-label="Edit thickness"
                      >
                        <PencilIcon width={20} height={20} />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mb-2 mt-1">
                      <span 
                        className="w-[21px] h-[21px] rounded-[130px] border border-gray-200 inline-block flex-shrink-0" 
                        style={{ backgroundColor: tile.color || '#DCDCDC' }}
                      />
                      <span className="text-sm sm:text-base font-semibold text-gray-800">
                        {tile.colorName || 'Gainsboro'}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center bg-[#fceee3] px-3 sm:px-4 w-full h-[55px] rounded-b-[10px]">
                    {/* Heart icon commented out */}
                    <div className="flex-1" />
                    <button
                      type="button"
                      className="flex items-center gap-1 text-white text-sm sm:text-base bg-[#7b4f28] hover:bg-[#633e1f] transition justify-center cursor-pointer font-semibold px-3 py-2 sm:w-[114px] h-[36px] rounded-[5px] min-w-0 ml-auto"
                      onClick={() => onDelete(idx)}
                    >
                      <Icon
                        name="DeleteIcon"
                        width={18}
                        height={18}
                        colour="white"
                        className="sm:mr-1 text-white flex-shrink-0"
                      />
                      <span className="hidden xs:inline sm:inline">Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default TilesPreview;
