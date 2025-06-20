import React from 'react';
import { Icon } from '../common/icons';

const TableView = ({
  tiles = [],
  onOpen,
  onEdit,
  onToggleActive,
  onToggleFavorite,
  onDelete,
  onPriorityChange,
  getPriorityColor,
}) => {
  const PriorityControls = ({ tile }) => {
    const priorities = ['Low', 'Medium', 'High'];

    return (
      <div className="flex flex-col items-center gap-2">
        <span
          className={`px-2 py-1 rounded text-white text-[11px] font-semibold transition-all duration-300 ease-in-out ${getPriorityColor(tile.priority)}`}
        >
          {tile.priority}
        </span>

        <div className="flex gap-1 bg-[#E9D8CB] p-1 rounded-lg">
          {priorities.map(p => {
            const full = `${p}`;
            const isSelected = tile?.priority?.toLowerCase() === full.toLowerCase();
            return (
              <button
                key={p}
                onClick={() => onPriorityChange(tile.id || tile._id, full)}
                className={`px-2 cursor-pointer py-1 text-xs rounded font-medium transition-all duration-300 ease-in-out transform hover:scale-105 ${
                  isSelected ? 'bg-white text-gray-800 shadow' : 'text-gray-700 hover:bg-gray-300'
                }`}
              >
                <span className="capitalize">{p}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      <div className='w-max-[1176px] overflow-x-auto'>
        <table className="w-full min-w-[1000px]">
          <thead className="bg-[#6f4e37] text-white">
            <tr>
              {[
                'Image',
                'Tile Name',
                'Priority',
                'Size',
                'Material',
                'Finish',
                'Series',
                'Status',
                'Favorite',
                'Actions',
              ].map((title, idx) => (
                <th
                  key={title}
                  className={`px-4 py-3 text-left text-sm font-semibold ${
                    idx !== 9 ? 'border-r border-[#6f4e37]' : ''
                  }`}
                >
                  {title}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {tiles.map((tile, index) => (
              <tr key={tile.id || tile._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 border-r border-gray-200">
                  <img
                    src={tile.tiles_image || '/placeholder.svg'}
                    alt={tile.name}
                    className="w-[75px] h-[60px] object-cover rounded-lg cursor-pointer hover:scale-105 transition"
                    onClick={() => onOpen(tile)}
                  />
                </td>

                <td className="px-4 py-3 text-sm font-medium text-gray-900 border-r border-gray-200">
                  {tile.tiles_name}
                </td>

                <td className="px-4 py-3 border-r border-gray-200">
                  <PriorityControls tile={tile} />
                </td>

                {[tile.size, tile.material, tile.finish, tile.series].map((field, idx) => (
                  <td
                    key={idx}
                    className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200 max-w-[150px]"
                  >
                    <div className="flex flex-wrap gap-1">
                      {(Array.isArray(field) ? field : field ? [field] : []).map((item, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 text-xs bg-gray-100 rounded-full border border-gray-300 text-gray-700"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}

                <td className="px-4 py-3 border-r border-gray-200">
                  <button
                    onClick={() => onToggleActive(tile.id || tile._id)}
                    className={`px-2 py-1 rounded text-xs font-medium transition cursor-pointer ${
                      tile.status === 'active'
                        ? 'bg-[#005E06] text-white hover:bg-[#004d05]'
                        : 'bg-[#DADADA] text-[#6E6E6E] hover:bg-[#cfcfcf]'
                    }`}
                  >
                    {tile.status === 'active' ? 'Active' : 'Inactive'}
                  </button>
                </td>

                <td className="px-4 py-3 border-r border-gray-200">
                  <button
                    onClick={() => onToggleFavorite(tile.id || tile._id)}
                    className={`p-2 rounded transition cursor-pointer ${
                      tile.favorite
                        ? 'bg-white text-[#6F4E37] border border-[#6f4e37]'
                        : 'bg-[#6F4E37] text-white'
                    }`}
                  >
                    <Icon
                      name="Heart"
                      size={16}
                      className={`transition-all duration-300 ${
                        tile.favorite ? 'text-[#6F4E37] fill-[#6F4E37]' : 'text-white fill-white'
                      }`}
                    />
                  </button>
                </td>

                <td className="px-4 py-3 flex items-center gap-2">
                  <button
                    onClick={() => onOpen(tile)}
                    className="p-2 text-[#6F4E37] rounded hover:bg-[#f2e8e1] transition"
                  >
                    <Icon name="Eye" width={20} height={20} />
                  </button>
                  <button
                    onClick={() => onEdit(tile)}
                    className="p-2 text-[#6F4E37] rounded hover:bg-[#f2e8e1] transition"
                  >
                    <Icon name="EditPencil" width={20} height={20} />
                  </button>
                  <button
                    onClick={() => onDelete(tile.id || tile._id)}
                    className="p-2 text-[#6F4E37] rounded hover:bg-[#f2e8e1] transition"
                  >
                    <Icon name="DeleteIcon" width={20} height={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableView;
