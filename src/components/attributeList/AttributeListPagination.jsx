import { useAttributeList } from './AttributeList';

export const AttributeListPagination = () => {
  const { currentPage, setCurrentPage, totalPages } = useAttributeList();

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-end mt-4 space-x-2">
      <button
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
      >
        Prev
      </button>
      <span className="px-2 py-1">
        Page {currentPage} of {totalPages}
      </span>
      <button
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};
