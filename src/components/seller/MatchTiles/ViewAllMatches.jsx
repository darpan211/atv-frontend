import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMatches, deleteMatch } from '../../../redux/slice/matchTiles/matchThunk';
import { Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

const AllMatchesDisplay = () => {
  const dispatch = useDispatch();
  const { list: matches, loading, deletingId, error, success } = useSelector(state => state.match);
  const lastDeletedId = useRef(null);

  useEffect(() => {
    dispatch(fetchMatches());
  }, [dispatch]);

  useEffect(() => {
    if (error && lastDeletedId.current) {
      toast.error(error);
      lastDeletedId.current = null;
    }
    if (success && lastDeletedId.current) {
      toast.success(typeof success === 'string' ? success : 'Match deleted successfully');
      lastDeletedId.current = null;
    }
  }, [error, success]);
  console.log(matches, "matches in AllMatchesDisplay");
  const handleDelete = (id) => {
    lastDeletedId.current = id;
    dispatch(deleteMatch(id));
  };

  if (loading) {
    return <div className="text-center py-8">Loading matches...</div>;
  }

  if (!matches || matches.length === 0) {
    return <div className="text-center py-8">No matches found</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">All Matches</h1>
      <div className="space-y-6">
        {matches.map((matchGroup) => (
          <div key={matchGroup._id} className="border p-4 rounded-lg shadow bg-gray-50 relative">
            {/* Delete button */}
            <button
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow cursor-pointer"
              onClick={() => handleDelete(matchGroup._id)}
              disabled={deletingId === matchGroup._id}
              title="Delete"
            >
              {deletingId === matchGroup._id ? (
                <span className="text-xs">...</span>
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
            <div className="flex items-start gap-6 mb-4">
              <div className="flex-1">
                <h2 className="text-lg font-semibold mb-2">Main Tile</h2>
                <div className="flex items-center gap-4">
                  <img
                    src={matchGroup.tiles_id.tiles_image}
                    alt={matchGroup.tiles_id.tiles_name}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium">{matchGroup.tiles_id.tiles_name}</p>
                    <p className="text-sm text-gray-600">{matchGroup.tiles_id.description}</p>
                    <div className="flex items-center gap-1 mr-2">
                      {matchGroup.tiles_id.tiles_color?.map((color, i) => (
                        <div className="flex items-center gap-1 mr-2" key={i}>
                          <span
                            className="inline-block w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: color.color_code }}
                          />
                          <span className='text-xs'>{color.color_name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold mb-2">Matched With</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {matchGroup.match_tiles_id.map((tile) => (
                    <div key={tile._id} className="border p-3 rounded-lg bg-white shadow-sm">
                      <div className="flex gap-3">
                        <img
                          src={tile.tiles_image}
                          alt={tile.tiles_name}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium">{tile.tiles_name}</p>
                          <p className="text-xs text-gray-600 line-clamp-2">{tile.description}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {tile.tiles_color?.map((color, i) => (
                              <div className='flex items-center gap-1 mr-2' key={i}>
                                <span
                                  className="inline-block w-3 h-3 rounded-full border border-gray-300"
                                  style={{ backgroundColor: color.color_code }}
                                  title={color.color_name}
                                />
                                <span className='text-xs'>{color.color_name}</span>
                              </div>
                            ))}
                            {Array.isArray(tile.size) && tile.size.length > 0 ? (
                              <div className="flex flex-wrap justify-center gap-1 mt-1">
                                {tile.size.map((sz, idx) => (
                                  <span
                                    key={idx}
                                    className="bg-amber-900 text-white text-[10px] px-2 py-[2px] rounded-full"
                                  >
                                    {sz}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <p className="text-[10px] text-center text-gray-400 italic">
                                No size info
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllMatchesDisplay;