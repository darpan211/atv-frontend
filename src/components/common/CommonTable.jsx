import React, { useState, useEffect } from 'react';

const CommonTable = ({ type, data, onEdit, onDelete }) => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Sync incoming data
  useEffect(() => {
    setItems(data);
    setFilteredItems(data);
    setCurrentPage(1);
  }, [data]);

  // Filter on search term change
  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();
    const filtered = items.filter(item => item[type]?.toLowerCase().includes(lowerSearch));
    setFilteredItems(filtered);
    setCurrentPage(1);
  }, [searchTerm, items, type]);

  const totalPages = Math.ceil(filteredItems.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="bg-[#FFF5EE] p-4 rounded-lg">
      <div className="overflow-x-auto">
        {/* Search Input (CSS Unchanged) */}
        <div className="mb-4 max-w-sm relative">
          <svg
            style={{ width: '15px', height: '15px' }}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6F4E37] pointer-events-none"
            viewBox="0 0 17 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.6629 11.6759L16 16M13.5 7.25C13.5 10.7017 10.7017 13.5 7.25 13.5C3.79822 13.5 1 10.7017 1 7.25C1 3.79822 3.79822 1 7.25 1C10.7017 1 13.5 3.79822 13.5 7.25Z"
              stroke="#6F4E37"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <input
            type="text"
            placeholder={`Search ${type}`}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-[303px] h-[35px] pl-9 pr-3 py-2 rounded border bg-white border-gray-300 focus:outline-none"
          />
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg shadow border border-gray-200">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#6F4E37] text-white">
                <th className="text-left px-4 py-2 border-r border-gray-500">Name</th>
                <th className="text-left px-4 py-2 w-32">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white text-[14px]">
              {paginatedItems.length > 0 ? (
                paginatedItems.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-100">
                    <td className="px-4 py-2 border-r border-gray-300">{item[type]}</td>
                    <td className="px-4 py-2">
                      <div className="flex space-x-3 items-center">
                        <button className="cursor-pointer" onClick={() => onEdit(item)}>
                          {' '}
                          <svg
                            width="25"
                            height="25"
                            viewBox="0 0 25 25"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11.5263 23.3684H22.7105M19.421 10.2105L14.1579 4.94736M19.421 10.2105L23.3684 6.26314L18.1052 1L14.1579 4.94736M19.421 10.2105L18.1052 11.5263M14.1579 4.94736L5.60525 13.5M2.31579 16.7894L1 18.1052V23.3684H6.26314L14.1579 15.4736"
                              stroke="#4D4D4D"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                        <button className="cursor-pointer" onClick={() => onDelete(item._id)}>
                          <svg
                            width="25"
                            height="27"
                            viewBox="0 0 25 27"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M9.70117 13.5V20.4444" stroke="#6F4E37" strokeWidth="2" />
                            <path d="M15.2573 13.5V20.4444" stroke="#6F4E37" strokeWidth="2" />
                            <path d="M1.36816 6.55566H23.5903" stroke="#6F4E37" strokeWidth="2" />
                            <path
                              d="M4.14551 10.7222V21.8333C4.14551 24.1345 6.01099 25.9999 8.31216 25.9999H16.6455C18.9467 25.9999 20.8121 24.1345 20.8121 21.8333V10.7222"
                              stroke="#6F4E37"
                              strokeWidth="2"
                            />
                            <path
                              d="M8.31299 3.77777C8.31299 2.24365 9.55664 1 11.0908 1H13.8685C15.4027 1 16.6463 2.24365 16.6463 3.77777V6.55554H8.31299V3.77777Z"
                              stroke="#6F4E37"
                              strokeWidth="2"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="text-center px-4 py-4 text-gray-500">
                    No items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 text-sm">
        <div className="flex items-center space-x-2">
          <span>Rows per page:</span>
          <select
            value={rowsPerPage}
            onChange={e => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border bg-[#DADADA] border-gray-300 rounded px-2 py-1"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <span>
            {filteredItems.length === 0
              ? '0–0'
              : `${startIndex + 1}–${Math.min(
                  startIndex + rowsPerPage,
                  filteredItems.length
                )}`}{' '}
            of {filteredItems.length}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-2 py-1 rounded text-gray-500 hover:bg-gray-200 disabled:opacity-50"
          >
            {'<'}
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-2 py-1 rounded text-gray-500 hover:bg-gray-200 disabled:opacity-50"
          >
            {'>'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommonTable;
