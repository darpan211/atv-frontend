import { useFormik } from 'formik';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ListView({ title, addPath, placeholder, allItems }) {
  const [filteredItems, setFilteredItems] = useState < any > allItems;
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { search: '' },
    onSubmit: values => {
      const searchVal = values.search.toLowerCase();
      const filtered = allItems.filter(item => item.toLowerCase().includes(searchVal));
      setFilteredItems(filtered);
    },
  });

  const handleAddClick = () => navigate(addPath);

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
        <Button onClick={handleAddClick} className="bg-[#6F4E37] text-white hover:bg-[#a98f7d]">
          + Add
        </Button>
      </div>
      <div className="bg-[#FFF5EE] p-4 rounded-lg">
        <div className="overflow-x-auto">
          <form onSubmit={formik.handleSubmit} className="mb-4 max-w-sm relative">
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
                          {/* Actions (edit/delete icons) */}
                          <span>Edit</span>
                          <span>Delete</span>
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
          {/* Footer */}
          <div className="flex justify-between items-center mt-4 text-sm">
            <div className="flex items-center space-x-2">
              <span>Rows per page:</span>
              <select className="border bg-[#DADADA] border-gray-300 rounded px-2 py-1">
                <option>10</option>
                <option>20</option>
                <option>50</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <span>
                1–{filteredItems.length} of {filteredItems.length}
              </span>
              <button className="px-2 py-1 rounded text-gray-500 hover:bg-gray-200">{`<`}</button>
              <button className="px-2 py-1 rounded text-gray-500 hover:bg-gray-200">{`>`}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
