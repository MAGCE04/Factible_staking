import React from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export const WalletButton: React.FC = () => {
  return (
    <div className="wallet-button">
      <WalletMultiButton />
    </div>
  );
};