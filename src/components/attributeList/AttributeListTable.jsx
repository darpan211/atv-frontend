import { useAttributeList } from './AttributeList';

export function AttributeListTable() {
  const { filteredItems } = useAttributeList();

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
                <td className="px-4 py-2 border-r border-gray-300">{item.category}</td>
                <td className="px-4 py-2">
                  <div className="flex space-x-3 items-center">
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
  );
}
