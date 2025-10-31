import React from 'react';
import { Account } from '../types';
import AccountCard from './AccountCard';
import { DashboardIcon } from './icons/Icons';

interface AccountListProps {
  accounts: Account[];
  selectedAccounts: string[];
  onAccountSelect: (accountId: string) => void;
}

const AccountList: React.FC<AccountListProps> = ({ accounts, selectedAccounts, onAccountSelect }) => {
  return (
    <div>
        <div className="flex items-center mb-4">
            <DashboardIcon className="w-6 h-6 mr-3 text-indigo-400" />
            <h2 className="text-xl font-semibold text-white">Aggregated Accounts</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {accounts.map((account) => (
            <AccountCard
                key={account.id}
                account={account}
                isSelected={selectedAccounts.includes(account.id)}
                onSelect={() => onAccountSelect(account.id)}
            />
            ))}
        </div>
    </div>
  );
};

export default AccountList;
