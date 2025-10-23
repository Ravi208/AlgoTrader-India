
import React, { useState } from 'react';
import Card from './shared/Card';
import Spinner from './shared/Spinner';
import { findStrategies } from '../services/geminiService';
import type { FoundStrategy } from '../types';
import { TRADING_INSTRUMENTS } from '../constants';

interface StrategyFinderProps {
  onStrategySelect: (strategyName: string, instrument: string) => void;
}

const StrategyFinder: React.FC<StrategyFinderProps> = ({ onStrategySelect }) => {
  const [targetProfit, setTargetProfit] = useState<number>(1000);
  const [maxLoss, setMaxLoss] = useState<number>(500);
  const [foundStrategies, setFoundStrategies] = useState<FoundStrategy[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedInstrument, setSelectedInstrument] = useState<string | null>(null);


  const handleFindStrategies = async (instrument: string) => {
    if (!targetProfit || !maxLoss) {
      setError("Please enter both a target profit and a maximum loss.");
      return;
    }
    setLoading(true);
    setError(null);
    setFoundStrategies(null);
    setSelectedInstrument(instrument);

    try {
      const result = await findStrategies(instrument, targetProfit, maxLoss);
      setFoundStrategies(result);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };
  
  const getPnlColor = (value: number) => (value >= 0 ? 'text-green-400' : 'text-red-400');

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4 text-white">AI Strategy Finder</h2>
      <p className="text-sm text-gray-400 mb-4">
        Find strategies that match your specific profit and loss targets for today's market.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
        <div>
          <label htmlFor="target-profit" className="block text-sm font-medium text-gray-300 mb-1">Target Profit (₹)</label>
          <input
            type="number"
            id="target-profit"
            value={targetProfit}
            onChange={(e) => setTargetProfit(Number(e.target.value))}
            className="w-full bg-gray-700 text-white rounded-md border-gray-600 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., 1000"
          />
        </div>
        <div>
          <label htmlFor="max-loss" className="block text-sm font-medium text-gray-300 mb-1">Max Acceptable Loss (₹)</label>
          <input
            type="number"
            id="max-loss"
            value={maxLoss}
            onChange={(e) => setMaxLoss(Number(e.target.value))}
            className="w-full bg-gray-700 text-white rounded-md border-gray-600 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., 500"
          />
        </div>
      </div>

      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => handleFindStrategies(TRADING_INSTRUMENTS.NIFTY)}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Find NIFTY Strategies
        </button>
        <button
          onClick={() => handleFindStrategies(TRADING_INSTRUMENTS.BANKNIFTY)}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Find BANK NIFTY Strategies
        </button>
      </div>

      <div className="mt-4">
        {loading && <Spinner />}
        {error && <div className="text-red-400 bg-red-900/50 p-3 rounded-lg">{error}</div>}
        {!loading && !error && !foundStrategies && (
             <div className="text-center py-6">
                <p className="text-gray-400">Set your criteria and click a button to find matching strategies.</p>
             </div>
        )}
        {foundStrategies && (
          <div className="space-y-4 animate-fade-in">
             {foundStrategies.length === 0 ? (
                <div className="text-center py-6">
                    <p className="text-gray-400">The AI could not find any strategies matching your criteria for today's market.</p>
                    <p className="text-sm text-gray-500">Try adjusting your profit or loss targets.</p>
                </div>
             ) : (
                foundStrategies.map((strategy, index) => (
                    <div key={index} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                        <div className="flex justify-between items-start">
                           <div>
                             <h3 className="text-lg font-bold text-yellow-400">{strategy.strategyName}</h3>
                             <p className="text-xs text-gray-400 font-mono">{strategy.suggestedStrikes}</p>
                           </div>
                           <button
                             onClick={() => onStrategySelect(strategy.strategyName, selectedInstrument!)}
                             className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded-md text-xs transition duration-300 whitespace-nowrap"
                           >
                            Simulate
                           </button>
                        </div>
                        <p className="text-sm text-gray-300 mt-2">{strategy.rationale}</p>
                        <div className="flex space-x-4 mt-2 text-sm border-t border-gray-700 pt-2">
                           <div>
                                <span className="text-gray-400">Est. Profit: </span>
                                <span className={`font-bold ${getPnlColor(strategy.estimatedProfit)}`}>₹{strategy.estimatedProfit.toLocaleString('en-IN')}</span>
                           </div>
                           <div>
                                <span className="text-gray-400">Est. Loss: </span>
                                <span className={`font-bold ${getPnlColor(-strategy.estimatedLoss)}`}>₹{strategy.estimatedLoss.toLocaleString('en-IN')}</span>
                           </div>
                        </div>
                    </div>
                ))
             )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default StrategyFinder;
