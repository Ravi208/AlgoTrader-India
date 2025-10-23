
import type { Strategy } from './types';

// FIX: Added 'as const' to TRADING_INSTRUMENTS to ensure TypeScript infers literal types ("NIFTY 50")
// instead of the general string type. This resolves the type error in App.tsx at line 49 where
// the 'instrument' property expected a more specific type.
export const TRADING_INSTRUMENTS = {
  NIFTY: 'NIFTY 50',
  BANKNIFTY: 'BANK NIFTY',
} as const;

export const STRATEGIES: Strategy[] = [
  {
    id: 'long_straddle',
    name: 'Long Straddle',
    description: 'Buy a call and a put at the same strike. Profits from high volatility.',
  },
  {
    id: 'bull_call_spread',
    name: 'Bull Call Spread',
    description: 'Buy a call and sell a higher strike call. Profits from a moderate rise in price.',
  },
  {
    id: 'bear_put_spread',
    name: 'Bear Put Spread',
    description: 'Buy a put and sell a lower strike put. Profits from a moderate fall in price.',
  },
  {
    id: 'iron_condor',
    name: 'Iron Condor',
    description: 'Sell a call spread and a put spread. Profits from low volatility.',
  },
];
