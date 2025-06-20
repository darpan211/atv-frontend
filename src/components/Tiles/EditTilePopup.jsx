import { memo, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { MultiSelectDropdown } from '../common/MultiSelectDropdown';

const EditTilePopup = memo(
  ({
    tile,
    isOpen,
    onClose,
    formData,
    onChange,
    onSave,
    onDelete,
    materialOptions,
    sizeOptions,
    finishOptions,
    seriesOptions,
  }) => {
    const [sortedSeriesOptions, setSortedSeriesOptions] = useState([]);
    const [sortedSizeOptions, setSortedSizeOptions] = useState([]);
    const [sortedMaterialOptions, setSortedMaterialOptions] = useState([]);
    const [sortedFinishOptions, setSortedFinishOptions] = useState([]);

    const sortOptionsOnce = (options = [], selectedValues = []) => {
      const selectedValueSet = new Set(selectedValues.map(opt => opt.value?.toLowerCase().trim()));
      return [
        ...options.filter(opt => selectedValueSet.has(opt.value?.toLowerCase().trim())),
        ...options.filter(opt => !selectedValueSet.has(opt.value?.toLowerCase().trim())),
      ];
    };

    useEffect(() => {
      if (isOpen) {
        setSortedSeriesOptions(sortOptionsOnce(seriesOptions, formData.series));
        setSortedSizeOptions(sortOptionsOnce(sizeOptions, formData.size));
        setSortedMaterialOptions(sortOptionsOnce(materialOptions, formData.material));
        setSortedFinishOptions(sortOptionsOnce(finishOptions, formData.finish));
      }
    }, [isOpen]);

    if (!isOpen || !tile) return null;

    return (
      <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fadeIn">
        <div className="bg-[#fdf0e6] rounded-md shadow-lg w-full max-w-2xl p-[25px] relative animate-slideUp">
          <button
            className="absolute top-0 right-0 z-10 cursor-pointer bg-[#6F4E37] rounded-tr-[5px] rounded-bl-[5px] text-gray-100 hover:text-white"
            onClick={onClose}
            aria-label="Close edit form"
          >
            <X size={30} className="text-white" />
          </button>

          <div className="max-h-max">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="aspect-square border border-[#BCBCBC] overflow-hidden p-3 w-full max-w-[262px] h-[300px] sm:h-[369px] rounded-[10px] mx-auto md:mx-0">
                <img
                  src={tile.tiles_image || '/placeholder.svg'}
                  alt={tile.tiles_name}
                  className="w-full h-full object-cover rounded-[10px]"
                />
              </div>

              <div className="w-full lg:w-1/2 space-y-3">
                <div>
                  <label className="text-[16px] font-semibold ">Name</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={e => onChange('name', e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 text-sm rounded focus:outline-none bg-white focus:ring-2 focus:ring-[#7b4f28]"
                    placeholder="Enter name"
                  />
                </div>

                <div>
                  <label className="text-[16px] font-semibold ">Priority</label>
                  <div className="mt-1 flex rounded overflow-hidden w-fit">
                    {['Low', 'Medium', 'High'].map((level, idx) => (
                      <div key={level} className="flex space-x-2 bg-[#E9D8CB] p-1">
                        <button
                          type="button"
                          className={`px-1 sm:px-4 py-0.5 text-[11.23px] rounded font-medium transition-all duration-300 cursor-pointer ${
                            formData.priority?.toLowerCase() === level.toLowerCase()
                              ? 'bg-[#7b4f28] text-white scale-105'
                              : 'bg-white text-gray-800 hover:bg-gray-50 hover:scale-105'
                          } ${idx === 0 ? 'rounded-l' : ''} ${idx === 2 ? 'rounded-r' : ''}`}
                          onClick={() => onChange('priority', level)}
                        >
                          {level}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <MultiSelectDropdown
                  label="Sizes"
                  options={sortedSizeOptions}
                  selectedValues={formData.size || []}
                  onChange={vals => onChange('size', vals)}
                />
                <MultiSelectDropdown
                  label="Materials"
                  options={sortedMaterialOptions}
                  selectedValues={formData.material || []}
                  onChange={vals => onChange('material', vals)}
                />
                <MultiSelectDropdown
                  label="Finishes"
                  options={sortedFinishOptions}
                  selectedValues={formData.finish || []}
                  onChange={vals => onChange('finish', vals)}
                />
                <MultiSelectDropdown
                  label="Series"
                  options={sortedSeriesOptions}
                  selectedValues={formData.series || []}
                  onChange={vals => onChange('series', vals)}
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
              <button
                type="button"
                onClick={() => onDelete(tile.id)}
                className="bg-white cursor-pointer border border-gray-300 text-gray-700 py-2 px-6 rounded hover:bg-gray-100 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onSave}
                className="bg-[#6F4E37] text-white py-2 px-6 rounded hover:bg-[#6F4E37] text-sm font-medium cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

EditTilePopup.displayName = 'EditTilePopup';
export default EditTilePopup;
