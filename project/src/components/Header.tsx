import React from 'react';
import { FileJson } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center">
        <div className="flex items-center">
          <FileJson size={28} className="text-blue-500 mr-2" />
          <h1 className="text-xl font-bold text-gray-800">JSON to CSV Converter</h1>
        </div>
        <p className="ml-auto text-gray-500 text-sm hidden md:block">
          Convert and filter JSON data with ease
        </p>
      </div>
    </header>
  );
};

export default Header;