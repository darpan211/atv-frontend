import React, { useState } from 'react';
import img from '../../assets/Tiles6.png';
import img1 from '../../assets/Tiles1.png';
import img2 from '../../assets/Tiles2.png';
import img3 from '../../assets/Tiles3.png';
import img4 from '../../assets/Tiles4.png';
import img5 from '../../assets/Tiles5.png';
import DeleteConfirmationModal from '../common/DeleteConfirmationModal';
import MainAddTiles from './MainAddTiles';

const TileCard = () => {
  const [selectedTile, setSelectedTile] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [tileToDelete, setTileToDelete] = useState(null);

  const tilesData = [
    {
      id: 1,
      image: img,
      title: 'Tiles Name',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod repudiandae tempora velit reprehenderit fugiat illo consequuntur sapiente cum harum aperiam. Totam error, vitae quisquam quaerat at esse necessitatibus ab assumenda?',
      series: 'Series A',
      category: 'Wall',
      suitablePlace: 'Kitchen',
      size: '300x300',
      status: 'Active',
    },
    {
      id: 2,
      image: img1,
      title: 'Tiles Name',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod repudiandae tempora velit reprehenderit fugiat illo consequuntur sapiente cum harum aperiam. Totam error, vitae quisquam quaerat at esse necessitatibus ab assumenda?',
      series: 'Series B',
      category: 'Floor',
      suitablePlace: 'Living Room',
      size: '600x600',
      status: 'Active',
    },
    {
      id: 3,
      image: img2,
      title: 'Tiles Name',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod repudiandae tempora velit reprehenderit fugiat illo consequuntur sapiente cum harum aperiam. Totam error, vitae quisquam quaerat at esse necessitatibus ab assumenda?',
      series: 'Series C',
      category: 'Bathroom',
      suitablePlace: 'Bathroom',
      size: '300x600',
      status: 'Active',
    },
    {
      id: 4,
      image: img3,
      title: 'Tiles Name',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod repudiandae tempora velit reprehenderit fugiat illo consequuntur sapiente cum harum aperiam. Totam error, vitae quisquam quaerat at esse necessitatibus ab assumenda?',
      series: 'Series D',
      category: 'Outdoor',
      suitablePlace: 'Balcony',
      size: '400x400',
      status: 'Active',
    },
    {
      id: 5,
      image: img4,
      title: 'Tiles Name',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod repudiandae tempora velit reprehenderit fugiat illo consequuntur sapiente cum harum aperiam. Totam error, vitae quisquam quaerat at esse necessitatibus ab assumenda?',
      series: 'Series E',
      category: 'Kitchen',
      suitablePlace: 'Backsplash',
      size: '200x200',
      status: 'Active',
    },
    {
      id: 6,
      image: img5,
      title: 'Tiles Name',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod repudiandae tempora velit reprehenderit fugiat illo consequuntur sapiente cum harum aperiam. Totam error, vitae quisquam quaerat at esse necessitatibus ab assumenda?',
      series: 'Series F',
      category: 'Living Room',
      suitablePlace: 'Accent Wall',
      size: '450x450',
      status: 'Active',
    },
  ];

  const handleDelete = () => {
    console.log('Deleted:', tileToDelete);
    setShowDeleteConfirm(false);
    setTileToDelete(null);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tilesData.map(tile => (
            <div
              key={tile.id}
              onClick={() => setSelectedTile(tile)}
              className="cursor-pointer bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition duration-300"
            >
              <div className="flex flex-col xl:flex-row gap-5 items-start">
                <div className="w-full xl:w-[164px] h-[200px] xl:h-[164px] overflow-hidden rounded-lg border border-gray-300 bg-gray-100">
                  <img
                    src={tile.image}
                    alt={tile.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">{tile.title}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-3 overflow-hidden">
                    {tile.description}
                  </p>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p>
                      <span className="font-medium">Series: </span> {tile.series}
                    </p>
                    <p>
                      <span className="font-medium">Category:</span> {tile.category}
                    </p>
                    <p>
                      <span className="font-medium">Suitable Place:</span> {tile.suitablePlace}
                    </p>
                    <p>
                      <span className="font-medium">Size:</span> {tile.size}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tile Details Modal */}
        {selectedTile && (
          <MainAddTiles
            tile={selectedTile}
            onClose={() => setSelectedTile(null)}
            onDelete={() => {
              setTileToDelete(selectedTile);
              setSelectedTile(null);
              setShowDeleteConfirm(true);
            }}
            onEdit={() => console.log('Edit clicked:', selectedTile)}
          />
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <DeleteConfirmationModal
            tile={tileToDelete} // <- pass the tile object
            onCancel={() => {
              setShowDeleteConfirm(false);
              setTileToDelete(null);
            }}
            onConfirm={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default TileCard;
