import React from 'react';
import Card from './shared/Card';
import type { Position } from '../types';

interface PortfolioProps {
  positions: Position[];
  realizedPnl: number;
  onExitPosition: (positionId: number) => void;
  onExitAllPicks: () => void;
  onExitAllStrategies: () => void;
  onExitAll: () => void;
}

const Portfolio: React.FC<PortfolioProps> = ({ positions, realizedPnl, onExitPosition, onExitAllPicks, onExitAllStrategies, onExitAll }) => {
  const getPnlColor = (pnl: number) => (pnl >= 0 ? 'text-green-500' : 'text-red-500');
  const unrealizedPnl = positions.reduce((acc, pos) => acc + pos.pnl, 0);
  const totalPnl = unrealizedPnl + realizedPnl;

  const hasPicks = positions.some(p => p.source === 'pick');
  const hasStrategies = positions.some(p => p.source === 'strategy');

  return (
    <Card>
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <h2 className="text-xl font-semibold text-white">Paper Trading Portfolio</h2>
        <div className="flex space-x-6 text-right items-center">
            <div>
                <span className="text-sm text-gray-400 block">Realized P/L</span>
                <span className={`text-lg font-bold ${getPnlColor(realizedPnl)}`}>
                    ₹{realizedPnl.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
            </div>
             <div>
                <span className="text-sm text-gray-400 block">Unrealized P/L</span>
                <span className={`text-lg font-bold ${getPnlColor(unrealizedPnl)}`}>
                    ₹{unrealizedPnl.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
            </div>
            <div className="border-l border-gray-700 pl-6">
                <span className="text-sm text-gray-400 block">Total P/L</span>
                <span className={`text-xl font-extrabold ${getPnlColor(totalPnl)}`}>
                    ₹{totalPnl.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
            </div>
        </div>
      </div>
      <div className="w-full flex justify-end space-x-2 mb-4 border-t border-gray-700 pt-4">
          <button
            onClick={onExitAllPicks}
            disabled={!hasPicks}
            className="text-xs bg-orange-600 hover:bg-orange-700 text-white font-bold py-1 px-3 rounded-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Exit All Picks
          </button>
          <button
            onClick={onExitAllStrategies}
            disabled={!hasStrategies}
            className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1 px-3 rounded-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Exit All Strategies
          </button>
          <button
            onClick={onExitAll}
            disabled={positions.length === 0}
            className="text-xs bg-red-700 hover:bg-red-800 text-white font-bold py-1 px-3 rounded-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Exit All Positions
          </button>
        </div>
      <div className="overflow-x-auto">
        {positions.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-400">No open positions.</p>
            <p className="text-sm text-gray-500">Add positions from the "AI Top Picks" or "Simulator" sections.</p>
          </div>
        ) : (
          <table className="min-w-full text-sm text-left text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-gray-700/50">
              <tr>
                <th scope="col" className="px-6 py-3">Source</th>
                <th scope="col" className="px-6 py-3">Instrument</th>
                <th scope="col" className="px-6 py-3">Action</th>
                <th scope="col" className="px-6 py-3">Entry Price</th>
                <th scope="col" className="px-6 py-3">Current Price</th>
                <th scope="col" className="px-6 py-3">Qty (Lots)</th>
                <th scope="col" className="px-6 py-3 text-right">P/L</th>
                <th scope="col" className="px-6 py-3 text-center"></th>
              </tr>
            </thead>
            <tbody>
              {positions.map((pos) => (
                <tr key={pos.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50">
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                      pos.source === 'pick' ? 'bg-orange-900 text-orange-300' : 'bg-indigo-900 text-indigo-300'
                    }`}>
                      {pos.source}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{pos.instrument}</td>
                  <td className={`px-6 py-4 font-bold ${pos.action === 'Buy' ? 'text-blue-400' : 'text-orange-400'}`}>{pos.action}</td>
                  <td className="px-6 py-4">₹{pos.entryPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="px-6 py-4">₹{pos.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="px-6 py-4">{pos.quantity}</td>
                  <td className={`px-6 py-4 font-bold text-right ${getPnlColor(pos.pnl)}`}>₹{pos.pnl.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => onExitPosition(pos.id)}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-md text-xs transition duration-300"
                    >
                      Exit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Card>
  );
};

export default Portfolio;