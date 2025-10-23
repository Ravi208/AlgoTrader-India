
import React, { useState } from 'react';
import Card from './shared/Card';
import Spinner from './shared/Spinner';
import { fetchStrategySuggestion } from '../services/geminiService';
import type { StrategySuggestion } from '../types';
import { TRADING_INSTRUMENTS } from '../constants';

interface StrategySuggesterProps {
  onStrategySelect: (strategyName: string, instrument: string) => void;
}

const StrategySuggester: React.FC<StrategySuggesterProps> = ({ onStrategySelect }) => {
  const [suggestion, setSuggestion] = useState<StrategySuggestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedInstrument, setSelectedInstrument] = useState<string | null>(null);

  const handleGetSuggestion = async (instrument: string) => {
    setLoading(true);
    setError(null);
    setSuggestion(null);
    setSelectedInstrument(instrument);
    try {
      const result = await fetchStrategySuggestion(instrument);
      setSuggestion(result);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <h2 className="text-xl font-semibold mb-4 text-white">AI Strategy Suggester</h2>
      <p className="text-sm text-gray-400 mb-4">
        Let our AI analyze today's market conditions and suggest a potential options strategy.
      </p>
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => handleGetSuggestion(TRADING_INSTRUMENTS.NIFTY)}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Analyze NIFTY 50
        </button>
        <button
          onClick={() => handleGetSuggestion(TRADING_INSTRUMENTS.BANKNIFTY)}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Analyze BANK NIFTY
        </button>
      </div>
      
      <div className="flex-grow mt-4">
        {loading && <Spinner />}
        {error && <div className="text-red-400 bg-red-900/50 p-3 rounded-lg">{error}</div>}
        {suggestion && selectedInstrument && (
          <div className="space-y-4 bg-gray-900/50 p-4 rounded-lg animate-fade-in">
            <h3 className="text-lg font-bold text-blue-300">Suggested Strategy for {selectedInstrument}: <span className="text-yellow-400">{suggestion.strategyName}</span></h3>
            <div>
              <h4 className="font-semibold text-gray-300">Rationale:</h4>
              <p className="text-sm text-gray-400">{suggestion.rationale}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-300">Parameters:</h4>
              <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
                <li><span className="font-medium text-gray-200">Market View:</span> {suggestion.parameters.view}</li>
                <li><span className="font-medium text-gray-200">Suggested Strikes:</span> {suggestion.parameters.suggestedStrikes}</li>
                <li><span className="font-medium text-gray-200">Stop Loss:</span> {suggestion.parameters.stopLoss}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-300">Risks:</h4>
              <p className="text-sm text-gray-400">{suggestion.risks}</p>
            </div>
            <button
                onClick={() => onStrategySelect(suggestion.strategyName, selectedInstrument)}
                className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
            >
                Simulate This Strategy
            </button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default StrategySuggester;
