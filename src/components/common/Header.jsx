import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Menu, X } from "lucide-react"
import { Icon } from "./icons"

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogin = () => {
    window.location.href = "/"
  }

  const handleRegister = () => {
    window.location.href = "/register"
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <header className="bg-white border-b border-gray-100 shadow-xl relative z-40 flex items-center md:ju">
      {/* Main Header Container */}
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 lg:h-[80px]">
          {/* Logo Section */}
          <div className="flex items-center">
            <Icon name="Logo" height="45px" width="46px" className="sm:h-[55px] sm:w-[56px] lg:h-[69px] lg:w-[70px]" />
          </div>
          <div className="hidden lg:flex items-center justify-center flex-1">
            <NavigationMenu className="decoration-[#6C4A34]">
              <NavigationMenuList className="flex gap-6 xl:gap-8">
                {["Home", "About Us", "Projects", "Contact Us"].map((item) => (
                  <NavigationMenuItem key={item}>
                    <NavigationMenuLink className="font-bold text-gray-800 text-nowrap hover:underline transition-all text-sm xl:text-base cursor-pointer">
                      {item}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="font-bold text-gray-800 bg-transparent hover:bg-transparent focus:bg-transparent text-sm xl:text-base">
                    Services
                  </NavigationMenuTrigger>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="hidden lg:flex gap-2 xl:gap-3">
            <Button
              onClick={handleLogin}
              variant="outline"
              className="bg-[#6F4E37] hover:bg-[#5d3e2a] border-0 text-white px-3 xl:px-4 py-2 text-sm xl:text-base"
            >
              <span className="flex items-center">
                <div>{<Icon name="UserIcon" height={'50px'} width={'50px'} />}</div>
                Login
              </span>
            </Button>
            <Button
              onClick={handleRegister}
              variant="outline"
              className="bg-[#6F4E37] hover:bg-[#5d3e2a] border-0 text-white px-3 xl:px-4 py-2 text-sm xl:text-base"
            >
              <span className="flex items-center">
                <div>{<Icon name="Userplus" height={'50px'} width={'50px'} />}</div>
                Register
              </span>
            </Button>
          </div>
          <button
            className="lg:hidden text-gray-800 focus:outline-none p-2"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      <div
        className={`lg:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-lg z-50 transition-all duration-300 ease-in-out ${mobileMenuOpen
          ? "opacity-100 visible transform translate-y-0"
          : "opacity-0 invisible transform -translate-y-2"
          }`}
      >
        <div className="px-4 py-6 sm:px-6">
          <div className="space-y-4 mb-6 text-center">
            {["Home", "About Us", "Projects", "Contact Us"].map((item) => (
              <div key={item}>
                <span
                  className="block text-gray-800 font-medium hover:text-[#6F4E37] transition-colors cursor-pointer py-2 text-base sm:text-lg"
                  onClick={closeMobileMenu}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>
          <div className="space-y-3 sm:space-y-0 sm:flex sm:gap-3 grid">
            <Button
              onClick={() => {
                handleLogin()
                closeMobileMenu()
              }}
              variant="outline"
              className="bg-[#6F4E37] hover:bg-[#5d3e2a] border-0 text-white w-full sm:flex-1 py-3"
            >
              <span className="flex items-center justify-center">
                <div>{<Icon name="UserIcon" height={'50px'} width={'50px'} />}</div>
                Login
              </span>
            </Button>
            <Button
              onClick={() => {
                handleRegister()
                closeMobileMenu()
              }}
              variant="outline"
              className="bg-[#6F4E37] hover:bg-[#5d3e2a] border-0 text-white w-full sm:flex-1 py-3"
            >
              <span className="flex items-center justify-center">
                <div>{<Icon name="Userplus" height={'50px'} width={'50px'} />}</div>
                Register
              </span>
            </Button>
          </div>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-opacity-25 z-40" onClick={closeMobileMenu} />
      )}
    </header>
  )
}

export default Header
