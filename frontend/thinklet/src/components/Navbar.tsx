import { useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, LogOut, ChevronDown} from 'lucide-react';
import { useSelector } from "react-redux";




export const Navbar = () => {

const [isDropdownOpen, setIsDropdownOpen] = useState(false);
const [searchQuery, setSearchQuery] = useState('');
const user = useSelector((state: any) => state.user.user);

 const handleLogout = () => {
    console.log("Logging out...");
    alert("Logged out successfully!");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-purple-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm sm:text-lg">T</span>
            </div>
            <span className="text-lg sm:text-xl font-bold text-gray-800 hidden sm:block">thinklet</span>
          </div>

          {/* Search Bar - Center */}
          <div className="flex-1 max-w-xl mx-4 sm:mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 bg-purple-50 border border-purple-100 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 focus:outline-none group"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center shadow-md ring-2 ring-white group-hover:ring-purple-200 transition-all">
                <span className="text-white font-semibold text-sm sm:text-base">
                  {user.firstName.charAt(0)}
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform hidden sm:block ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 sm:w-56 bg-white rounded-xl shadow-xl border border-purple-100 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      // Navigate to profile
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-purple-50 transition-colors flex items-center space-x-3 text-sm sm:text-base"
                  >
                    <User className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-700">Profile</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      handleLogout();
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-red-50 transition-colors flex items-center space-x-3 text-red-600 border-t border-gray-100 text-sm sm:text-base"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
};