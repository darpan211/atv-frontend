import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Upload, X, Plus, Edit2, Check } from 'lucide-react';

const validationSchema = Yup.object().shape({
  tiles: Yup.object().test(
    'at-least-one-image-per-tab',
    'At least 1 image is required for each tab',
    function (value) {
      return Object.values(value).every((images) => images.length > 0);
    }
  ),
});

// Draggable Tile Component
const Tile = ({ tile, index, moveTile, handleRemove }) => {
  const ref = useRef(null);
  const [{ isDragging }, drag] = useDrag({
    type: 'TILE',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
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
      <img src={tile} alt={`Tile ${index + 1}`} className="w-full h-full object-cover" />
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

const TilesPlaceConfig = ({ onDataChange, initialData }) => {
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [newTabName, setNewTabName] = useState('');
  const [editingTab, setEditingTab] = useState(null);
  const [editName, setEditName] = useState('');
  const [tileUrls, setTileUrls] = useState({}); // Track URLs for cleanup
  const fileInputRef = useRef(null);
  const [formValues, setFormValues] = useState(initialData?.images || [])


  const saveTiles = async (tiles) => {
    console.log('tiles places images', tiles);
    return new Promise((resolve) => {
      setTimeout(() => resolve({ status: 200 }), 1000);
    });
  };

  // Handle image upload for active tab
  const handleUpload = useCallback(
    (e, setFieldValue, values) => {
      if (!activeTab) {
        toast.error('Please select or create a tab before uploading images!');
        return;
      }
      const files = Array.from(e.target?.files || e.dataTransfer?.files || []);
      if (files.length === 0) {
        toast.error('No files selected!');
        return;
      }
      const validImages = files.filter((file) => file.type.startsWith('image/'));
      if (validImages.length === 0) {
        toast.error('Please select valid image files (e.g., JPG, PNG)!');
        return;
      }
      const newTileUrls = validImages.map((file) => URL.createObjectURL(file));
      setTileUrls((prev) => ({
        ...prev,
        [activeTab]: [...(prev[activeTab] || []), ...newTileUrls],
      }));
      setFieldValue(`tiles.${activeTab}`, [...(values.tiles[activeTab] || []), ...newTileUrls]);
      if (e.target) e.target.value = null;
    },
    [activeTab]
  );

  // Handle drag-and-drop reordering
  const moveTile = useCallback(
    (fromIndex, toIndex, setFieldValue, values) => {
      if (!activeTab) return;
      const updatedTiles = [...(values.tiles[activeTab] || [])];
      const updatedUrls = [...(tileUrls[activeTab] || [])];
      const [movedTile] = updatedTiles.splice(fromIndex, 1);
      const [movedUrl] = updatedUrls.splice(fromIndex, 1);
      updatedTiles.splice(toIndex, 0, movedTile);
      updatedUrls.splice(toIndex, 0, movedUrl);
      setFieldValue(`tiles.${activeTab}`, updatedTiles);
      setTileUrls((prev) => ({ ...prev, [activeTab]: updatedUrls }));
    },
    [activeTab, tileUrls]
  );

  // Handle new tab creation
  const handleAddTab = useCallback(
    (setFieldValue) => {
      if (newTabName.trim() && !tabs.includes(newTabName.toLowerCase())) {
        const newTab = newTabName.toLowerCase();
        setTabs([...tabs, newTab]);
        setFieldValue(`tiles.${newTab}`, []);
        setTileUrls((prev) => ({ ...prev, [newTab]: [] }));
        setActiveTab(newTab);
        setNewTabName('');
      } else {
        toast.error('Tab name already exists or is empty!');
      }
    },
    [newTabName, tabs]
  );

  // Handle tab removal
  const handleRemoveTab = useCallback(
    (tabToRemove, setFieldValue) => {
      if (tabs.length <= 1) {
        toast.error('Cannot remove the last tab!');
        return;
      }
      // Clean up URLs for the removed tab
      (tileUrls[tabToRemove] || []).forEach(URL.revokeObjectURL);
      setTileUrls((prev) => {
        const newUrls = { ...prev };
        delete newUrls[tabToRemove];
        return newUrls;
      });
      if (activeTab === tabToRemove) setActiveTab(tabs.find((t) => t !== tabToRemove) || null);
      setTabs(tabs.filter((tab) => tab !== tabToRemove));
      setFieldValue(`tiles.${tabToRemove}`, undefined);
    },
    [tabs, activeTab, tileUrls]
  );

  // Handle tab renaming
  const handleRenameTab = useCallback(
    (tabToRename, setFieldValue, values) => {
      if (editName.trim() && !tabs.includes(editName.toLowerCase()) && editName !== tabToRename) {
        setFieldValue(`tiles.${editName.toLowerCase()}`, values.tiles[tabToRename]);
        setFieldValue(`tiles.${tabToRename}`, undefined);
        setTileUrls((prev) => ({
          ...prev,
          [editName.toLowerCase()]: prev[tabToRename] || [],
        }));
        setTabs(tabs.map((tab) => (tab === tabToRename ? editName.toLowerCase() : tab)));
        if (activeTab === tabToRename) setActiveTab(editName.toLowerCase());
        setEditingTab(null);
        setEditName('');
      } else {
        toast.error('Invalid or duplicate tab name!');
      }
    },
    [editName, tabs, activeTab]
  );

  // Handle tile removal
  const handleRemoveTile = useCallback(
    (index, setFieldValue, values) => {
      if (window.confirm('Remove this tile?')) {
        const updatedTiles = values.tiles[activeTab].filter((_, i) => i !== index);
        const removedUrl = values.tiles[activeTab][index];
        URL.revokeObjectURL(removedUrl);
        setTileUrls((prev) => ({
          ...prev,
          [activeTab]: prev[activeTab].filter((_, i) => i !== index),
        }));
        setFieldValue(`tiles.${activeTab}`, updatedTiles);
      }
    },
    [activeTab]
  );

  // Cleanup URLs on unmount
  useEffect(() => {
    return () => {
      Object.values(tileUrls).flat().forEach((url) => url && URL.revokeObjectURL(url));
    };
  }, [tileUrls]);

  return (
    <div className="p-4 sm:p-6 bg-[#FFF5EE] min-h-screen bg-grid-white-[0.2]">
      <h2 className="text-xl sm:text-2xl font-bold text-black mb-4">Tile Images</h2>
      <Formik
        initialValues={{ tiles: {} }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          if (!activeTab) {
            toast.error('Please select a tab before saving!');
            setSubmitting(false);
            return;
          }
          try {
            const res = await saveTiles(values.tiles);
            if (res.status === 200) {
              toast.success('Tile images saved successfully!');
              onDataChange?.(values);
              setFormValues(values.tiles);
            } else {
              toast.error('Failed to save tiles.');
            }
          } catch {
            toast.error('Something went wrong. Please try again.');
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ values, setFieldValue, isSubmitting, errors, touched, isValid, dirty }) => (
          <Form>
            {/* Tabs and Add Tab */}
            <div className="mb-6 flex flex-wrap items-center space-x-2 sm:space-x-4 border-b border-gray-200">
              {tabs.map((tab) => (
                <div key={tab} className="relative group flex items-center">
                  {editingTab === tab ? (
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="p-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#6F4E37]"
                      />
                      <button
                        type="button"
                        onClick={() => handleRenameTab(tab, setFieldValue, values)}
                        className="ml-1 p-1 bg-[#6F4E37] text-white rounded-full hover:bg-[#5c3f2c] transition"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      onDoubleClick={() => {
                        setEditingTab(tab);
                        setEditName(tab);
                      }}
                      className={`p-2 text-sm font-medium rounded-lg transition-colors ${
                        activeTab === tab
                          ? 'text-white bg-[#6F4E37] rounded-lg'
                          : 'text-gray-600 hover:text-[#6F4E37] border border-[#6F4E37]'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  )}
                  {tabs.length > 1 && editingTab !== tab && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleRemoveTab(tab, setFieldValue)}
                        className="absolute right-1 top-[-15px] -translate-y-1/2 hidden group-hover:block p-0.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingTab(tab);
                          setEditName(tab);
                        }}
                        className="absolute right-6 top-[-8px] -translate-y-1/2 hidden group-hover:block p-0.5 bg-[#6F4E37] text-white rounded-full hover:bg-[#5c3f2c] transition"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    </>
                  )}
                </div>
              ))}
              <div className="flex items-center my-2">
                <input
                  type="text"
                  value={newTabName}
                  onChange={(e) => setNewTabName(e.target.value)}
                  placeholder="New Tab Name"
                  className="p-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#6F4E37]"
                />
                <button
                  type="button"
                  onClick={() => handleAddTab(setFieldValue)}
                  className="ml-2 p-1 bg-[#6F4E37] text-white rounded-full hover:bg-[#5c3f2c] transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Warning if no tab selected */}
            {!activeTab && (
              <div className="mb-4 text-red-500 text-sm">
                Please create or select a tab before uploading images or saving!
              </div>
            )}

            {/* Drag-and-Drop Area */}
            <div
              className={`border-2 bg-white border-dashed rounded-lg p-6 mb-6 text-center ${
                isDraggingOver ? 'border-[#6F4E37] bg-[#6F4E37]/10' : 'border-[#6F4E37] bg-white'
              } transition-all duration-300 ${!activeTab ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              onDragOver={(e) => {
                e.preventDefault();
                if (activeTab) setIsDraggingOver(true);
              }}
              onDragLeave={() => setIsDraggingOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDraggingOver(false);
                if (activeTab) handleUpload(e, setFieldValue, values);
                else toast.error('Please select or create a tab first!');
              }}
              onClick={() => {
                if (activeTab && fileInputRef.current) fileInputRef.current.click();
              }}
            >
              <Upload className="w-8 h-8 text-[#6F4E37] mx-auto mb-2" />
              <p className="text-gray-600 text-sm">
                Drag & drop images or click to select (Min. 1 image)
              </p>
              <input
                type="file"
                accept="image/*"
                multiple
                ref={fileInputRef}
                className="hidden"
                onChange={(e) => handleUpload(e, setFieldValue, values)}
              />
            </div>

            {/* Error Message */}
            {activeTab && touched.tiles && errors.tiles && (
              <div className="text-red-500 text-sm mb-4">
                {errors.tiles || 'At least 1 image required for this tab'}
              </div>
            )}

            {/* Tile Grid Preview */}
            {activeTab && values.tiles[activeTab]?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-black mb-4">Tile Preview</h3>
                <DndProvider backend={HTML5Backend}>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {values.tiles[activeTab].map((tile, index) => (
                      <Tile
                        key={`${tile}-${index}`}
                        tile={tile}
                        index={index}
                        moveTile={(from, to) => moveTile(from, to, setFieldValue, values)}
                        handleRemove={(idx) => handleRemoveTile(idx, setFieldValue, values)}
                      />
                    ))}
                  </div>
                </DndProvider>
              </div>
            )}

            {/* Submit Button */}
            <div className="text-right mt-4">
              <button
                type="submit"
                disabled={isSubmitting || !activeTab || !isValid || !dirty}
                className="px-4 sm:px-6 py-2 bg-[#6F4E37] text-white rounded-md hover:bg-[#5c3f2c] transition disabled:opacity-50 text-sm sm:text-base"
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