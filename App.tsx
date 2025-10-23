import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import MarketOverview from './components/MarketOverview';
import StrategySuggester from './components/StrategySuggester';
import Backtester from './components/Backtester';
import Portfolio from './components/Portfolio';
import TopPicks from './components/TopPicks';
import StrategyFinder from './components/StrategyFinder';
import type { MarketData, Position, OptionPick, BacktestResult } from './types';
import { TRADING_INSTRUMENTS } from './constants';

const App: React.FC = () => {
  const [marketData, setMarketData] = useState<MarketData[]>([
    { name: TRADING_INSTRUMENTS.NIFTY, price: 23500.00, change: 0, changePercent: 0 },
    { name: TRADING_INSTRUMENTS.BANKNIFTY, price: 50000.00, change: 0, changePercent: 0 },
  ]);
  
  const [positions, setPositions] = useState<Position[]>([]);
  const [realizedPnl, setRealizedPnl] = useState<number>(0);
  const [strategyToTest, setStrategyToTest] = useState<{name: string, instrument: string} | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      // Update market data
      setMarketData((prevData) =>
        prevData.map((instrument) => {
          const tick = (Math.random() - 0.5) * (instrument.price * 0.0001);
          const newPrice = instrument.price + tick;
          const openingPrice = instrument.price - instrument.change;
          const newChange = newPrice - openingPrice;
          const newChangePercent = (newChange / openingPrice) * 100;
          return {
            ...instrument,
            price: newPrice,
            change: newChange,
            changePercent: newChangePercent,
          };
        })
      );
      
      // Update P&L on existing positions
      setPositions((prevPositions) => 
        prevPositions.map((pos) => {
          const isNifty = pos.instrument.toUpperCase().includes('NIFTY');
          const lotSize = isNifty ? 25 : 15;
          
          // Simulate a small price fluctuation
          const priceTick = (Math.random() - 0.5) * (pos.currentPrice * 0.01); // Fluctuate by up to 1%
          const newCurrentPrice = pos.currentPrice + priceTick;

          // Calculate P&L based on the difference between current and entry price
          const pnlPerShare = (newCurrentPrice - pos.entryPrice) * (pos.action === 'Buy' ? 1 : -1);
          const newPnl = pnlPerShare * lotSize * pos.quantity;

          return {
            ...pos,
            pnl: newPnl,
            currentPrice: newCurrentPrice > 0 ? newCurrentPrice : 0.05
          }
        })
      );

    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleStrategySelect = useCallback((strategyName: string, instrument: string) => {
    setStrategyToTest({ name: strategyName, instrument });
  }, []);

  const handleAddPosition = useCallback((pick: OptionPick) => {
    const newPosition: Position = {
        id: Date.now(),
        instrument: pick.instrument,
        action: pick.action,
        entryPrice: pick.entryPrice,
        currentPrice: pick.entryPrice,
        quantity: 1, // Default to 1 lot
        pnl: 0,
        source: 'pick',
    };
    setPositions(prev => [...prev, newPosition]);
  }, []);

  const handleStrategyAddToPortfolio = useCallback((result: BacktestResult) => {
    const newPositions: Position[] = result.strategyLegs.map(leg => ({
        id: Date.now() + Math.random(), // Add random to avoid collision if legs are added fast
        instrument: leg.instrument,
        action: leg.action,
        entryPrice: leg.entryPrice,
        currentPrice: leg.entryPrice,
        quantity: 1, // Default to 1 lot
        pnl: 0,
        source: 'strategy',
    }));
    setPositions(prev => [...prev, ...newPositions]);
  }, []);

  const handleExitPosition = useCallback((positionId: number) => {
    const positionToExit = positions.find(p => p.id === positionId);
    if (positionToExit) {
      setRealizedPnl(prev => prev + positionToExit.pnl);
    }
    setPositions(prev => prev.filter(p => p.id !== positionId));
  }, [positions]);

  const handleExitBySource = useCallback((source?: 'pick' | 'strategy') => {
    let positionsToExit = positions;
    let positionsToKeep = [];

    if (source) {
      positionsToExit = positions.filter(p => p.source === source);
      positionsToKeep = positions.filter(p => p.source !== source);
    }
    
    if (positionsToExit.length > 0) {
      const pnlFromExits = positionsToExit.reduce((acc, pos) => acc + pos.pnl, 0);
      setRealizedPnl(prev => prev + pnlFromExits);
    }
    
    setPositions(positionsToKeep);
  }, [positions]);

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div id="overview" className="lg:col-span-2 scroll-mt-24">
            <MarketOverview marketData={marketData} />
          </div>
          
          <div id="analysis" className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:col-span-2 scroll-mt-24">
            <StrategySuggester onStrategySelect={handleStrategySelect} />
            <Backtester strategyToTest={strategyToTest} onAddToPortfolio={handleStrategyAddToPortfolio} />
          </div>

          <div id="strategy-finder" className="lg:col-span-2 scroll-mt-24">
            <StrategyFinder onStrategySelect={handleStrategySelect} />
          </div>

          <div id="top-picks" className="lg:col-span-2 scroll-mt-24">
            <TopPicks onAddPosition={handleAddPosition} />
          </div>

          <div id="portfolio" className="lg:col-span-2 scroll-mt-24">
            <Portfolio 
              positions={positions} 
              realizedPnl={realizedPnl} 
              onExitPosition={handleExitPosition}
              onExitAllPicks={() => handleExitBySource('pick')}
              onExitAllStrategies={() => handleExitBySource('strategy')}
              onExitAll={() => handleExitBySource()}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;