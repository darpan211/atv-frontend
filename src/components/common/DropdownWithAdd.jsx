import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Icon } from './icons';
import { MultiSelectDropdown } from './MultiSelectDropdown';
import CommonAddForm from './CommonAddForm';

// Redux thunks
import { addSize, fetchSizes } from '@/redux/slice/sizes/sizeThunks';
import { addSeries, fetchSeries } from '@/redux/slice/series/seriesThunks';
import { addMaterial, fetchMaterials } from '@/redux/slice/material/materialThunks';
import { addFinish, fetchFinishes } from '@/redux/slice/finish/finishThunks';
import { addColor, fetchColors } from '@/redux/slice/colors/colorThunks';
import { addCategory, fetchCategories } from '@/redux/slice/categories/categoryThunks';
import {
  addSuitablePlace,
  fetchSuitablePlaces,
} from '@/redux/slice/suitablePlace/suitablePlaceThunks';

const labelToKey = {
  Size: 'size',
  Series: 'series',
  Material: 'material',
  Finish: 'finish',
  'Suitable Place': 'suitablePlace',
  Category: 'category',
  Color: 'color',
};

const DropdownWithAdd = ({ label, options, selectedValues, onChange, error }) => {
  const dispatch = useDispatch();
  const [openPopup, setOpenPopup] = useState(null);

  const handleAddClick = () => {
    const key = labelToKey[label];
    if (key) setOpenPopup(key);
  };

  const handlePopupSubmit = async () => {
    // Refresh the list after addition
    switch (openPopup) {
      case 'size':
        dispatch(fetchSizes());
        break;
      case 'series':
        dispatch(fetchSeries());
        break;
      case 'material':
        dispatch(fetchMaterials());
        break;
      case 'finish':
        dispatch(fetchFinishes());
        break;
      case 'suitablePlace':
        dispatch(fetchSuitablePlaces());
        break;
      case 'category':
        dispatch(fetchCategories());
        break;
      case 'color':
        dispatch(fetchColors());
        break;
      default:
        break;
    }
    setOpenPopup(null);
  };

  const renderInlinePopup = () => {
    if (!openPopup) return null;

    const configMap = {
      size: {
        label: 'Size',
        formType: 'sizes',
        initialValues: { height: '', width: '' },
        addThunk: addSize,
      },
      series: {
        label: 'Series Name',
        formType: 'series',
        initialValues: { name: '' },
        addThunk: addSeries,
      },
      material: {
        label: 'Material Name',
        formType: 'material',
        initialValues: { name: '' },
        addThunk: addMaterial,
      },
      finish: {
        label: 'Finish Name',
        formType: 'finish',
        initialValues: { name: '' },
        addThunk: addFinish,
      },
      suitablePlace: {
        label: 'Suitable Place Name',
        formType: 'suitablePlace',
        initialValues: { name: '' },
        addThunk: addSuitablePlace,
      },
    };

    const config = configMap[openPopup];

    const handleSubmit = async values => {
      const payload =
        config.formType === 'sizes'
          ? {
              height: values.height,
              width: values.width,
              sizes: `${values.height} X ${values.width}`,
            }
          : { [config.formType]: values.name };

      try {
        await dispatch(config.addThunk(payload)).unwrap();
        handlePopupSubmit();
      } catch (err) {
        console.error(`Error adding ${openPopup}:`, err);
      }
    };

    return (
      <div className="fixed inset-0 z-50 bg-opacity-40 backdrop-brightness-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 shadow-lg w-[80%] md:w-1/2 relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold capitalize">Add {openPopup}</h2>
            <button
              onClick={() => setOpenPopup(null)}
              className="absolute cursor-pointer top-0 right-0 bg-[#6F4E37] text-white rounded-bl-lg rounded-tr-lg w-8 h-8 flex items-center justify-center hover:bg-[#4a3224]"
            >
              <Icon name="Close" width="12px" height="12px" />
            </button>
          </div>
          <CommonAddForm
            popup
            formType={config.formType}
            label={config.label}
            initialValues={config.initialValues}
            buttonText={`Add ${openPopup}`}
            onSubmit={handleSubmit}
            onCancel={() => setOpenPopup(null)}
            noFormTag={true}
          />
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (openPopup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [openPopup]);

  return (
    <div className="w-full">
      <label className="text-sm font-semibold block text-gray-800 mb-1">{label}</label>
      <div className="flex gap-1 items-center">
        <div className="flex-1">
          <MultiSelectDropdown
            label={label}
            options={options || []}
            selectedValues={selectedValues || []}
            onChange={onChange}
            heightClass="h-10 w-full rounded-md"
          />
          {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
        </div>
        <button
          type="button"
          onClick={handleAddClick}
          className="h-10 w-10 rounded-lg bg-[#7b4f28] text-white flex items-center justify-center hover:bg-[#633e1f] border border-gray-300 cursor-pointer"
        >
          <Icon name="Plus" width={20} height={20} />
        </button>
      </div>

      {renderInlinePopup()}
    </div>
  );
};

export default DropdownWithAdd;
