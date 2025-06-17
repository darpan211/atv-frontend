import { memo, useCallback } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import img from '../../assets/image (2).png';
import { Icon } from '../common/icons';

// EditFormPopup component
const EditFormPopup = memo(({ tile, isOpen, onClose, formData, onChange, onSave, onDelete }) => {
  if (!isOpen || !tile) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#fdf0e6] rounded-md shadow-lg w-full max-w-2xl p-[25px]  relative  animate-slideUp">
        <button
          className="absolute top-0 right-0 z-10 cursor-pointer transition-colors duration-300 ease-in-out p-[11px] bg-[#6F4E37] rounded-tr-[5px] rounded-bl-[5px] text-gray-100 hover:text-white"
          onClick={onClose}
          aria-label="Close edit form"
        >
          <Icon
            name="Close"
            size={10}
            className="text-white transition-all duration-300 ease-in-out"
          />
        </button>

        {/* Scrollable content wrapper */}
        <div className="overflow-y-auto max-h-max">
          <div className="flex flex-col lg:flex-row  lg:gap-4">
            <div className="aspect-square border border-[#BCBCBC] overflow-hidden  p-3 w-full max-w-[262px] h-[300px] sm:h-[369px] rounded-[10px] mx-auto md:mx-0 animate-fadeIn delay-100">
              <img
                src={img || '/placeholder.svg'}
                alt={tile.name}
                className="w-full h-full object-cover rounded-[10px]  transition-transform duration-300 ease-in-out"
              />
            </div>

            <div className="w-full lg:w-1/2 space-y-3">
              <div>
                <label className="text-[16px] font-semibold ">Name</label>
                <input
                  key={`name-${tile.id}`}
                  type="text"
                  placeholder="Enter name"
                  onChange={e => onChange('name', e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 text-sm rounded focus:outline-none bg-white focus:ring-2 focus:ring-[#7b4f28] transition-all duration-300"
                />
              </div>

              <div>
                <label className="text-[16px] font-semibold ">Priority</label>
                <div className="mt-1 flex rounded overflow-hidden w-fit">
                  {['Low', 'Medium', 'High'].map((level, idx) => (
                    <div key={level} className="flex space-x-2 bg-[#E9D8CB] p-1">
                      <button
                        key={level}
                        type="button"
                        className={`px-1 sm:px-4 py-0.5 text-[11.23px] rounded font-medium transition-all duration-300 cursor-pointer ${
                          formData.priority === level
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

              {[
                {
                  label: 'Sizes',
                  key: 'size',
                  options: ['300 x 300', '400 x 400', '600 x 600', '800 x 800'],
                },
                {
                  label: 'Materials',
                  key: 'material',
                  options: ['Porcelain', 'Ceramic', 'Natural Stone', 'Glass', 'Marble'],
                },
                {
                  label: 'Finishes',
                  key: 'finish',
                  options: ['Glossy', 'Matte', 'Textured', 'Polished', 'Natural'],
                },
                {
                  label: 'Series',
                  key: 'series',
                  options: ['Wooden', 'Modern', 'Classic', 'Luxury', 'Rustic'],
                },
                {
                  label: 'Color',
                  key: 'color',
                  options: ['Gainsboro', 'White', 'Gray', 'Beige', 'Brown', 'Black'],
                },
              ].map(({ label, key, options }) => (
                <div
                  key={key}
                  className="animate-fadeIn delay-150 w-full max-w-full xl:max-w-[420px] mb-6"
                >
                  <label className="text-base font-semibold block mb-1">{label}</label>
                  <Select value={formData[key] || ''} onValueChange={value => onChange(key, value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={`Select ${label}`} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {options.map(option => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 animate-fadeIn delay-200">
            <button
              type="button"
              onClick={() => onDelete(tile.id)}
              className="cursor-pointer bg-white border border-gray-300 text-gray-700 py-2 px-6 rounded hover:bg-gray-100 text-sm font-medium transition-all duration-300 "
            >
              Delete
            </button>
            <button
              type="button"
              onClick={onSave}
              className="cursor-pointer bg-[#6F4E37] text-white py-2 px-6 rounded hover:bg-[#6F4E37] text-sm font-medium transition-all duration-300"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

EditFormPopup.displayName = 'EditFormPopup';

// TilePopup component
const TilePopup = memo(({ tile, isOpen, onClose, onEdit, onDelete }) => {
  const getPriorityColor = useCallback(priority => {
    switch (priority) {
      case 'Low Priority':
        return 'bg-[#2CC29A]';
      case 'Medium Priority':
        return 'bg-[#EA9A3E]';
      case 'High Priority':
        return 'bg-[#EA3E3E]';
      default:
        return 'bg-gray-500';
    }
  }, []);

  if (!isOpen || !tile) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-300">
      <div className="relative bg-[#FFF5EE] rounded-sm w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto animate-in zoom-in-95 slide-in-from-bottom-4 duration-500 ease-out">
        <button
          className="absolute top-0 right-0 z-10 cursor-pointer transition-colors duration-300 ease-in-out p-[11px] bg-[#6F4E37] rounded-tr-[5px] rounded-bl-[5px] text-gray-100 hover:text-white"
          onClick={onClose}
          aria-label="Close edit form"
        >
          <Icon
            name="Close"
            size={10}
            className="text-white transition-all duration-300 ease-in-out"
          />
        </button>

        {/* Content */}
        <div className="p-3 sm:p-4 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            {/* Image Section */}
            <div className="aspect-square border border-[#BCBCBC] w-full max-w-[200px] sm:max-w-[250px] md:max-w-[300px] lg:max-w-none h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] rounded-lg p-3 mx-auto lg:mx-0 animate-in slide-in-from-left-5 duration-700 delay-200">
              <img
                src={img || '/placeholder.svg'}
                alt={tile.name}
                className="w-full h-full object-cover rounded-lg transition-all duration-300 hover:scale-105"
              />
            </div>

            {/* Details Section */}
            <div className="space-y-2 sm:space-y-3 md:space-y-4 animate-in slide-in-from-right-5 duration-700 delay-300">
              <div>
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-1 break-words">
                  {tile.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 break-all">{tile.code}</p>
              </div>

              {/* Priority */}
              <div className="space-y-1 sm:space-y-2">
                <label className="text-xs sm:text-sm font-semibold text-gray-700">Priority</label>
                <div className="flex items-center">
                  <span
                    className={`px-2 sm:px-3 py-1 rounded text-white text-[10px] sm:text-[11px] font-medium transition-transform duration-200 hover:scale-105 ${getPriorityColor(tile.priority)}`}
                  >
                    {tile.priority}
                  </span>
                </div>
              </div>

              <div className="space-y-1 text-sm">
                {[
                  {
                    label: 'Size',
                    value: (
                      <div className="flex flex-wrap gap-1">
                        {tile.size.map((sz, i) => (
                          <span
                            key={i}
                            className="inline-block bg-gray-100 text-gray-900 text-xs sm:text-sm px-2.5 py-1 rounded-md border border-gray-300 shadow-sm"
                          >
                            {sz}
                          </span>
                        ))}
                      </div>
                    ),
                  },
                  {
                    label: 'Series',
                    value: (
                      <span className="inline-block bg-gray-100 text-gray-900 text-xs sm:text-sm px-2.5 py-1 rounded-md border border-gray-300 shadow-sm">
                        {tile.series}
                      </span>
                    ),
                  },
                  {
                    label: 'Category',
                    value: (
                      <span className="inline-block bg-gray-100 text-gray-900 text-xs sm:text-sm px-2.5 py-1 rounded-md border border-gray-300 shadow-sm">
                        {tile.category}
                      </span>
                    ),
                  },
                  {
                    label: 'Material',
                    value: (
                      <span className="inline-block bg-gray-100 text-gray-900 text-xs sm:text-sm px-2.5 py-1 rounded-md border border-gray-300 shadow-sm">
                        {tile.material}
                      </span>
                    ),
                  },
                  {
                    label: 'Finish',
                    value: (
                      <span className="inline-block bg-gray-100 text-gray-900 text-xs sm:text-sm px-2.5 py-1 rounded-md border border-gray-300 shadow-sm">
                        {tile.finish}
                      </span>
                    ),
                  },
                  {
                    label: 'Color',
                    value: (
                      <span className='text-black'>
                        {tile.color}
                      </span>
                    ),
                  },
                ].map((item, index) => (
                  <div key={index} className="flex justify-between gap-2">
                    <span className="font-semibold text-gray-700 whitespace-nowrap">
                      {item.label}:
                    </span>
                    <span className="truncate flex-1 text-gray-600">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 mt-4 sm:mt-6 pt-3 sm:pt-4 animate-in slide-in-from-bottom-3 duration-600 delay-500">
            <button
              onClick={() => onDelete(tile.id)}
              className="cursor-pointer w-[120px] px-3 sm:px-4 py-2 bg-white text-black rounded-md font-medium transition-all duration-200 border border-gray-300 hover:bg-gray-50 hover:shadow-lg active:scale-95 transform text-sm sm:text-base"
              style={{ boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)' }}
            >
              Delete
            </button>

            <button
              onClick={() => onEdit(tile)}
              className="cursor-pointer w-[97px] px-3 sm:px-4 py-2 bg-[#6F4E37] text-white rounded-md hover:bg-[#5a3d2b] transition-all duration-200 font-medium flex items-center justify-center gap-2 hover:shadow-lg active:scale-95 transform text-sm sm:text-base"
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

TilePopup.displayName = 'TilePopup';                                                                                                        

export { EditFormPopup, TilePopup };                                                                                                                                                                                                                                                                                                            
