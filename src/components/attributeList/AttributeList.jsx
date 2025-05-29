import { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { getCategories } from '@/services/categoryService';

const AttributeListContext = createContext();

export function AttributeList({ children }) {
  const [filteredItems, setFilteredItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getCategories();
        setFilteredItems(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  console.log('Categories Data', filteredItems);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredItems.slice(startIndex, endIndex);
  }, [filteredItems, currentPage, rowsPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredItems.length / rowsPerPage);
  }, [filteredItems.length, rowsPerPage]);

  return (
    <AttributeListContext.Provider
      value={{
        filteredItems,
        setFilteredItems,
        currentPage,
        setCurrentPage,
        rowsPerPage,
        setRowsPerPage,
        paginatedItems,
        totalPages,
      }}
    >
      <div className="p-6 bg-white min-h-screen">{children}</div>
    </AttributeListContext.Provider>
  );
}

export function useAttributeList() {
  const context = useContext(AttributeListContext);
  if (!context) {
    throw new Error('useAttributeList must be used within AttributeList');
  }
  return context;
}
