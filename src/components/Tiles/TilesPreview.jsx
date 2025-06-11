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

const TilesPreview = ({ images, setTileImageName, onDelete, setTileImageThickness, errors = {} }) => {
  const nameRefs = useRef([]);
  const thicknessRefs = useRef([]);

  const handleNameEdit = useCallback((index) => {
    const input = nameRefs.current[index];
    if (input) {
      input.focus();
    }
  }, []);

  const handleThicknessEdit = useCallback((index) => {
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

  const handleSubmit = (values) => {
    // Handle form submission if needed
  };

  return (
    <div className="p-6 mt-10">
      <h2 className="text-3xl font-bold text-center mb-4">Tiles Preview</h2>
      <div className="flex justify-center mb-4">
        <div className="w-10 h-1 bg-[#7b4f28] rounded" />
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ errors: formikErrors, touched }) => (
          <Form>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center">
              {images.map((tile, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-gray-300 shadow-md flex flex-col rounded-[10px] w-[348px] h-[420px] overflow-hidden mt-4"
                >
                  {/* Image Box */}
                  <div
                    className="flex items-center justify-center border border-gray-300 bg-white w-[348px] h-[220px] rounded-t-[10px] overflow-hidden"
                  >
                    <img
                      src={URL.createObjectURL(tile.file)}
                      alt="Tile"
                      className="w-[327px] h-[200px] rounded-[10px] border border-gray-200 object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-start px-2 pt-3 pb-0">
                    <div className="relative mb-2 flex items-center">
                      <Field
                        name={`tiles.${idx}.name`}
                      >
                        {({ field }) => (
                          <input
                            {...field}
                            ref={el => {
                              nameRefs.current[idx] = el;
                            }}
                            type="text"
                            placeholder="Tile name"
                            onChange={(e) => {
                              field.onChange(e);
                              setTileImageName(idx, e.target.value);
                            }}
                            className={`w-[327px] h-[35px] rounded-[6px] border ${
                              formikErrors.tiles?.[idx]?.name && touched.tiles?.[idx]?.name
                                ? 'border-red-500'
                                : 'border-gray-200'
                            } font-medium pl-3 pr-8 text-base focus:outline-none`}
                          />
                        )}
                      </Field>
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center cursor-pointer"
                        onClick={() => handleNameEdit(idx)}
                        aria-label="Edit tile name"
                      >
                        <PencilIcon width={20} height={20} />
                      </button>
                    </div>
                    {formikErrors.tiles?.[idx]?.name && touched.tiles?.[idx]?.name && (
                      <p className="text-red-500 text-xs mb-1 ml-1">{formikErrors.tiles[idx].name}</p>
                    )}
                    <div className="relative mb-2 flex items-center">
                      <Field
                        name={`tiles.${idx}.thickness`}
                      >
                        {({ field }) => (
                          <input
                            {...field}
                            ref={el => {
                              thicknessRefs.current[idx] = el;
                            }}
                            type="text"
                            placeholder="Thickness"
                            onChange={(e) => {
                              field.onChange(e);
                              setTileImageThickness(idx, e.target.value);
                            }}
                            className={`w-[327px] h-[35px] rounded-[6px] border ${
                              formikErrors.tiles?.[idx]?.thickness && touched.tiles?.[idx]?.thickness
                                ? 'border-red-500'
                                : 'border-gray-200'
                            } bg-gray-100 font-medium pl-3 pr-8 text-base focus:outline-none`}
                          />
                        )}
                      </Field>
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center cursor-pointer"
                        onClick={() => handleThicknessEdit(idx)}
                        aria-label="Edit thickness"
                      >
                        <PencilIcon width={20} height={20} />
                      </button>
                    </div>
                    {formikErrors.tiles?.[idx]?.thickness && touched.tiles?.[idx]?.thickness && (
                      <p className="text-red-500 text-xs mb-1 ml-1">{formikErrors.tiles[idx].thickness}</p>
                    )}
                    <div className="flex items-center gap-2 mb-2 mt-1">
                      <span className="w-[21px] h-[21px] rounded-[130px] bg-gray-300 border border-gray-200 inline-block" />
                      <span className="text-base font-semibold text-gray-800">Gainsboro</span>
                    </div>
                  </div>
                  <div
                    className="flex justify-between items-center bg-[#fceee3] px-4 w-[348px] h-[55px] rounded-b-[10px]"
                  >
                    <button
                      type="button"
                      className="flex items-center justify-center text-white bg-[#6F4E37] w-[30px] h-[30px] rounded-[5px] cursor-pointer"
                    >
                      <HeartIcon width={16} height={14} />
                    </button>
                    <button
                      type="button"
                      className="flex items-center gap-1 text-white text-base bg-[#7b4f28] hover:bg-[#633e1f] transition justify-center cursor-pointer font-semibold w-[114px] h-[36px] rounded-[5px]"
                      onClick={() => onDelete(idx)}
                    >
                      <Icon name="DeleteIcon" width={22} height={22} className="mr-1" style={{ stroke: 'white' }} />
                      Delete
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