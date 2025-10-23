import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import Card from './shared/Card';
import Spinner from './shared/Spinner';
import { runBacktest } from '../services/geminiService';
import type { BacktestResult } from '../types';

interface BacktesterProps {
  strategyToTest: {
    name: string;
    instrument: string;
  } | null;
  onAddToPortfolio: (result: BacktestResult) => void;
}

// Custom Tooltip for the historical chart
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const pnl = payload[0].value;
    let formattedDate = label;
    try {
        const date = new Date(label);
        if (!isNaN(date.getTime())) {
            formattedDate = date.toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                timeZone: 'UTC'
            });
        }
    } catch (e) {
        // ignore, use original label
    }

    return (
      <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-600 p-3 rounded-lg shadow-lg">
        <p className="label text-sm font-medium text-gray-300">{formattedDate}</p>
        <p className={`intro text-base font-bold ${pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {pnl >= 0 ? '+' : ''}₹{pnl.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>
    );
  }
  return null;
};

const formatDate = (dateString: string): string => {
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return dateString;
        }
        const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', timeZone: 'UTC' };
        return date.toLocaleDateString('en-US', options);
    } catch (e) {
        return dateString;
    }
};


const Backtester: React.FC<BacktesterProps> = ({ strategyToTest, onAddToPortfolio }) => {
  const [result, setResult] = useState<BacktestResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (strategyToTest) {
      handleRunTest();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strategyToTest]);

  const handleRunTest = async () => {
    if (!strategyToTest) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const testResult = await runBacktest(strategyToTest.instrument, strategyToTest.name);
      setResult(testResult);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const getPnlColor = (pnl: number) => (pnl >= 0 ? 'text-green-400' : 'text-red-400');

  return (
    <Card className="h-full flex flex-col">
      <h2 className="text-xl font-semibold mb-4 text-white">AI Strategy Simulator</h2>
      {!strategyToTest && (
        <div className="flex-grow flex items-center justify-center">
            <p className="text-gray-400">Select a strategy from the suggester to run a simulation.</p>
        </div>
      )}
      {strategyToTest && (
        <div className="flex-grow flex flex-col">
            <div className="bg-gray-900/50 p-3 rounded-lg mb-4 text-center">
                <p className="text-gray-300">Simulating: <span className="font-bold text-yellow-400">{strategyToTest.name}</span> on <span className="font-bold text-blue-300">{strategyToTest.instrument}</span></p>
                 {result && result.strategyLegs && (
                    <div className="text-xs text-gray-400 mt-2">
                      <span className="font-medium text-gray-300">Strategy Legs:</span>
                      <div className="flex justify-center items-center space-x-2 flex-wrap">
                        {result.strategyLegs.map((leg, index) => (
                           <span key={index} className="font-mono text-gray-200 bg-gray-700/50 px-2 py-1 rounded-md my-1">
                            {leg.action} {leg.instrument} @ {leg.entryPrice.toFixed(2)}
                          </span>
                        ))}
                      </div>
                    </div>
                )}
            </div>
            {loading && <div className="flex-grow flex items-center justify-center"><Spinner /></div>}
            {error && <div className="text-red-400 bg-red-900/50 p-3 rounded-lg">{error}</div>}
            {result && (
                <div className="flex-grow flex flex-col space-y-4 animate-fade-in">
                    <div>
                        <h3 className="text-lg font-bold text-gray-200">Today's Simulation Result</h3>
                         <div className="flex items-baseline space-x-4">
                            <p className={`text-3xl font-bold ${getPnlColor(result.pnlAmount)}`}>
                                ₹{result.pnlAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                            <p className={`text-xl font-semibold ${getPnlColor(result.pnl)}`}>
                                ({result.pnl >= 0 ? '+' : ''}{result.pnl.toFixed(2)}%)
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-2 border-t border-gray-700 pt-2 text-sm">
                            <div>
                                <span className="text-gray-400 block">Estimated Capital</span>
                                <span className="font-medium text-gray-200 text-base">₹{result.requiredCapital.toLocaleString('en-IN')}</span>
                            </div>
                            <div>
                                <span className="text-gray-400 block">Max Potential Loss</span>
                                <span className="font-medium text-red-400 text-base">₹{result.maxLoss.toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-300">AI Commentary (Today):</h4>
                        <p className="text-sm text-gray-400">{result.commentary}</p>
                    </div>
                    {/* Intraday Chart */}
                    <div style={{ height: '220px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={result.dataPoints} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                                <XAxis dataKey="time" stroke="#A0AEC0" />
                                <YAxis stroke="#A0AEC0" domain={['auto', 'auto']} tickFormatter={(value) => `₹${value}`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }}
                                    formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Intraday P/L']}
                                    labelStyle={{ color: '#A0AEC0' }}
                                />
                                <Legend wrapperStyle={{fontSize: '12px', color: '#A0AEC0'}} />
                                <Line type="monotone" dataKey="pnlAmount" name="Intraday P/L (₹)" stroke="#38B2AC" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    
                    {/* Historical Chart - NEW DESIGN */}
                    {result.historicalPnl && result.historicalPnl.length > 0 && (
                        <div className="border-t border-gray-700 pt-4 mt-4">
                            <h3 className="text-lg font-bold text-gray-200 mb-2">Hypothetical 7-Day Performance</h3>
                             <div style={{ height: '220px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={result.historicalPnl.slice().reverse()} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                        <defs>
                                            <linearGradient id="positivePnlGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#48BB78" stopOpacity={0.9} />
                                                <stop offset="100%" stopColor="#48BB78" stopOpacity={0.2} />
                                            </linearGradient>
                                            <linearGradient id="negativePnlGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#F56565" stopOpacity={0.9} />
                                                <stop offset="100%" stopColor="#F56565" stopOpacity={0.2} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" vertical={false} />
                                        <XAxis dataKey="date" stroke="#A0AEC0" tick={{fontSize: 12}} axisLine={false} tickLine={false} tickFormatter={formatDate} />
                                        <YAxis 
                                            stroke="#A0AEC0" 
                                            tickFormatter={(value) => value === 0 ? '₹0' : `₹${Number(value)/1000}k`}
                                            tick={{fontSize: 12}} 
                                            axisLine={false} 
                                            tickLine={false}
                                            width={50}
                                        />
                                        <Tooltip
                                            content={<CustomTooltip />}
                                            cursor={{ fill: 'rgba(100, 116, 139, 0.1)' }}
                                        />
                                        <ReferenceLine y={0} stroke="#6b7280" strokeWidth={1} />
                                        <Bar dataKey="pnlAmount" name="Daily P/L (₹)" radius={[4, 4, 0, 0]}>
                                            {result.historicalPnl.slice().reverse().map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.pnlAmount >= 0 ? 'url(#positivePnlGradient)' : 'url(#negativePnlGradient)'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}
                    
                    <button
                        onClick={() => onAddToPortfolio(result)}
                        className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                    >
                        Add Today's Strategy to Portfolio
                    </button>
                </div>
            )}
        </div>
      )}
    </Card>
  );
};

export default Backtester;