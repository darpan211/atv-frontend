import { useFormik } from 'formik';

export default function AddAttributeForm({ title, label, buttonText }) {
  const formik = useFormik({
    initialValues: {
      name: '',
    },
    onSubmit: values => {
      console.log('Submitted:', values);
    },
    onReset: () => {
      console.log('Form reset');
    },
  });

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Dynamic Page Title */}
      <h1 className="text-2xl md:text-3xl font-bold mb-4">{title}</h1>

      {/* Form */}
      <div className="bg-[#FFF5EE] p-6 rounded-lg w-full">
        <form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium text-black mb-1">
              {label}
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder={`Enter ${label.toLowerCase()}`}
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-2xl px-4 py-2 border bg-white rounded-md focus:outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-4 items-center mt-6">
            <button
              type="button"
              onClick={() => console.log('Cancel clicked')}
              className="bg-white text-black border px-6 py-2 rounded-md shadow-sm shadow-black hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            <button
              type="reset"
              className="bg-gray-700 text-white px-6 py-2 shadow-sm shadow-black rounded-md hover:bg-gray-800 transition"
            >
              Reset
            </button>

            <button
              type="submit"
              className="bg-[#6F4E37] text-white px-6 py-2 shadow-sm shadow-black rounded-md hover:bg-[#a98f7d] transition"
            >
              {buttonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
