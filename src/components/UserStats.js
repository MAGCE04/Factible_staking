"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStats = void 0;
const react_1 = __importDefault(require("react"));
const lucide_react_1 = require("lucide-react");
const UserStats = ({ userAccount, config, hasAccount }) => {
    var _a;
    if (!hasAccount) {
        return (<div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <lucide_react_1.User className="w-6 h-6 text-indigo-600"/>
          <h2 className="text-xl font-semibold text-gray-800">Account Status</h2>
        </div>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <lucide_react_1.User className="w-8 h-8 text-gray-400"/>
          </div>
          <p className="text-gray-600 mb-2">No staking account found</p>
          <p className="text-sm text-gray-500">Initialize your account to start staking NFTs</p>
        </div>
      </div>);
    }
    return (<div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <lucide_react_1.User className="w-6 h-6 text-indigo-600"/>
        <h2 className="text-xl font-semibold text-gray-800">Your Stats</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <lucide_react_1.Coins className="w-5 h-5 text-white"/>
            </div>
            <div>
              <p className="text-sm text-indigo-600 font-medium">Points Earned</p>
              <p className="text-2xl font-bold text-indigo-900">
                {((_a = userAccount === null || userAccount === void 0 ? void 0 : userAccount.points) === null || _a === void 0 ? void 0 : _a.toLocaleString()) || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <lucide_react_1.Package className="w-5 h-5 text-white"/>
            </div>
            <div>
              <p className="text-sm text-green-600 font-medium">NFTs Staked</p>
              <p className="text-2xl font-bold text-green-900">
                {(userAccount === null || userAccount === void 0 ? void 0 : userAccount.amountStaked) || 0}
                <span className="text-sm text-green-600 ml-1">
                  / {(config === null || config === void 0 ? void 0 : config.maxStake) || 0}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <lucide_react_1.Coins className="w-5 h-5 text-white"/>
            </div>
            <div>
              <p className="text-sm text-purple-600 font-medium">Points per Day</p>
              <p className="text-2xl font-bold text-purple-900">
                {(config === null || config === void 0 ? void 0 : config.pointsPerStake) || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {config && (<div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Staking Rules</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium">Max Stake:</span> {config.maxStake} NFTs
            </div>
            <div>
              <span className="font-medium">Freeze Period:</span> {config.freezePeriod} days
            </div>
          </div>
        </div>)}
    </div>);
};
exports.UserStats = UserStats;
