"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StakingActions = void 0;
const react_1 = __importStar(require("react"));
const lucide_react_1 = require("lucide-react");
const useStakingProgram_1 = require("../hooks/useStakingProgram");
const StakingActions = ({ userAccount, config, hasAccount, onRefresh }) => {
    const { initializeUser, stakeNFT, unstakeNFT, claimRewards, loading } = (0, useStakingProgram_1.useStakingProgram)();
    const [mintAddress, setMintAddress] = (0, react_1.useState)('');
    const [collectionMintAddress, setCollectionMintAddress] = (0, react_1.useState)('');
    const [unstakeMintAddress, setUnstakeMintAddress] = (0, react_1.useState)('');
    const handleInitializeUser = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield initializeUser();
            onRefresh();
        }
        catch (error) {
            console.error('Failed to initialize user:', error);
            alert('Failed to initialize user account. Check console for details.');
        }
    });
    const handleStakeNFT = () => __awaiter(void 0, void 0, void 0, function* () {
        if (!mintAddress.trim() || !collectionMintAddress.trim()) {
            alert('Please enter both NFT mint address and collection mint address');
            return;
        }
        try {
            yield stakeNFT(mintAddress.trim(), collectionMintAddress.trim());
            setMintAddress('');
            setCollectionMintAddress('');
            onRefresh();
        }
        catch (error) {
            console.error('Failed to stake NFT:', error);
            alert('Failed to stake NFT. Check console for details.');
        }
    });
    const handleUnstakeNFT = () => __awaiter(void 0, void 0, void 0, function* () {
        if (!unstakeMintAddress.trim()) {
            alert('Please enter NFT mint address');
            return;
        }
        try {
            yield unstakeNFT(unstakeMintAddress.trim());
            setUnstakeMintAddress('');
            onRefresh();
        }
        catch (error) {
            console.error('Failed to unstake NFT:', error);
            alert('Failed to unstake NFT. Check console for details.');
        }
    });
    const handleClaimRewards = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield claimRewards();
            onRefresh();
        }
        catch (error) {
            console.error('Failed to claim rewards:', error);
            alert('Failed to claim rewards. Check console for details.');
        }
    });
    const canStake = hasAccount && userAccount && config && userAccount.amountStaked < config.maxStake;
    const canUnstake = hasAccount && userAccount && userAccount.amountStaked > 0;
    const canClaim = hasAccount && userAccount && userAccount.points > 0;
    return (<div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Actions</h2>
      
      <div className="space-y-6">
        {!hasAccount && (<div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-medium text-blue-900 mb-3 flex items-center gap-2">
              <lucide_react_1.UserPlus className="w-5 h-5"/>
              Initialize Account
            </h3>
            <p className="text-blue-700 mb-4 text-sm">
              Create your staking account to start earning rewards from your NFTs.
            </p>
            <button onClick={handleInitializeUser} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
              {loading ? (<>
                  <lucide_react_1.Loader2 className="w-4 h-4 animate-spin"/>
                  Initializing...
                </>) : (<>
                  <lucide_react_1.UserPlus className="w-4 h-4"/>
                  Initialize Account
                </>)}
            </button>
          </div>)}

        {hasAccount && (<>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="text-lg font-medium text-green-900 mb-3 flex items-center gap-2">
                <lucide_react_1.Lock className="w-5 h-5"/>
                Stake NFT
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-1">
                    NFT Mint Address
                  </label>
                  <input type="text" value={mintAddress} onChange={(e) => setMintAddress(e.target.value)} placeholder="Enter NFT mint address..." className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-1">
                    Collection Mint Address
                  </label>
                  <input type="text" value={collectionMintAddress} onChange={(e) => setCollectionMintAddress(e.target.value)} placeholder="Enter collection mint address..." className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"/>
                </div>
                <button onClick={handleStakeNFT} disabled={loading || !canStake} className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                  {loading ? (<>
                      <lucide_react_1.Loader2 className="w-4 h-4 animate-spin"/>
                      Staking...
                    </>) : (<>
                      <lucide_react_1.Lock className="w-4 h-4"/>
                      Stake NFT
                    </>)}
                </button>
                {!canStake && userAccount && config && userAccount.amountStaked >= config.maxStake && (<p className="text-sm text-green-600">Maximum stake limit reached</p>)}
              </div>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h3 className="text-lg font-medium text-orange-900 mb-3 flex items-center gap-2">
                <lucide_react_1.Unlock className="w-5 h-5"/>
                Unstake NFT
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-orange-700 mb-1">
                    NFT Mint Address
                  </label>
                  <input type="text" value={unstakeMintAddress} onChange={(e) => setUnstakeMintAddress(e.target.value)} placeholder="Enter NFT mint address to unstake..." className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"/>
                </div>
                <button onClick={handleUnstakeNFT} disabled={loading || !canUnstake} className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                  {loading ? (<>
                      <lucide_react_1.Loader2 className="w-4 h-4 animate-spin"/>
                      Unstaking...
                    </>) : (<>
                      <lucide_react_1.Unlock className="w-4 h-4"/>
                      Unstake NFT
                    </>)}
                </button>
                {!canUnstake && (<p className="text-sm text-orange-600">No NFTs currently staked</p>)}
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h3 className="text-lg font-medium text-purple-900 mb-3 flex items-center gap-2">
                <lucide_react_1.Gift className="w-5 h-5"/>
                Claim Rewards
              </h3>
              <p className="text-purple-700 mb-4 text-sm">
                Claim your accumulated staking rewards as tokens.
              </p>
              <button onClick={handleClaimRewards} disabled={loading || !canClaim} className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                {loading ? (<>
                    <lucide_react_1.Loader2 className="w-4 h-4 animate-spin"/>
                    Claiming...
                  </>) : (<>
                    <lucide_react_1.Gift className="w-4 h-4"/>
                    Claim Rewards
                  </>)}
              </button>
              {!canClaim && (<p className="text-sm text-purple-600 mt-2">No rewards available to claim</p>)}
            </div>
          </>)}
      </div>
    </div>);
};
exports.StakingActions = StakingActions;
