import React from 'react';
import Card from './shared/Card';
import { formatCurrency } from '../utils/helpers';

interface GlobalStatsProps {
  totalBalance: number;
  totalCushion: number;
}

const GlobalStats: React.FC<GlobalStatsProps> = ({ totalBalance, totalCushion }) => {
  const cushionColor = totalCushion >= 0 ? 'text-green-400' : 'text-red-400';

  return (
    <Card className="bg-gradient-to-r from-gray-800 to-gray-900">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div>
          <h4 className="text-sm font-medium text-gray-400">Total Balance</h4>
          <p className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
            {formatCurrency(totalBalance)}
          </p>
        </div>
        <div className="md:border-x border-gray-700">
          <h4 className="text-sm font-medium text-gray-400">Total P/L Cushion</h4>
          <p className={`text-2xl lg:text-3xl font-bold ${cushionColor} tracking-tight`}>
            {formatCurrency(totalCushion)}
          </p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-400">Trading Status</h4>
          <p className="text-2xl lg:text-3xl font-bold text-indigo-400 tracking-tight">
            Live
          </p>
        </div>
      </div>
    </Card>
  );
};

export default GlobalStats;
