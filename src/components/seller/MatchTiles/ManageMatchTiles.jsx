import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTiles } from '@/redux/slice/tiles/tileThunks';
import { toast } from 'react-toastify';
import { addMatchTiles } from '@/redux/slice/matchTiles/matchThunk';

const MatchTilesManager = () => {
  const dispatch = useDispatch();
  const tileData = useSelector(state => state.tiles.tiles.data);
  const [mainCategory, setMainCategory] = useState('floor');
  const [mainTile, setMainTile] = useState(null);
  const [matchTiles, setMatchTiles] = useState([]);
  const [showMainPopup, setShowMainPopup] = useState(false);
  const [showMatchPopup, setShowMatchPopup] = useState(false);
  const [submittedMatches, setSubmittedMatches] = useState([]);

  const oppositeCategory = mainCategory === 'floor' ? 'wall' : 'floor';

  useEffect(() => {
    dispatch(fetchTiles());
  }, [dispatch]);

  const filteredMainTiles =
    tileData?.filter(tile => tile.category?.toLowerCase() === mainCategory) || [];

  const filteredMatchTiles =
    tileData?.filter(
      tile => tile.category?.toLowerCase() === oppositeCategory && tile._id !== mainTile?._id
    ) || [];

  useEffect(() => {
    const firstTile = tileData?.find(tile => tile.category?.toLowerCase() === mainCategory);
    if (firstTile) setMainTile(firstTile);
  }, [mainCategory, tileData]);

  const handleMatchTileToggle = tile => {
    const exists = matchTiles.some(t => t._id === tile._id);
    if (exists) {
      setMatchTiles(prev => prev.filter(t => t._id !== tile._id));
    } else {
      setMatchTiles(prev => [...prev, tile]);
    }
  };

  const handleSubmit = () => {
    if (!mainTile || matchTiles.length === 0) {
      toast.error('Please select a main tile and at least one match tile.');
      return;
    }
    dispatch(
      addMatchTiles({
        tiles_id: mainTile._id,
        match_tiles_id: matchTiles.map(tile => tile._id),
      })
    )
      .unwrap()
      .then(res => {
        if (res.success) {
          toast.success('Match tiles created successfully!');
          setSubmittedMatches(prev => [...prev, { mainTile, matchTiles }]);
          setMatchTiles([]);
        } else {
          toast.error(res?.message || 'Failed to create match');
        }
      })
      .catch(error => {
        toast.error(error?.message || 'Error creating match tiles');
      });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Match Tiles</h1>

      <div className="flex items-center gap-4 mb-6">
        <label className="text-lg font-medium">Main Category:</label>
        <select
          value={mainCategory}
          onChange={e => {
            setMainCategory(e.target.value);
            setMainTile(null);
            setMatchTiles([]);
          }}
          className="border px-4 py-2 rounded"
        >
          <option value="floor">Floor</option>
          <option value="wall">Wall</option>
        </select>
      </div>

      <div className="flex items-center gap-4 mb-6">
        {/* Main Tile */}
        <div className="border p-4 rounded-2xl shadow flex-1">
          <h2 className="text-lg font-semibold mb-2">Main Tile</h2>
          {mainTile ? (
            <div onClick={() => setShowMainPopup(true)} className="cursor-pointer">
              <img
                src={mainTile.tiles_image}
                alt={mainTile.tiles_name}
                className="w-full h-40 object-cover rounded"
              />
              <p className="mt-2 text-center">{mainTile.tiles_name}</p>
            </div>
          ) : (
            <p>No main tile selected.</p>
          )}
        </div>

        {/* Arrow Navigation */}
        <div className="flex flex-col items-center justify-center">
          <button
            className="text-7xl font-bold text-amber-900 hover:scale-110 transition-all duration-300 p-2 cursor-pointer"
            title="Submit match"
          >
            ⇆
          </button>
        </div>

        {/* Match Tiles Cart and Submit Button */}
        <div className="flex-1 w-full">
          <div className="border p-4 rounded-2xl shadow max-h-[250px] overflow-y-auto">
            <div onClick={() => setShowMatchPopup(true)} className="cursor-pointer">
              <h2 className="text-lg font-semibold mb-2">Match Tiles</h2>
              {matchTiles.length === 0 ? (
                <p>Select match tiles</p>
              ) : (
                <div className="flex flex-wrap gap-4">
                  {matchTiles.map(tile => (
                    <div
                      key={tile._id}
                      className="w-28 flex-shrink-0 border p-2 rounded bg-white shadow-sm"
                    >
                      <img
                        src={tile.tiles_image}
                        alt={tile.tiles_name}
                        className="w-full h-20 object-cover rounded"
                      />
                      <p className="text-xs font-medium mt-1 truncate text-center">
                        {tile.tiles_name}
                      </p>
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
                        <p className="text-[10px] text-center text-gray-400 italic">No size info</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={handleSubmit}
              className="bg-amber-900 text-white px-6 py-2 rounded text-lg font-bold hover:bg-amber-950 transition-all duration-300 cursor-pointer"
              title="Submit match"
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      {/* Submitted Matches Section */}
      {submittedMatches.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">Submitted Matches</h2>
          {submittedMatches.map((group, index) => (
            <div key={index} className="border p-4 rounded-lg shadow mb-6 bg-gray-50">
              <h3 className="text-md font-semibold mb-2">Main Tile</h3>
              <div className="flex items-center gap-4">
                <img
                  src={group.mainTile.tiles_image}
                  alt={group.mainTile.tiles_name}
                  className="w-24 h-24 object-cover rounded"
                />
                <p className="font-medium">{group.mainTile.tiles_name}</p>
              </div>

              <h3 className="text-md font-semibold mt-4 mb-2">Matched Tiles</h3>
              <div className="grid grid-cols-1 md:grid-cols-8 gap-4">
                {group.matchTiles.map(tile => (
                  <div key={tile._id} className="border p-2 rounded-lg bg-white shadow-sm">
                    <img
                      src={tile.tiles_image}
                      alt={tile.tiles_name}
                      className="w-full h-24 object-cover rounded"
                    />
                    <p className="text-sm mt-1 text-center">{tile.tiles_name}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Tile Popup */}
      {showMainPopup && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-40 z-50 flex justify-center items-center">
          <div className="bg-white p-6 max-w-4xl w-full rounded shadow overflow-y-auto max-h-[90vh] relative">
            <button
              onClick={() => setShowMainPopup(false)}
              className="absolute top-2 right-2 text-amber-900 hover:text-black cursor-pointer"
            >
              ✕
            </button>
            <h2 className="text-lg font-bold mb-4">Select Main Tile</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {filteredMainTiles.map(tile => (
                <div
                  key={tile._id}
                  onClick={() => {
                    setMainTile(tile);
                    setMatchTiles([]);
                  }}
                  className={`border p-2 rounded cursor-pointer hover:bg-gray-100 ${
                    mainTile?._id === tile._id ? 'ring-2 ring-amber-900' : ''
                  }`}
                >
                  <img
                    src={tile.tiles_image}
                    alt={tile.tiles_name}
                    className="w-full h-24 object-cover rounded"
                  />
                  <p className="text-sm mt-1 text-center">{tile.tiles_name}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowMainPopup(false)}
                className="bg-amber-900 text-white px-4 py-2 rounded hover:bg-amber-950"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Match Tile Popup */}
      {showMatchPopup && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-40 z-50 flex justify-center items-center">
          <div className="bg-white p-6 max-w-4xl w-full rounded shadow overflow-y-auto max-h-[90vh] relative">
            <button
              onClick={() => setShowMatchPopup(false)}
              className="absolute top-2 right-2 text-amber-900 hover:text-black cursor-pointer"
            >
              ✕
            </button>
            <h2 className="text-lg font-bold mb-4">Select Match Tiles</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {filteredMatchTiles.map(tile => (
                <div
                  key={tile._id}
                  onClick={() => handleMatchTileToggle(tile)}
                  className={`border p-2 rounded cursor-pointer hover:bg-gray-100 ${
                    matchTiles.some(t => t._id === tile._id)
                      ? 'border-amber-950 ring-2 ring-amber-900'
                      : ''
                  }`}
                >
                  <img
                    src={tile.tiles_image}
                    alt={tile.tiles_name}
                    className="w-full h-24 object-cover rounded"
                  />
                  <p className="text-sm mt-1 text-center">{tile.tiles_name}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowMatchPopup(false)}
                className="bg-amber-900 text-white px-4 py-2 rounded hover:bg-amber-950"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchTilesManager;