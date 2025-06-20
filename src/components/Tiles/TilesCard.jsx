import { Icon } from '../common/icons';
import { Checkbox } from '../ui/checkbox';

const TilesCard = ({
  tile,
  onOpen,
  onToggleFavorite,
  onToggleActive,
  onPriorityChange,
  onDelete,
  getPriorityColor,
}) => {
  const tileId = tile.id || tile._id;
  const priorities = ['Low', 'Medium', 'High'];
  const currentPriority = tile.priority || '';

  return (
    <div className="w-full h-fit bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-200 overflow-hidden">
      <div
        className="relative bg-[#E0E0E0] rounded-t-xl p-2 overflow-hidden flex justify-center items-center h-[160px] cursor-pointer w-full group"
        onClick={() => onOpen(tile)}
      >
        <div className="relative bg-[#E0E0E0] rounded-t-xl p-2 flex justify-center items-center h-[160px] cursor-pointer w-full group">
          <img
            src={tile?.tiles_image || '/placeholder.svg'}
            alt={tile.name}
            className="object-cover w-full h-full rounded-xl transition-transform duration-300 ease-in-out group-hover:scale-105"
          />
        </div>
        <button
          onClick={e => {
            e.stopPropagation();
            onToggleFavorite(tileId);
          }}
          className={`absolute top-3 right-3 p-1.5 rounded-md shadow-md transition-all duration-200 cursor-pointer ${tile.favorite ? 'bg-white' : 'bg-[#6F4E37] bg-opacity-90 hover:bg-opacity-100'}`}
        >
          <Icon
            name="Heart"
            size={16}
            className={`transition-all duration-300 ${tile.favorite ? 'text-[#6F4E37] fill-[#6F4E37]' : 'text-white fill-white'}`}
            colour={tile.favorite ? '#6F4E37' : '#fff'}
          />
        </button>
      </div>

      <div className="p-2 space-y-3">
        <h3 className="text-base font-semibold truncate">{tile.name}</h3>

        <div className="space-y-1 text-sm">
          {[
            {
              label: 'Size',
              value: (
                <div className="flex flex-wrap gap-1">
                  {(Array.isArray(tile.size) ? tile.size : tile.size ? [tile.size] : []).map(
                    (sz, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 text-xs bg-gray-100 rounded-full border border-gray-300 text-gray-700"
                      >
                        {sz}
                      </span>
                    )
                  )}
                </div>
              ),
            },
            {
              label: 'Series',
              value: (
                <div className="flex flex-wrap gap-1">
                  {(Array.isArray(tile.series)
                    ? tile.series
                    : tile.series
                      ? [tile.series]
                      : []
                  ).map((s, i) => (
                    <span
                      key={i}
                      className="px-2 text-xs bg-gray-100 rounded-full border border-gray-300 text-gray-700"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              ),
            },
            {
              label: 'Category',
              value: (
                <span className="px-2 text-xs bg-gray-100 rounded-full border border-gray-300 text-gray-700">
                  {tile.category}
                </span>
              ),
            },
          ].map((item, index) => (
            <div key={index} className="flex justify-between gap-2">
              <span className="font-semibold text-gray-700 whitespace-nowrap">{item.label}:</span>
              <span className="truncate flex-1 text-gray-600">{item.value}</span>
            </div>
          ))}
        </div>

        {/* Priority Buttons */}
        <div className="flex items-center gap-2 animate-fade-in justify-between">
          <div className="flex gap-1 bg-[#e9d8cb] rounded-[8px] px-1 py-1 items-center w-fit">
            {priorities.map(p => {
              const isSelected = currentPriority.toLowerCase() === p.toLowerCase();
              return (
                <button
                  key={p}
                  onClick={e => {
                    e.stopPropagation();
                    onPriorityChange(tileId, p.toLowerCase());
                  }}
                  className={`cursor-pointer px-0.5 py-0.5 text-xs rounded-sm font-medium transition duration-300 transform hover:scale-105 ${
                    isSelected
                      ? 'bg-white text-gray-800 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>

          <span
            className={`text-[11px] font-semibold px-2 py-1 rounded-lg text-white w-[113.92px] h-[24.07px] flex justify-center items-center ${getPriorityColor(tile.priority)}`}
          >
            {tile.priority}
          </span>
        </div>
      </div>

      <div className="bg-[#FFF5EE] px-4 py-2 flex flex-col sm:flex-row sm:justify-between items-center gap-2 sm:gap-0 w-full mt-1 border-t border-gray-200">
        <label className="inline-flex items-center gap-2 text-[#5C4033] text-sm font-semibold cursor-pointer hover:scale-105 transition duration-300">
          <Checkbox
            checked={tile.status === 'active'}
            onClick={e => {
              e.stopPropagation();
              onToggleActive(tileId);
            }}
            className="w-4 h-4 cursor-pointer accent-[#6F4E37] transition-transform hover:scale-125 bg-white border-[#6F4E37]"
          />
          <span className="transition duration-300 text-[#6F4E37]">Active</span>
        </label>

        <button
          onClick={() => onDelete(tileId)}
          className="flex items-center gap-2 px-4 py-1.5 bg-[#5C4033] text-white rounded-lg text-sm font-semibold hover:bg-[#4a3529] hover:scale-105 transition duration-300 shadow-md transform"
        >
          <Icon
            name="DeleteIcon"
            width={18}
            height={18}
            colour="white"
            className="text-white flex-shrink-0"
          />
          Delete
        </button>
      </div>
    </div>
  );
};

export default TilesCard;
