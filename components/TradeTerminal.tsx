import React, { useState } from 'react';
import Card from './shared/Card';
import Button from './shared/Button';
import { Account } from '../types';
import { TradeIcon } from './icons/Icons';

interface TradeTerminalProps {
  accounts: Account[];
  selectedAccountIds: string[];
}

const TradeTerminal: React.FC<TradeTerminalProps> = ({ accounts, selectedAccountIds }) => {
  const [symbol, setSymbol] = useState('ES');
  const [quantity, setQuantity] = useState(1);
  const [isTrading, setIsTrading] = useState(false);
  const [tradeStatus, setTradeStatus] = useState('');

  const handleTrade = (side: 'BUY' | 'SELL') => {
    if (selectedAccountIds.length === 0) {
      setTradeStatus('Error: No accounts selected.');
      setTimeout(() => setTradeStatus(''), 3000);
      return;
    }
    setIsTrading(true);
    setTradeStatus(`Placing ${side} order for ${quantity} ${symbol} on ${selectedAccountIds.length} account(s)...`);
    
    // Mock trade execution
    setTimeout(() => {
      setIsTrading(false);
      setTradeStatus(`Success: ${side} order filled.`);
      setTimeout(() => setTradeStatus(''), 3000);
    }, 1500);
  };

  return (
    <Card title="Manual Trade Terminal" icon={<TradeIcon />}>
      <div className="space-y-4">
        <div>
          <label htmlFor="symbol" className="block text-sm font-medium text-gray-300">Symbol</label>
          <input
            type="text"
            id="symbol"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white"
          />
        </div>
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-300">Quantity</label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            min="1"
            onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="success" onClick={() => handleTrade('BUY')} isLoading={isTrading}>
            BUY
          </Button>
          <Button variant="danger" onClick={() => handleTrade('SELL')} isLoading={isTrading}>
            SELL
          </Button>
        </div>
        <div className="text-xs text-center text-gray-400 h-4">
            {tradeStatus || `Selected accounts: ${selectedAccountIds.length}`}
        </div>
      </div>
    </Card>
  );
};

export default TradeTerminal;
