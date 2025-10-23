import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 p-4 sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">
          <span className="text-blue-400">Algo</span>Trader
          <span className="text-xs text-gray-400 ml-2">India</span>
        </h1>

        <nav className="hidden md:flex items-center space-x-6">
          <a href="#overview" className="text-sm font-medium text-gray-300 hover:text-blue-400 transition-colors duration-300">Overview</a>
          <a href="#analysis" className="text-sm font-medium text-gray-300 hover:text-blue-400 transition-colors duration-300">AI Analysis</a>
          <a href="#strategy-finder" className="text-sm font-medium text-gray-300 hover:text-blue-400 transition-colors duration-300">Strategy Finder</a>
          <a href="#top-picks" className="text-sm font-medium text-gray-300 hover:text-blue-400 transition-colors duration-300">Top Picks</a>
          <a href="#portfolio" className="text-sm font-medium text-gray-300 hover:text-blue-400 transition-colors duration-300">Portfolio</a>
        </nav>

        <div className="text-xs text-yellow-400 bg-yellow-900/50 px-3 py-1 rounded-full border border-yellow-600">
          Disclaimer: This is a simulation tool and not financial advice.
        </div>
      </div>
    </header>
  );
};

export default Header;
