import React from 'react'

const footer = () => {
  return (
    <div className="bg-[#0b0f19] border-t border-gray-800 text-gray-400 text-sm py-6 text-center tracking-wide mt-auto select-none">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Copyright Text */}
        <p className="hover:text-white transition duration-150">
          © {new Date().getFullYear()} Lotus Industry Pvt. Ltd. All rights reserved.
        </p>

        {/* Optional: Clean subtle links to fill up space beautifully like premium footers */}
        <div className="flex space-x-6 text-xs text-gray-500">
          <a href="#" className="hover:text-indigo-400 transition duration-150">Privacy Policy</a>
          <a href="#" className="hover:text-indigo-400 transition duration-150">Terms of Service</a>
        </div>

      </div>
    </div>
  )
}

export default footer