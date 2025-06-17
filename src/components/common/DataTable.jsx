import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

// This is our main Table component that can be reused across the application
const DataTable = ({
  data = [],
  columns = [],
  title = '',
  showSearch = true,
  onSearch,
  searchPlaceholder = 'Search...',
  emptyStateMessage = 'No data available',
  rowsPerPageOptions = [10, 25, 50, 100],
  defaultRowsPerPage = 10,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery) return data;

    const searchTerms = searchQuery
      .toLowerCase()
      .split(' ')
      .filter(term => term.length > 0);
    if (searchTerms.length === 0) return data;

    return data.filter(item => {
      return searchTerms.every(term => {
        return Object.values(item).some(value => {
          if (value === null || value === undefined) return false;
          return String(value).toLowerCase().includes(term);
        });
      });
    });
  }, [data, searchQuery]);

  // Calculate pagination values based on filtered data
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalItems);
  const currentData = filteredData.slice(startIndex, endIndex);

  // Handle search input change
  const handleSearchChange = e => {
    const query = e.target.value;
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
    if (onSearch) {
      onSearch(query);
    }
  };

  // Handle page change
  const goToPage = page => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Handle rows per page change
  const handleRowsPerPageChange = value => {
    setRowsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page when changing rows per page
  };

  return (
    <div className="w-full p-6 rounded-lg shadow-sm bg-[#FFF5EE]">
      {/* Table Header with Search and Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="relative w-full sm:w-64 text-white">
          {showSearch && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6F4E37] h-4 w-4 " />
              <Input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 pr-4 py-2 w-full text-sm hover:bg-white text-black h-10 bg-white  "
              />
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          {title && <TableCaption>{title}</TableCaption>}
          <TableHeader>
            <TableRow className="bg-[#6F4E37] hover:bg-[#6F4E37] cursor-default">
              {columns.map((column, index) => (
                <TableHead
                  key={index}
                  className={`border border-grey-500 font-medium text-white ${column?.className ?? ''}`}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white">
            {currentData.length > 0 ? (
              currentData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((column, colIndex) => (
                    <TableCell key={`${rowIndex}-${colIndex}`} className="border border-grey-400">
                      {column.accessor ? row[column.accessor] : column.cell(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center px-4 py-4 text-gray-500">
                  {searchQuery ? 'No results found matching your search.' : emptyStateMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Rows per page:</span>
          <Select value={rowsPerPage.toString()} onValueChange={handleRowsPerPageChange}>
            <SelectTrigger className="w-20 h-8 bg-[#DADADA]">
              <SelectValue placeholder={rowsPerPage} />
            </SelectTrigger>
            <SelectContent>
              {rowsPerPageOptions.map(option => (
                <SelectItem key={option} value={option.toString()}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-1">
          <div className="text-sm text-gray-500 mr-4 ">
            {totalItems > 0 ? `${startIndex + 1}-${endIndex} of ${totalItems}` : '0 results'}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-8 w-8 cursor-pointer bg-[#DADADA]"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="h-8 cursor-pointer w-8 bg-[#DADADA]"
          >
            <ChevronRight className="h-4 w-4 " />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
