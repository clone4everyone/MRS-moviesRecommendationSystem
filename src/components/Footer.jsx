import React from 'react';
import { Film, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-800 border-t border-slate-700 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 text-purple-400 mb-4 md:mb-0">
            <Film className="h-6 w-6" />
            <span className="font-bold text-lg">CineReview</span>
          </div>
          
          <div className="flex items-center space-x-1 text-gray-400">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            <span>for movie lovers</span>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-slate-700 text-center text-gray-400 text-sm">
          <p>&copy; 2025 CineReview. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;