import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Upload, X, Plus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboards } from '@/redux/slice/dashboard/dashboardThunk';

const generateUniqueId = () => Math.random().toString(36).substring(2) + Date.now();

const Tile = ({ tile, index, moveTile, handleRemove }) => {
  const ref = useRef(null);
  const [{ isDragging }, drag] = useDrag({
    type: 'TILE',
    item: { index },
    collect: monitor => ({ isDragging: monitor.isDragging() }),
  });
  const [, drop] = useDrop({
    accept: 'TILE',
    hover(item) {
      if (item.index !== index) {
        moveTile(item.index, index);
        item.index = index;
      }
    },
  });
  drag(drop(ref));
  return (
    <div
      ref={ref}
      className={`relative w-48 h-48 rounded-md overflow-hidden border-2 ${
        isDragging ? 'opacity-50' : 'opacity-100'
      } ${index === 0 ? 'border-[#6F4E37]' : 'border-gray-300'} animate-fade-in`}
    >
      <img src={tile.url} alt={`Tile ${index + 1}`} className="w-full h-full object-cover" />
      <button
        type="button"
        onClick={() => handleRemove(index)}
        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
};

const validationSchema = Yup.object().shape({
  tiles: Yup.object().test(
    'at-least-one-image-per-tab',
    'At least 1 image is required for each tab',
    value => Object.values(value).every(arr => arr.length > 0)
  ),
});

const TilesPlaceConfig = ({ onDataChange, onNext }) => {
  const dispatch = useDispatch();
  const { dashboardData } = useSelector(state => state.dashboard);

  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [newTabName, setNewTabName] = useState('');
  const [formValues, setFormValues] = useState({});
  const [autoNextDone, setAutoNextDone] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    dispatch(fetchDashboards());
  }, [dispatch]);

  useEffect(() => {
    const imageGroups = dashboardData?.[0]?.places_images;
    if (imageGroups && typeof imageGroups === 'object') {
      const tabNames = Object.keys(imageGroups).map(t => t.toLowerCase());
      const initialTiles = {};
      const initialUrls = {};
      tabNames.forEach(tab => {
        const urls = imageGroups[tab] || [];
        initialTiles[tab] = urls.map(url => ({ url, file: null, uniqueId: generateUniqueId() }));
        initialUrls[tab] = urls;
      });
      setTabs(tabNames);
      setActiveTab(prev => prev || tabNames[0]);
      setFormValues(initialTiles);
    }
  }, [dashboardData]);

  useEffect(() => {
    if (autoNextDone) return;
    const imageGroups = dashboardData?.[0]?.places_images;
    const hasImages = Object.values(imageGroups || {}).some(arr => arr.length > 0);
    if (hasImages) {
      onNext?.();
      onDataChange?.({ tiles: formValues });
      setAutoNextDone(true);
    }
  }, [dashboardData, onNext, onDataChange, formValues, autoNextDone]);

  const saveTiles = async tiles => {
    return new Promise(resolve => {
      setTimeout(() => resolve({ status: 200 }), 1000);
    });
  };

  const handleUpload = useCallback(
    (e, setFieldValue, values) => {
      if (!activeTab) return toast.error('Please select or create a tab first!');
      const files = Array.from(e.target?.files || e.dataTransfer?.files || []);
      const validImages = files.filter(file => file.type.startsWith('image/'));
      const newTiles = validImages.map(file => ({
        url: URL.createObjectURL(file),
        file,
        uniqueId: generateUniqueId(),
      }));
      const updatedTiles = [...(values.tiles[activeTab] || []), ...newTiles];
      setFieldValue(`tiles.${activeTab}`, updatedTiles);
      if (e.target) e.target.value = null;
    },
    [activeTab]
  );

  const moveTile = useCallback(
    (fromIndex, toIndex, setFieldValue, values) => {
      const updated = [...(values.tiles[activeTab] || [])];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      setFieldValue(`tiles.${activeTab}`, updated);
    },
    [activeTab]
  );

  const handleRemoveTile = useCallback(
    (index, setFieldValue, values) => {
      const updated = [...(values.tiles[activeTab] || [])];
      const removed = updated.splice(index, 1);
      if (removed[0]?.file) URL.revokeObjectURL(removed[0].url);
      setFieldValue(`tiles.${activeTab}`, updated);
    },
    [activeTab]
  );

  const handleAddTab = useCallback(
    (setFieldValue, values) => {
      const trimmed = newTabName.trim();
      if (!trimmed) return toast.error('Tab name cannot be empty');
      const lower = trimmed.toLowerCase();
      if (tabs.some(t => t.toLowerCase() === lower)) return toast.error('Tab name already exists');
      setTabs(prev => [...prev, lower]);
      setActiveTab(lower);

      const updatedFormValues = {
        ...values.tiles,
        [lower]: [],
      };
      setFormValues(updatedFormValues);
      setFieldValue('tiles', updatedFormValues);
      setNewTabName('');
    },
    [newTabName, tabs]
  );

  const handleRemoveTab = useCallback(
    (tab, setFieldValue, values) => {
      const updatedTabs = tabs.filter(t => t !== tab);
      const updatedFormValues = { ...values.tiles };
      delete updatedFormValues[tab];
      setTabs(updatedTabs);
      if (activeTab === tab) setActiveTab(updatedTabs[0] || null);
      setFormValues(updatedFormValues);
      setFieldValue('tiles', updatedFormValues);
    },
    [tabs, activeTab]
  );

  return (
    <div className="p-4 sm:p-6 bg-[#FFF5EE] min-h-screen">
      <h2 className="text-xl sm:text-2xl font-bold text-black mb-4">Tile Images</h2>
      <Formik
        enableReinitialize
        initialValues={{ tiles: formValues }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          if (!activeTab) {
            toast.error('Please select a tab before saving!');
            setSubmitting(false);
            return;
          }
          try {
            const isUnchanged = JSON.stringify(values.tiles) === JSON.stringify(formValues);
            let payload;
            if (isUnchanged) {
              payload = formValues;
            } else {
              payload = Object.fromEntries(
                Object.entries(values.tiles)
                  .filter(([tab, arr]) => arr.length > 0)
                  .map(([tab, arr]) => [tab.toLowerCase(), arr])
              );
            }
            const res = await saveTiles(payload);
            if (res.status === 200) {
              toast.success('Tile images saved successfully!');
              onDataChange?.({ tiles: payload });
              setFormValues(values.tiles);
              onNext?.();
            } else toast.error('Failed to save tiles.');
          } catch {
            toast.error('Something went wrong.');
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ values, setFieldValue, isSubmitting }) => (
          <Form>
            {/* Tabs with remove cross and capitalized display */}
            <div className="mb-4 flex gap-2 flex-wrap">
              {tabs.map(tab => (
                <div key={tab} className="relative">
                  <button
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1 rounded-lg text-sm pr-6 ${
                      activeTab === tab
                        ? 'bg-[#6F4E37] text-white'
                        : 'border border-[#6F4E37] text-[#6F4E37]'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveTab(tab, setFieldValue, values)}
                    className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs hover:bg-red-600 shadow-md"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <div className="flex items-center gap-2 mt-2">
                <input
                  value={newTabName}
                  onChange={e => setNewTabName(e.target.value)}
                  placeholder="New Tab"
                  className="border p-1 text-sm rounded-md"
                  onKeyPress={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTab(setFieldValue, values);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleAddTab(setFieldValue, values)}
                  className="p-1 bg-[#6F4E37] text-white rounded-full hover:bg-[#5c3f2c] transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div
              className="border border-dashed p-6 text-center bg-white rounded-lg mb-4 cursor-pointer hover:border-[#6F4E37] transition"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={e => handleUpload(e, setFieldValue, values)}
            >
              <Upload className="w-8 h-8 mx-auto text-[#6F4E37]" />
              <p className="text-gray-600 text-sm">Click or drag to upload images</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={e => handleUpload(e, setFieldValue, values)}
              />
            </div>

            {activeTab && values.tiles?.[activeTab]?.length > 0 && (
              <DndProvider backend={HTML5Backend}>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
                  {values.tiles[activeTab].map((tile, index) => (
                    <Tile
                      key={tile.uniqueId}
                      tile={tile}
                      index={index}
                      moveTile={(from, to) => moveTile(from, to, setFieldValue, values)}
                      handleRemove={idx => handleRemoveTile(idx, setFieldValue, values)}
                    />
                  ))}
                </div>
              </DndProvider>
            )}

            <div className="text-right">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-[#6F4E37] text-white rounded-md hover:bg-[#5c3f2c] transition disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Save Tiles'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default TilesPlaceConfig;