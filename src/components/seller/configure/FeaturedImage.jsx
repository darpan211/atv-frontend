import React, { useState, useCallback, useRef, useEffect } from "react"
import { Formik, Form, Field } from "formik"
import * as Yup from "yup"
import { toast } from "react-toastify"
import { Upload, X, Plus, Trash2 } from "lucide-react"

const validationSchema = Yup.object().shape({
  tiles: Yup.array()
    .of(
      Yup.object().shape({
        image: Yup.string().required("Image is required"),
        name: Yup.string().max(50, "Name must be 50 characters or less"),
        description: Yup.string().max(150, "Description must be 150 characters or less"),
      })
    )
    .min(1, "At least 1 tile is required")
    .max(6, "Maximum 6 tiles allowed"),
})

const FeaturedImage = ({ onDataChange, initialData }) => {
  const [formValues, setFormValues] = useState({
    tiles: initialData?.tiles || [{ image: "", name: "", description: "" }],
  })
  const fileInputRefs = useRef([])

  // Cleanup URLs on unmount
  useEffect(() => {
    return () => {
      formValues.tiles.forEach((tile) => tile.image && URL.revokeObjectURL(tile.image))
    }
  }, [formValues.tiles])

  // Sync with initialData
  useEffect(() => {
    if (initialData?.tiles && JSON.stringify(initialData.tiles) !== JSON.stringify(formValues.tiles)) {
      setFormValues({ tiles: initialData.tiles })
    }
  }, [initialData])

  const saveTiles = async (tiles) => {
    console.log("Feature Images:", tiles)
    return new Promise((resolve) => {
      setTimeout(() => resolve({ status: 200 }), 500) // Reduced timeout for performance
    })
  }

  // Handle image upload for a specific tile
  const handleImageUpload = useCallback((index, file, setFieldValue) => {
    if (!file) {
      toast.error("No file selected!")
      return
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (e.g., JPG, PNG)!")
      return
    }
    const imageUrl = URL.createObjectURL(file)
    setFieldValue(`tiles[${index}].image`, imageUrl)
  }, [])

  // Handle file input change
  const handleFileInputChange = useCallback(
    (index, e, setFieldValue) => {
      const file = e.target.files?.[0]
      handleImageUpload(index, file, setFieldValue)
      e.target.value = null
    },
    [handleImageUpload]
  )

  // Handle drag and drop
  const handleDrop = useCallback(
    (index, e, setFieldValue) => {
      e.preventDefault()
      e.stopPropagation()
      const file = e.dataTransfer.files?.[0]
      handleImageUpload(index, file, setFieldValue)
    },
    [handleImageUpload]
  )

  // Handle drag over
  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  // Handle image removal
  const handleImageRemove = useCallback(
    (index, setFieldValue, values) => {
      if (window.confirm("Remove this image?")) {
        const removedUrl = values.tiles[index].image
        if (removedUrl) URL.revokeObjectURL(removedUrl)
        setFieldValue(`tiles[${index}].image`, "")
      }
    },
    []
  )

  // Handle tile deletion
  const handleDeleteTile = useCallback(
    (index, values, setFieldValue) => {
      if (values.tiles.length <= 1) {
        toast.error("At least one tile is required!")
        return
      }
      if (window.confirm("Delete this tile?")) {
        const removedUrl = values.tiles[index].image
        if (removedUrl) URL.revokeObjectURL(removedUrl)
        setFieldValue(
          "tiles",
          values.tiles.filter((_, i) => i !== index)
        )
        fileInputRefs.current = fileInputRefs.current.filter((_, i) => i !== index)
      }
    },
    []
  )

  // Add new tile
  const addTile = useCallback(
    (values, setFieldValue) => {
      if (values.tiles.length >= 6) {
        toast.error("Maximum 6 images allowed!")
        return
      }
      setFieldValue("tiles", [...values.tiles, { image: "", name: "", description: "" }])
      fileInputRefs.current[values.tiles.length] = React.createRef()
    },
    []
  )

  return (
    <div className="p-4 sm:p-6 bg-[#FFF5EE] min-h-screen">
      <h2 className="text-xl sm:text-2xl font-bold text-black mb-4">Featured Image Configuration</h2>
      <Formik
        initialValues={{
          tiles: initialData?.tiles || [{ image: "", name: "", description: "" }],
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const res = await saveTiles(values.tiles)
            if (res.status === 200) {
              toast.success("Featured image section saved successfully!")
              setFormValues({ tiles: values.tiles })
              onDataChange?.({ tiles: values.tiles })
            } else {
              toast.error("Failed to save featured image section.")
            }
          } catch {
            toast.error("Something went wrong. Please try again.")
          } finally {
            setSubmitting(false)
          }
        }}
      >
        {({ values, setFieldValue, isSubmitting, errors, touched, isValid, dirty }) => (
          <Form>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {values.tiles.map((tile, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 shadow-md rounded-lg p-4 animate-fade-in w-full max-w-sm mx-auto sm:max-w-none relative"
                >
                  <button
                    type="button"
                    onClick={() => handleDeleteTile(index, values, setFieldValue)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition disabled:opacity-50"
                    disabled={values.tiles.length <= 1}
                    aria-label={`Delete tile ${index + 1}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="mb-4">
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1"
                      htmlFor={`tile-image-${index}`}
                    >
                      Image {index + 1}
                    </label>
                    <div
                      className={`border-2 border-dashed rounded-lg p-4 text-center ${
                        values.tiles[index].image
                          ? "border-gray-300"
                          : "border-[#6F4E37] hover:border-[#5c3f2c]"
                      } transition-all duration-300 cursor-pointer`}
                      onClick={() => fileInputRefs.current[index]?.click()}
                      onDrop={(e) => handleDrop(index, e, setFieldValue)}
                      onDragOver={handleDragOver}
                      role="region"
                      aria-label={`Upload image for tile ${index + 1}`}
                    >
                      {values.tiles[index].image ? (
                        <div className="relative">
                          <img
                            src={values.tiles[index].image}
                            alt={`Image ${index + 1}`}
                            className="w-full h-32 object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleImageRemove(index, setFieldValue, values)
                            }}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition"
                            aria-label={`Remove image for tile ${index + 1}`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-[#6F4E37] mx-auto mb-2" />
                          <p className="text-gray-600 text-sm">Click or drag to upload image</p>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        ref={el => (fileInputRefs.current[index] = el)}
                        className="hidden"
                        onChange={(e) => handleFileInputChange(index, e, setFieldValue)}
                      />
                    </div>
                    {touched.tiles?.[index]?.image && errors.tiles?.[index]?.image && (
                      <div className="text-red-500 text-sm mt-1">{errors.tiles[index].image}</div>
                    )}
                  </div>

                  <div className="mb-4">
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1"
                      htmlFor={`tile-name-${index}`}
                    >
                      Name {index + 1}
                    </label>
                    <Field
                      id={`tile-name-${index}`}
                      name={`tiles[${index}].name`}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#6F4E37] text-sm"
                      aria-describedby={
                        touched.tiles?.[index]?.name && errors.tiles?.[index]?.name
                          ? `tile-name-error-${index}`
                          : undefined
                      }
                    />
                    {touched.tiles?.[index]?.name && errors.tiles?.[index]?.name && (
                      <div id={`tile-name-error-${index}`} className="text-red-500 text-sm mt-1">
                        {errors.tiles[index].name}
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1"
                      htmlFor={`tile-description-${index}`}
                    >
                      Description {index + 1}
                    </label>
                    <Field
                      id={`tile-description-${index}`}
                      name={`tiles[${index}].description`}
                      as="textarea"
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#6F4E37] text-sm"
                      rows="3"
                      aria-describedby={
                        touched.tiles?.[index]?.description && errors.tiles?.[index]?.description
                          ? `tile-description-error-${index}`
                          : undefined
                      }
                    />
                    {touched.tiles?.[index]?.description && errors.tiles?.[index]?.description && (
                      <div id={`tile-description-error-${index}`} className="text-red-500 text-sm mt-1">
                        {errors.tiles[index].description}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <button
                type="button"
                onClick={() => addTile(values, setFieldValue)}
                disabled={values.tiles.length >= 6}
                className="flex items-center px-4 py-2 bg-[#6F4E37] text-white rounded-md hover:bg-[#5c3f2c] transition disabled:opacity-50"
                aria-label="Add new tile"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Image
              </button>
            </div>

            {errors.tiles && typeof errors.tiles === "string" && (
              <div className="text-red-500 text-sm mt-2">{errors.tiles}</div>
            )}

            <div className="text-right mt-6">
              <button
                type="submit"
                disabled={isSubmitting || !isValid || !dirty}
                className="flex items-center px-6 py-2 bg-[#6F4E37] text-white rounded-md hover:bg-[#5c3f2c] transition disabled:opacity-50"
                aria-label="Save featured images configuration"
              >
                <X className="w-4 h-4 mr-2" />
                {isSubmitting ? "Saving..." : "Save Step"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default FeaturedImage