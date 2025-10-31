import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Account } from '../types';
import { formatCurrency } from '../utils/helpers';

interface AccountCardProps {
  account: Account;
  isSelected: boolean;
  onSelect: () => void;
}

const RuleProgressBar: React.FC<{ rule: Account['rules'][0] }> = ({ rule }) => {
  const percentage = (rule.current / rule.limit) * 100;
  const progressBarColor = percentage > 80 ? 'bg-red-500' : percentage > 50 ? 'bg-yellow-500' : 'bg-indigo-500';

  return (
    <div>
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>{rule.name}</span>
        <span>{formatCurrency(rule.current)} / {formatCurrency(rule.limit)}</span>
      </div>
      <div className="w-full bg-gray-600 rounded-full h-1.5">
        <div className={`${progressBarColor} h-1.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
};


const AccountCard: React.FC<AccountCardProps> = ({ account, isSelected, onSelect }) => {
  const pnlColor = account.cushion >= 0 ? 'text-green-400' : 'text-red-400';
  const platformColor = account.platform === 'ProjectX' ? 'bg-blue-500' : 'bg-orange-500';

  return (
    <div
      className={`bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-200 cursor-pointer ${
        isSelected ? 'ring-2 ring-indigo-500' : 'ring-1 ring-gray-700 hover:ring-indigo-600'
      }`}
      onClick={onSelect}
    >
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2">
                <span className={`px-2 py-0.5 text-xs font-semibold text-white rounded-full ${platformColor}`}>
                {account.platform}
                </span>
                <p className="font-bold text-white">{account.firm}</p>
            </div>
            <p className="text-xs text-gray-400">{account.id}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-white">{formatCurrency(account.balance)}</p>
            <p className={`text-sm font-semibold ${pnlColor}`}>{formatCurrency(account.cushion)}</p>
          </div>
        </div>
      </div>
      <div className="h-24 -mx-2 -mb-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={account.pnlHistory} margin={{ top: 20, right: 10, left: 10, bottom: 0 }}>
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(31, 41, 55, 0.8)', // bg-gray-800 with opacity
                border: '1px solid #4B5563', // border-gray-600
                borderRadius: '0.5rem',
              }}
              labelStyle={{ color: '#E5E7EB' }} // text-gray-200
              itemStyle={{ color: '#A78BFA' }} // text-indigo-400
              formatter={(value) => formatCurrency(value as number)}
            />
            <Line type="monotone" dataKey="pnl" stroke="#818CF8" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
       <div className="p-4 bg-gray-800/50 space-y-3">
        {account.rules.map((rule) => (
          <RuleProgressBar key={rule.name} rule={rule} />
        ))}
      </div>
    </div>
  );
};

export default AccountCard;
