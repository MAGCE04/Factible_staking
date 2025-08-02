"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAnchorProgram = void 0;
const anchor_1 = require("@coral-xyz/anchor");
const wallet_adapter_react_1 = require("@solana/wallet-adapter-react");
const react_1 = require("react");
const anchor_nft_staking_json_1 = __importDefault(require("../idl/anchor_nft_staking.json"));
const web3_js_1 = require("@solana/web3.js");
// Program ID from the deployed contract
const PROGRAM_ID = new web3_js_1.PublicKey('7dMsiW22eikw4o2hKMjPqg45ftzRM2ibc11VSdpeTdTY');
const useAnchorProgram = () => {
    const { connection } = (0, wallet_adapter_react_1.useConnection)();
    const wallet = (0, wallet_adapter_react_1.useWallet)();
    const provider = (0, react_1.useMemo)(() => {
        if (!wallet)
            return null;
        return new anchor_1.AnchorProvider(connection, wallet, { commitment: 'confirmed' });
    }, [connection, wallet]);
    const program = (0, react_1.useMemo)(() => {
        if (!provider)
            return null;
        // Add the program ID to the IDL for convenience
        const idlWithAddress = Object.assign(Object.assign({}, anchor_nft_staking_json_1.default), { address: PROGRAM_ID.toString() });
        // Cast the IDL to the correct type
        return new anchor_1.Program(idlWithAddress, PROGRAM_ID, provider);
    }, [provider]);
    return { program };
};
exports.useAnchorProgram = useAnchorProgram;
