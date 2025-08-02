import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletContextProvider } from './contexts/WalletContextProvider';
import { WalletButton } from './components/WalletButton';
import { UserStats } from './components/UserStats';
import { StakingActions } from './components/StakingActions';
import { useStakingProgram } from './hooks/useStakingProgram';
import { Coins, RefreshCw } from 'lucide-react';

function AppContent() {
  const { connected, publicKey } = useWallet();
  const { userAccount, config, fetchUserAccount, fetchConfig } = useStakingProgram();
  const [refreshing, setRefreshing] = useState(false);

  const hasAccount = userAccount !== null;

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([fetchUserAccount(), fetchConfig()]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (connected && publicKey) {
      handleRefresh();
    }
  }, [connected, publicKey]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Coins className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">NFT Staking</h1>
              <p className="text-gray-600">Stake your NFTs and earn rewards</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {connected && (
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            )}
            <WalletButton />
          </div>
        </div>

        {!connected ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Coins className="w-12 h-12 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Connect Your Wallet
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Connect your Solana wallet to start staking your NFTs and earning rewards.
            </p>
            <div className="flex justify-center">
              <WalletButton />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <UserStats 
                userAccount={userAccount} 
                config={config} 
                hasAccount={hasAccount} 
              />
            </div>
            
            <div className="space-y-6">
              <StakingActions 
                userAccount={userAccount}
                config={config}
                hasAccount={hasAccount}
                onRefresh={handleRefresh}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 text-center text-gray-500 text-sm">
          <p>Built with Anchor and React • Solana NFT Staking Platform</p>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <WalletContextProvider>
      <AppContent />
    </WalletContextProvider>
  );
}

export default App;