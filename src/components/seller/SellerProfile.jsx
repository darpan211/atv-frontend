'use client';
import { useState } from 'react';
import { ChevronDown, Pencil } from 'lucide-react';
import { Icon } from '../common/icons';

const Card = ({ children, className = '' }) => (
  <div className={`rounded-lg border bg-[#FFF5EE] text-black shadow-sm ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = '' }) => (
  <div className={`p-4 sm:p-6 lg:p-8 ${className}`}>{children}</div>
);

const Input = ({ className = '', ...props }) => (
  <input
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6F4E37] focus:border-[#6F4E37] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

const Label = ({ children, className = '', ...props }) => (
  <label className={`text-sm font-medium text-gray-700 ${className}`} {...props}>
    {children}
  </label>
);

const Select = ({ placeholder, value, onChange, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || '');

  const options = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' },
    { value: 'suspended', label: 'Suspended' },
  ];

  const handleSelect = (val, label) => {
    setSelectedValue(label);
    setIsOpen(false);
    if (onChange) onChange(val);
  };

  return (
    <div className="relative">
      <button
        type="button"
        className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6F4E37] focus:border-[#6F4E37] ${className}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selectedValue ? 'text-gray-900' : 'text-gray-400'}>
          {selectedValue || placeholder}
        </span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute top-full z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
          {options.map((option, index) => (
            <div
              key={index}
              className="cursor-pointer select-none px-3 py-2 text-sm hover:bg-gray-100"
              onClick={() => handleSelect(option.value, option.label)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function SellerProfile() {
  const [formData, setFormData] = useState({
    sellerName: '',
    email: '',
    address: '',
    mobile: '',
    gst: '',
    city: '',
    ownerName: '',
    status: '',
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="relative min-h-screen">
      {/* Split background - responsive positioning */}
      <div className="absolute top-0 left-0 w-full h-1/3 sm:h-1/2 bg-[#6F4E37] z-0"></div>
      <div className="absolute top-1/3 sm:top-1/2 left-0 w-full h-2/3 sm:h-1/2 bg-white z-0"></div>

      {/* Content over split background */}
      <div className="relative z-10 flex items-start sm:items-center justify-center p-4 sm:p-6 min-h-screen pt-8 sm:pt-6">
        <div className="w-full max-w-7xl">
          {/* Header - responsive text size */}
          <div className="mb-4 sm:mb-6">
            <h1 className="text-white text-xl sm:text-2xl lg:text-3xl font-semibold">
              Seller Profile
            </h1>
          </div>

          <Card className="border border-gray-200 shadow-lg">
            <CardContent>
              {/* Responsive layout: stack on mobile, side-by-side on larger screens */}
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                {/* Profile Image Section */}
                <div className="flex justify-center lg:justify-start flex-shrink-0">
                  <div className="relative">
                    <div className="w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-lg overflow-hidden relative">
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&crop=face"
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                      {/* Edit Icon - positioned INSIDE the image at bottom right */}
                      <div className="absolute bottom-0 right-0 bg-white p-1.5 rounded-tl-lg rounded-br-lg cursor-pointer hover:bg-gray-50 transition-colors shadow-sm">
                        <Icon name="EditPencil" size={16} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Fields Section - Responsive Grid */}
                <div className="flex-1">
                  {/* Mobile: Single column, Tablet: 2 columns, Desktop: 3 columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Column 1 */}
                    <div className="space-y-4 sm:space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="seller-name">Seller Name</Label>
                        <Input
                          id="seller-name"
                          placeholder="Enter company name"
                          value={formData.sellerName}
                          onChange={e => handleInputChange('sellerName', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Name</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter email address"
                          value={formData.email}
                          onChange={e => handleInputChange('email', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          placeholder="Enter address"
                          value={formData.address}
                          onChange={e => handleInputChange('address', e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Column 2 */}
                    <div className="space-y-4 sm:space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="mobile">Seller Mobile</Label>
                        <Input
                          id="mobile"
                          placeholder="Enter mobile number"
                          value={formData.mobile}
                          onChange={e => handleInputChange('mobile', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="gst">GST Number</Label>
                        <Input
                          id="gst"
                          placeholder="Enter GST number"
                          value={formData.gst}
                          onChange={e => handleInputChange('gst', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          placeholder="Enter city"
                          value={formData.city}
                          onChange={e => handleInputChange('city', e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Column 3 - On mobile, this will stack below the first two columns */}
                    <div className="space-y-4 sm:space-y-6 sm:col-span-2 lg:col-span-1">
                      <div className="space-y-2">
                        <Label htmlFor="owner-name">Owner Name</Label>
                        <Input
                          id="owner-name"
                          placeholder="Enter owner name"
                          value={formData.ownerName}
                          onChange={e => handleInputChange('ownerName', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                          placeholder="Select status"
                          value={formData.status}
                          onChange={value => handleInputChange('status', value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
