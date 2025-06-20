import { memo, useState, useCallback } from 'react';
import { X } from 'lucide-react';
import { toCapitalize } from '@/helpers';
import DeleteConfirmationModal from '../common/DeleteConfirmationModal';

const ViewTilePopup = memo(({ tile, isOpen, onClose, onEdit, onDelete }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getPriorityColor = useCallback(priority => {
    const lowerPriority = priority?.toLowerCase() || '';
    if (lowerPriority.includes('low')) return 'bg-[#2CC29A]';
    if (lowerPriority.includes('medium')) return 'bg-[#EA9A3E]';
    if (lowerPriority.includes('high')) return 'bg-[#EA3E3E]';
    return 'bg-gray-500';
  }, []);

  if (!isOpen || !tile) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-300">
      <div className="relative bg-[#FFF5EE] rounded-sm w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto animate-in zoom-in-95 slide-in-from-bottom-4 duration-500 ease-out">
        <button
          className="absolute top-0 right-0 z-10 cursor-pointer bg-[#6F4E37] rounded-tr-[5px] rounded-bl-[5px] text-gray-100 hover:text-white"
          onClick={onClose}
          aria-label="Close edit form"
        >
          <X size={30} className="text-white" />
        </button>

        <div className="p-3 sm:p-4 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            <div className="aspect-square border border-[#BCBCBC] w-full max-w-[200px] sm:max-w-[250px] md:max-w-[300px] lg:max-w-none h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] rounded-lg p-3 mx-auto lg:mx-0 animate-in slide-in-from-left-5 duration-700 delay-200">
              <img
                src={tile.tiles_image || '/placeholder.svg'}
                alt={tile.tiles_name}
                className="w-full h-full object-cover rounded-lg transition-all duration-300 hover:scale-105"
              />
            </div>

            <div className="space-y-2 sm:space-y-3 md:space-y-4 animate-in slide-in-from-right-5 duration-700 delay-300">
              <div>
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-1 break-words">
                  {toCapitalize(tile.tiles_name)}
                </h3>
              </div>

              <div className="space-y-1 sm:space-y-2">
                <label className="text-xs sm:text-sm font-semibold text-gray-700">Priority</label>
                <div className="flex items-center">
                  <span
                    className={`px-2 sm:px-3 py-1 rounded text-white text-[10px] sm:text-[11px] font-medium transition-transform duration-200 hover:scale-105 ${getPriorityColor(tile.priority)}`}
                  >
                    {toCapitalize(tile.priority)}
                  </span>
                </div>
              </div>

              {/* Sizes */}
              {tile.size && tile.size.length > 0 && (
                <div className="space-y-1">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700">Sizes</label>
                  <div className="flex flex-wrap gap-1">
                    {tile.size.map((sz, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 text-xs bg-gray-100 rounded-full border border-gray-300 text-gray-700"
                      >
                        {sz}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Materials */}
              {tile.material && tile.material.length > 0 && (
                <div className="space-y-1">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700">
                    Materials
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {tile.material.map((mat, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 text-xs bg-gray-100 rounded-full border border-gray-300 text-gray-700"
                      >
                        {mat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Finishes */}
              {tile.finish && tile.finish.length > 0 && (
                <div className="space-y-1">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700">Finishes</label>
                  <div className="flex flex-wrap gap-1">
                    {tile.finish.map((fin, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 text-xs bg-gray-100 rounded-full border border-gray-300 text-gray-700"
                      >
                        {fin}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Series */}
              {tile.series && tile.series.length > 0 && (
                <div className="space-y-1">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700">Series</label>
                  <div className="flex flex-wrap gap-1">
                    {tile.series.map((ser, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 text-xs bg-gray-100 rounded-full border border-gray-300 text-gray-700"
                      >
                        {ser}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Color */}
              {tile.tiles_color && tile.tiles_color.length > 0 && (
                <div className="space-y-1">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700">Color</label>
                  <div>
                    {tile.tiles_color.map((c, i) => (
                      <span
                        key={i}
                        style={{ display: 'inline-flex', alignItems: 'center', marginRight: 12 }}
                      >
                        <span
                          style={{
                            display: 'inline-block',
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            background: c.color_code,
                            marginRight: 8,
                            border: '1px solid #ddd',
                            verticalAlign: 'middle',
                          }}
                        />
                        <span className="text-xs sm:text-sm text-gray-700 font-semibold">
                          {toCapitalize(c.color_name)}
                        </span>
                        {i < tile.tiles_color.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 mt-4 sm:mt-6 pt-3 sm:pt-4 animate-in slide-in-from-bottom-3 duration-600 delay-500">
            <button
              onClick={() => setShowDeleteModal(true)}
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
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteConfirmationModal
          tile={{ description: 'This action cannot be undone. Do you want to continue?' }}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={() => {
            setIsDeleting(true);
            const id = tile.id || tile._id;
            onDelete(id);
            setShowDeleteModal(false);
            setIsDeleting(false);
          }}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
});

ViewTilePopup.displayName = 'ViewTilePopup';
export default ViewTilePopup;
