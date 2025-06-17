"use client"
import { useState } from "react"
import { Pencil } from "lucide-react"

const Card = ({ children, className = "" }) => (
  <div className={`rounded-lg border bg-[#FFF5EE] text-black shadow-sm ${className}`}>{children}</div>
)

const CardContent = ({ children, className = "" }) => <div className={`p-4 sm:p-6 lg:p-8 ${className}`}>{children}</div>

const Input = ({ className = "", ...props }) => (
  <input
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6F4E37] focus:border-[#6F4E37] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
)

const Label = ({ children, className = "", ...props }) => (
  <label className={`text-sm font-medium text-gray-700 ${className}`} {...props}>
    {children}
  </label>
)

export default function AdminProfile() {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
  })

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="relative min-h-screen">
      {/* Split background - responsive */}
      <div className="absolute top-0 left-0 w-full h-1/3 sm:h-1/2 bg-[#6F4E37] z-0"></div>
      <div className="absolute top-1/3 sm:top-1/2 left-0 w-full h-2/3 sm:h-1/2 bg-white z-0"></div>

      {/* Content over split background */}
      <div className="relative z-10 flex items-start sm:items-center justify-center p-4 sm:p-6 min-h-screen pt-8 sm:pt-6">
        <div className="w-full max-w-7xl">
          <div className="mb-4 sm:mb-6">
            <h1 className="text-white text-xl sm:text-2xl lg:text-3xl font-semibold">Admin Profile</h1>
          </div>

          <Card className="border border-gray-200 shadow-lg">
            <CardContent>
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                <div className="flex justify-center lg:justify-start flex-shrink-0">
                  <div className="relative inline-block">

                    <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 xl:w-80 xl:h-80 rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-100 relative">
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=320&h=320&fit=crop&crop=face"
                        alt="Profile"
                        className="w-full h-full object-cover rounded-[10px]"
                      />

                      <div className="absolute bottom-0 right-0 sm:bottom-0 sm:right-0 bg-white rounded-tl-lg rounded-br-lg cursor-pointer hover:bg-gray-100 transition-colors shadow-sm">
                        <div className="p-1.5 sm:p-2">
                          <Pencil size={14} className="text-gray-600 sm:w-4 sm:h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 w-full">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                    <div className="space-y-2">
                      <Label htmlFor="user-name">User Name</Label>
                      <Input
                        id="user-name"
                        placeholder="Enter user name"
                        value={formData.userName}
                        onChange={(e) => handleInputChange("userName", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter email address"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
