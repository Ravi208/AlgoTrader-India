import React from 'react';
import Card from './shared/Card';
import type { MarketData } from '../types';

interface MarketOverviewProps {
  marketData: MarketData[];
  lastUpdated: Date;
  marketStatus: {
    isOpen: boolean;
    statusText: 'OPEN' | 'CLOSED';
  };
}

const MarketOverview: React.FC<MarketOverviewProps> = ({ marketData, lastUpdated, marketStatus }) => {
  const getChangeColor = (change: number) => (change >= 0 ? 'text-green-500' : 'text-red-500');

  return (
    <Card>
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h2 className="text-xl font-semibold text-white">NSE Market Status</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          {marketStatus.isOpen ? (
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </div>
          ) : (
            <div className="relative flex h-3 w-3">
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </div>
          )}
          <span>
            <span className={`font-bold ${marketStatus.isOpen ? 'text-green-400' : 'text-red-400'}`}>
              {marketStatus.statusText}
            </span>
            <span className="mx-2 text-gray-600">|</span>
            {marketStatus.isOpen ? 'Last Update:' : 'As of:'}{' '}
            <span className="font-mono font-medium text-gray-200">
              {lastUpdated.toLocaleString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true,
              })}
            </span>
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {marketData.map((instrument) => (
          <div key={instrument.name} className="bg-gray-900 p-4 rounded-md border border-gray-700">
            <h3 className="font-bold text-lg text-blue-300">{instrument.name}</h3>
            <p className="text-2xl font-mono font-semibold text-white">{instrument.price.toFixed(2)}</p>
            <div className={`flex items-center text-sm font-medium ${getChangeColor(instrument.change)}`}>
              <span>{instrument.change.toFixed(2)}</span>
              <span className="ml-2">({instrument.changePercent.toFixed(2)}%)</span>
              {instrument.change >= 0 ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM6.293 9.293l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7a1 1 0 10-2 0v3.586L7.707 7.879a1 1 0 00-1.414 1.414z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-4 text-center">
        Note: Market data is simulated for paper trading and does not represent live NSE prices.
      </p>
    </Card>
  );
};

export default MarketOverview;