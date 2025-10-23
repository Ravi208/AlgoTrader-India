import React, { useState } from 'react';
import Card from './shared/Card';
import Spinner from './shared/Spinner';
import { fetchTopPicks } from '../services/geminiService';
import type { OptionPick } from '../types';
import { TRADING_INSTRUMENTS } from '../constants';

interface TopPicksProps {
  onAddPosition: (pick: OptionPick) => void;
}

const TopPicks: React.FC<TopPicksProps> = ({ onAddPosition }) => {
  const [picks, setPicks] = useState<OptionPick[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleGetPicks = async (instrument: string) => {
    setLoading(true);
    setError(null);
    setPicks(null);
    try {
      const result = await fetchTopPicks(instrument);
      setPicks(result);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const getPnlColor = (value: number) => (value >= 0 ? 'text-green-400' : 'text-red-400');

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4 text-white">AI Top 5 Option Picks</h2>
      <p className="text-sm text-gray-400 mb-4">
        Get today's top 5 intraday option trade ideas from our AI, including capital and P/L estimates.
      </p>
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => handleGetPicks(TRADING_INSTRUMENTS.NIFTY)}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Get NIFTY 50 Picks
        </button>
        <button
          onClick={() => handleGetPicks(TRADING_INSTRUMENTS.BANKNIFTY)}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Get BANK NIFTY Picks
        </button>
      </div>

      <div className="mt-4">
        {loading && <Spinner />}
        {error && <div className="text-red-400 bg-red-900/50 p-3 rounded-lg">{error}</div>}
        {!loading && !error && !picks && (
             <div className="text-center py-10">
                <p className="text-gray-400">Click a button to get the latest AI-powered trade ideas.</p>
             </div>
        )}
        {picks && (
          <div className="overflow-x-auto animate-fade-in">
            <table className="min-w-full text-sm text-left text-gray-300">
              <thead className="text-xs text-gray-400 uppercase bg-gray-700/50">
                <tr>
                  <th scope="col" className="px-4 py-3">Instrument</th>
                  <th scope="col" className="px-4 py-3">Action</th>
                  <th scope="col" className="px-4 py-3">Entry Price (Est.)</th>
                  <th scope="col" className="px-4 py-3">Capital Req. (Est.)</th>
                  <th scope="col" className="px-4 py-3">Profit Pot. (Est.)</th>
                  <th scope="col" className="px-4 py-3">Loss Pot. (Est.)</th>
                  <th scope="col" className="px-4 py-3">Rationale</th>
                  <th scope="col" className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {picks.map((pick, index) => (
                  <tr key={index} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50">
                    <td className="px-4 py-4 font-medium text-white whitespace-nowrap">{pick.instrument}</td>
                    <td className={`px-4 py-4 font-bold ${pick.action === 'Buy' ? 'text-blue-400' : 'text-orange-400'}`}>{pick.action}</td>
                    <td className="px-4 py-4">₹{pick.entryPrice.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-4">₹{pick.requiredCapital.toLocaleString('en-IN')}</td>
                    <td className={`px-4 py-4 font-bold ${getPnlColor(pick.potentialProfit)}`}>₹{pick.potentialProfit.toLocaleString('en-IN')}</td>
                    <td className={`px-4 py-4 font-bold ${getPnlColor(-pick.potentialLoss)}`}>₹{pick.potentialLoss.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-4 text-gray-400 text-xs max-w-xs">{pick.rationale}</td>
                    <td className="px-4 py-4 text-right">
                      <button 
                        onClick={() => onAddPosition(pick)}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded-md text-xs transition duration-300 whitespace-nowrap"
                      >
                        Add to Portfolio
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Card>
  );
};

export default TopPicks;
