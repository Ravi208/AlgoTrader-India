export interface MarketData {
  name: 'NIFTY 50' | 'BANK NIFTY';
  price: number;
  change: number;
  changePercent: number;
}

export interface Strategy {
  id: string;
  name: string;
  description: string;
}

export interface StrategySuggestion {
  strategyName: string;
  rationale: string;
  parameters: {
    view: 'Bullish' | 'Bearish' | 'Neutral' | 'Volatile';
    suggestedStrikes: string;
    stopLoss: string;
  };
  risks: string;
}

export interface StrategyLeg {
  instrument: string; // e.g., "NIFTY 23500 CE"
  action: 'Buy' | 'Sell';
  entryPrice: number;
}

export interface BacktestResult {
  pnl: number; // Percentage
  pnlAmount: number; // Absolute amount in INR
  requiredCapital: number;
  maxLoss: number;
  strategyLegs: StrategyLeg[];
  commentary: string;
  dataPoints: { time: string; pnlAmount: number }[];
}

export interface Position {
  id: number;
  instrument: string; // e.g., "NIFTY 23500 CE"
  action: 'Buy' | 'Sell';
  entryPrice: number;
  currentPrice: number;
  quantity: number; // Number of lots
  pnl: number;
  source: 'pick' | 'strategy';
  requiredCapital: number;
}

export interface OptionPick {
  instrument: string; // e.g., "NIFTY 23500 CE"
  action: 'Buy' | 'Sell';
  entryPrice: number;
  requiredCapital: number;
  potentialProfit: number;
  potentialLoss: number;
  rationale: string;
}

export interface FoundStrategy {
  strategyName: string;
  rationale: string;
  suggestedStrikes: string;
  estimatedProfit: number;
  estimatedLoss: number;
}