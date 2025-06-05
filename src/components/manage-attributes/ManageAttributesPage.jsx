import { useFormik } from 'formik';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useState, createContext, useContext } from 'react';

// Create a context for shared data
const ManageAttributesContext = createContext();

export function ManageAttributesPage({ children }) {
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  const formik = useFormik({
    initialValues: { search: '' },
    onSubmit: values => {
      const val = values.search.toLowerCase();
      setSearchValue(val);
      // Filtering logic will be done by children or here later
    },
  });

  const value = {
    filteredItems,
    setFilteredItems,
    formik,
    searchValue,
  };

  return (
    <ManageAttributesContext.Provider value={value}>
      <div className="p-6 bg-white min-h-screen">{children}</div>
    </ManageAttributesContext.Provider>
  );
}

// Reusable hook
export function useManageAttributes() {
  return useContext(ManageAttributesContext);
}

///
import { useManageAttributes } from './ManageAttributesPage'; // already defined
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useFormikContext } from 'formik';

ManageAttributesPage.Header = function Header({ title, buttonLabel, navigateTo }) {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
      <Button
        onClick={() => navigate(navigateTo)}
        className="bg-[#6F4E37] cursor-pointer text-white hover:bg-[#a98f7d]"
      >
        {buttonLabel}
      </Button>
    </div>
  );
};

ManageAttributesPage.SearchBox = function SearchBox({ placeholder, data }) {
  const { formik, setFilteredItems, searchValue } = useManageAttributes();

  const handleSubmit = e => {
    e.preventDefault();
    formik.handleSubmit();
    const val = formik.values.search.toLowerCase();
    const filtered = data.filter(item => item.toLowerCase().includes(val));
    setFilteredItems(filtered);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 max-w-sm relative">
      <svg
        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6F4E37]"
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
        name="search"
        placeholder={placeholder}
        value={formik.values.search}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className="w-[303px] h-[35px] pl-9 pr-3 py-2 rounded border bg-white border-gray-300 focus:outline-none"
      />
    </form>
  );
};

ManageAttributesPage.Table = function Table() {
  const { filteredItems } = useManageAttributes();

  return (
    <div className="overflow-hidden rounded-lg shadow border border-gray-200">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#6F4E37] text-white">
            <th className="text-left px-4 py-2 border-r border-gray-500">Name</th>
            <th className="text-left px-4 py-2 w-32">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white text-[14px]">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <tr key={index} className="border-b hover:bg-gray-100">
                <td className="px-4 py-2 border-r border-gray-300">{item}</td>
                <td className="px-4 py-2">
                  <div className="flex space-x-3 items-center">
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

                    <svg
                      width="25"
                      height="27"
                      viewBox="0 0 25 27"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.70117 13.5V20.4444"
                        stroke="#6F4E37"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M15.2573 13.5V20.4444"
                        stroke="#6F4E37"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M1.36816 6.55566H23.5903"
                        stroke="#6F4E37"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M4.14551 10.7222V21.8333C4.14551 24.1345 6.01099 25.9999 8.31216 25.9999H16.6455C18.9467 25.9999 20.8121 24.1345 20.8121 21.8333V10.7222"
                        stroke="#6F4E37"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8.31299 3.77777C8.31299 2.24365 9.55664 1 11.0908 1H13.8685C15.4027 1 16.6463 2.24365 16.6463 3.77777V6.55554H8.31299V3.77777Z"
                        stroke="#6F4E37"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
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
  );
};

ManageAttributesPage.Pagination = function Pagination() {
  const { currentPage, setCurrentPage, filteredItems, itemsPerPage } = useManageAttributes();

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const goToPage = page => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-end mt-4 space-x-2">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 border rounded cursor-pointer ${
          currentPage === 1 ? 'text-gray-400 border-gray-300' : 'text-[#6F4E37] border-[#6F4E37]'
        }`}
      >
        Prev
      </button>

      {[...Array(totalPages)].map((_, index) => {
        const page = index + 1;
        return (
          <button
            key={page}
            onClick={() => goToPage(page)}
            className={`px-3 py-1 border rounded ${
              currentPage === page
                ? 'bg-[#6F4E37] text-white border-[#6F4E37]'
                : 'text-[#6F4E37] border-[#6F4E37]'
            }`}
          >
            {page}
          </button>
        );
      })}

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 border rounded cursor-pointer ${
          currentPage === totalPages
            ? 'text-gray-400 border-gray-300'
            : 'text-[#6F4E37] border-[#6F4E37]'
        }`}
      >
        Next
      </button>
    </div>
  );
};
