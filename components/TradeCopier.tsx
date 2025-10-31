import React, { useState } from 'react';
import Card from './shared/Card';
import Button from './shared/Button';
import { Account } from '../types';

const TradeCopier: React.FC<{ accounts: Account[] }> = ({ accounts }) => {
  const [leader, setLeader] = useState<string>('');
  const [followers, setFollowers] = useState<string[]>([]);
  const [isCopierActive, setIsCopierActive] = useState(false);

  const toggleFollower = (accountId: string) => {
    setFollowers((prev) =>
      prev.includes(accountId)
        ? prev.filter((id) => id !== accountId)
        : [...prev, accountId]
    );
  };

  const handleToggleCopier = () => {
      if (isCopierActive) {
          setIsCopierActive(false);
      } else if (leader && followers.length > 0) {
          setIsCopierActive(true);
      }
  }

  return (
    <Card title="Automated Trade Copier">
      <div className="space-y-4">
        <div>
          <label htmlFor="leader" className="block text-sm font-medium text-gray-300">Leader Account</label>
          <select
            id="leader"
            value={leader}
            onChange={(e) => setLeader(e.target.value)}
            disabled={isCopierActive}
            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white"
          >
            <option value="">Select Leader...</option>
            {accounts.map(acc => (
              <option key={acc.id} value={acc.id}>{acc.firm} - {acc.id}</option>
            ))}
          </select>
        </div>
        <div>
          <span className="block text-sm font-medium text-gray-300">Follower Accounts</span>
          <div className="mt-2 space-y-2 max-h-32 overflow-y-auto pr-2">
            {accounts.filter(acc => acc.id !== leader).map(acc => (
              <div key={acc.id} className="flex items-center">
                <input
                  id={`follower-${acc.id}`}
                  type="checkbox"
                  checked={followers.includes(acc.id)}
                  onChange={() => toggleFollower(acc.id)}
                  disabled={isCopierActive}
                  className="h-4 w-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                />
                <label htmlFor={`follower-${acc.id}`} className="ml-2 block text-sm text-gray-300">
                  {acc.firm} - {acc.id}
                </label>
              </div>
            ))}
          </div>
        </div>
        <Button
            onClick={handleToggleCopier}
            variant={isCopierActive ? 'danger' : 'primary'}
            className="w-full"
            disabled={!leader || followers.length === 0}
        >
          {isCopierActive ? 'Stop Copier' : 'Start Copier'}
        </Button>
      </div>
    </Card>
  );
};

export default TradeCopier;
