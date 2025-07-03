import React, { useState, useCallback, useMemo } from "react"
import { ToastContainer, toast } from "react-toastify"
import {
  ChevronLeft,
  ChevronRight,
  Check,
  FileText,
  ImageIcon,
  LayoutGrid,
  Contact,
  Star,
  CheckCircle,
} from "lucide-react"
import SliderConfig from "./configure/SliderConfig"
import TilesPlaceConfig from "./configure/TilesPlaceConfig"
import FeaturedImage from "./configure/FeaturedImage"
import ContactConfig from "./configure/ContactConfig"
import TilesInfoConfig from "./configure/TilesInfoConfig"
import axiosHandler from "@/services/axiosHandler"

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const MultiStepConfigure = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState(new Set())
  const [formData, setFormData] = useState({
    slider: null,
    tilePlaces: null,
    featured: null,
    tilesInfo: null,
    contact: null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const steps = useMemo(() => [
    {
      id: "slider",
      title: "Slider Images",
      description: "Configure your main slider images",
      icon: ImageIcon,
      component: SliderConfig,
    },
    {
      id: "tilePlaces",
      title: "Tiles Places",
      description: "Set up your tile placement configuration",
      icon: LayoutGrid,
      component: TilesPlaceConfig,
    },
    {
      id: "featured",
      title: "Featured Images",
      description: "Add your featured image sections",
      icon: Star,
      component: FeaturedImage,
    },
    {
      id: "tilesInfo",
      title: "Tiles Information",
      description: "Configure tiles features and images",
      icon: FileText,
      component: TilesInfoConfig,
    },
    {
      id: "contact",
      title: "Contact Information",
      description: "Set up your contact details",
      icon: Contact,
      component: ContactConfig,
    },
  ], [])

  const handleStepData = useCallback(
    (stepId, data) => {
      if (data) {
        setFormData((prev) => ({
          ...prev,
          [stepId]: data,
        }))
        setCompletedSteps((prev) => {
          const newSet = new Set(prev)
          const stepIndex = steps.findIndex((s) => s.id === stepId)
          newSet.add(stepIndex)
          return newSet
        })
      }
    },
    [steps]
  )

  const handleNext = useCallback(() => {
    const currentStepId = steps[currentStep].id
    if (currentStep < steps.length && formData[currentStepId] && completedSteps.has(currentStep)) {
      setCurrentStep((prev) => prev + 1)
    } else {
      toast.error("Please save the current step before proceeding")
    }
  }, [currentStep, formData, completedSteps, steps])

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }, [currentStep])

  const handleStepClick = useCallback(
    (stepIndex) => {
      if (isStepAccessible(stepIndex)) {
        setCurrentStep(stepIndex)
      }
    },
    [completedSteps]
  )

  const handleFinalSubmit = async () => {
    if (completedSteps.size < steps.length) {
      toast.error("Please complete all steps before submitting");
      return;
    }

    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();

      //Contact Info (flat keys)
      formDataToSend.append("name", formData.contact.name);
      formDataToSend.append("email", formData.contact.email);
      formDataToSend.append("phone", formData.contact.phone);
      formDataToSend.append("address", formData.contact.address);
      formDataToSend.append("website", formData.contact.website);
      formDataToSend.append("socialMediaURL", formData.contact.socialMedia);

      //Tiles Info (flat keys)
      formDataToSend.append("title", formData.tilesInfo.title);
      formDataToSend.append("description", formData.tilesInfo.description);
      formDataToSend.append("features", JSON.stringify(formData.tilesInfo.features));

      //Tiles from tilesInfo.tiles
      if (formData.tilesInfo && Array.isArray(formData.tilesInfo.tiles)) {
        formData.tilesInfo.tiles.forEach((tile, i) => {
          if (tile?.file) {
            formDataToSend.append("tiles", tile.file, `tileInfo${i}.jpg`);
          } else if (tile?.url) {
            formDataToSend.append("tiles_urls", tile.url);
          }
        });
      }

      //Slider Images
      if (formData.slider?.images) {
        formData.slider.images.forEach((img, i) => {
          if (img?.file) {
            formDataToSend.append("slider_image", img.file, `slider_image${i}.jpg`);
          } else if (img?.url) {
            formDataToSend.append("slider_image_urls", img.url);
          }
        });
      }

      //Tiles from tilePlaces.tab1 and tab2
      if (formData.tilePlaces?.tiles) {
        const tileGroups = formData.tilePlaces.tiles;

        Object.entries(tileGroups).forEach(([groupName, groupFiles]) => {
          if (Array.isArray(groupFiles)) {
            groupFiles.forEach((tile, index) => {
              if (tile?.file) {
                formDataToSend.append(groupName, tile.file, `${groupName}_${index}.jpg`);
              } else if (tile?.url) {
                formDataToSend.append(`${groupName}_urls`, tile.url);
              }
            });
          }
        });
      }

      //Featured Images (strictly indexed format image1, name1, description1...)
      if (Array.isArray(formData.featured?.tiles)) {
        let validIndex = 1;
        formData.featured.tiles.forEach((feature, i) => {
          const name = feature?.name?.trim();
          const description = feature?.description?.trim();
          const file = feature?.image?.file;

          if (file && name && description) {
            formDataToSend.append(`image${validIndex}`, file, `feature${validIndex}.jpg`);
            formDataToSend.append(`name${validIndex}`, name);
            formDataToSend.append(`description${validIndex}`, description);
            validIndex++;
          } else {
            console.warn(`Skipped featured.tiles[${i}] — missing file, name, or description`);
          }
        });
      }

      for (let pair of formDataToSend.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await axiosHandler.post(`${BASE_URL}/api/v1/configure/addslider`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(response.data.message || "Configuration saved successfully!");
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error(error.response?.data?.message || "Failed to save configuration. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepCompleted = (stepIndex) => completedSteps.has(stepIndex)
  const isCurrentStep = (stepIndex) => currentStep === stepIndex
  const isStepAccessible = (stepIndex) => {
    if (stepIndex === 0) return true
    return completedSteps.has(stepIndex - 1)
  }

  const progressPercentage = (completedSteps.size / (steps.length + 1)) * 100

  const FinalReview = () => (
    <div className="p-6 bg-[#FFF5EE] min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Review Your Configuration</h2>
          <p className="text-gray-600">Please review all your settings before final submission</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <div className="flex items-center mb-4">
                <div className={`p-2 rounded-lg ${isStepCompleted(index) ? "bg-green-100" : "bg-gray-100"}`}>
                  <step.icon className={`w-5 h-5 ${isStepCompleted(index) ? "text-green-600" : "text-gray-600"}`} />
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-gray-900">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
                {isStepCompleted(index) && <Check className="w-5 h-5 text-green-500 ml-auto" />}
              </div>
              <div className="text-sm text-gray-600">
                {formData[step.id] ? (
                  <span className="text-green-600 font-medium">✓ Configured</span>
                ) : (
                  <span className="text-orange-600 font-medium">⚠ Incomplete</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={handleFinalSubmit}
            disabled={isSubmitting || completedSteps.size < steps.length}
            className="px-8 py-3 bg-[#6F4E37] text-white rounded-lg hover:bg-[#5c3f2c] transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg"
          >
            {isSubmitting ? "Submitting..." : "Submit Configuration"}
          </button>
          {completedSteps.size < steps.length && (
            <p className="text-sm text-orange-600 mt-2">Please complete all steps before submitting</p>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">Configuration Setup</h1>
              <div className="text-sm text-gray-600">
                Step {currentStep + 1} of {steps.length + 1}
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div
                className="bg-[#6F4E37] h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => handleStepClick(index)}
                  disabled={!isStepAccessible(index)}
                  className={`flex flex-col items-center p-2 rounded-lg transition-all ${isCurrentStep(index)
                    ? "bg-[#6F4E37] text-white"
                    : isStepCompleted(index)
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : isStepAccessible(index)
                        ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        : "bg-gray-50 text-gray-400 cursor-not-allowed"
                    }`}
                >
                  <div className="relative">
                    <step.icon className="w-5 h-5" />
                    {isStepCompleted(index) && (
                      <Check className="w-3 h-3 absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-0.5" />
                    )}
                  </div>
                  <span className="text-xs mt-1 hidden sm:block">{step.title}</span>
                </button>
              ))}
              <button
                onClick={() => setCurrentStep(steps.length)}
                disabled={completedSteps.size < steps.length}
                className={`flex flex-col items-center p-2 rounded-lg transition-all ${currentStep === steps.length
                  ? "bg-[#6F4E37] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                <CheckCircle className="w-5 h-5" />
                <span className="text-xs mt-1 hidden sm:block">Review</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStep < steps.length ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-[#6F4E37] rounded-lg">
                  {React.createElement(steps[currentStep].icon, {
                    className: "w-6 h-6 text-white",
                  })}
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-semibold text-gray-900">{steps[currentStep].title}</h2>
                  <p className="text-gray-600">{steps[currentStep].description}</p>
                </div>
              </div>
            </div>

            <div className="p-0">
              {React.createElement(steps[currentStep].component, {
                onDataChange: (data) => handleStepData(steps[currentStep].id, data),
                initialData: formData[steps[currentStep].id],
              })}
            </div>
          </div>
        ) : (
          <FinalReview />
        )}
      </div>

      {currentStep < steps.length && (
        <div className="bg-white border-t border-gray-200 sticky bottom-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </button>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {completedSteps.size} of {steps.length} completed
                </span>
              </div>

              <button
                onClick={handleNext}
                disabled={!formData[steps[currentStep].id] || !completedSteps.has(currentStep)}
                className="flex items-center px-6 py-2 bg-[#6F4E37] text-white rounded-lg hover:bg-[#5c3f2c] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentStep === steps.length - 1 ? "Review" : "Next"}
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  )
}

export default MultiStepConfigure
