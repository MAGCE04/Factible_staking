"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletButton = void 0;
const react_1 = __importDefault(require("react"));
const wallet_adapter_react_ui_1 = require("@solana/wallet-adapter-react-ui");
const WalletButton = () => {
    return (<div className="wallet-button">
      <wallet_adapter_react_ui_1.WalletMultiButton />
    </div>);
};
exports.WalletButton = WalletButton;
