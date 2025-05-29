import { useFormik } from 'formik';
import { useAttributeList } from './AttributeList';

export function AttributeListSearch({ placeholder }) {
  const { setFilteredItems } = useAttributeList();

  const formik = useFormik({
    initialValues: { search: '' },
    onSubmit: values => {
      const searchVal = values.search.toLowerCase();
      const dummyData = []; // Replace with real data source
      const filtered = dummyData.filter(item => item.toLowerCase().includes(searchVal));
      setFilteredItems(filtered);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="mb-4 max-w-sm relative">
      <svg
        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6F4E37] pointer-events-none"
        viewBox="0 0 17 17"
        fill="none"
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
}
