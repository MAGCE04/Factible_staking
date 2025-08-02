"use strict";
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
exports.useStakingProgram = void 0;
const useAnchorProgram_1 = require("./useAnchorProgram");
const web3_js_1 = require("@solana/web3.js");
const wallet_adapter_react_1 = require("@solana/wallet-adapter-react");
const spl_token_1 = require("@solana/spl-token");
const mpl_token_metadata_1 = require("@metaplex-foundation/mpl-token-metadata");
const umi_bundle_defaults_1 = require("@metaplex-foundation/umi-bundle-defaults");
const useStakingProgram = () => {
    const { program } = (0, useAnchorProgram_1.useAnchorProgram)();
    const { connection } = (0, wallet_adapter_react_1.useConnection)();
    const wallet = (0, wallet_adapter_react_1.useWallet)();
    const umi = (0, umi_bundle_defaults_1.createUmi)(connection);
    // PDAs
    const configPDA = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from('config')], (program === null || program === void 0 ? void 0 : program.programId) || web3_js_1.PublicKey.default)[0];
    const rewardsMintPDA = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from('rewards'), configPDA.toBuffer()], (program === null || program === void 0 ? void 0 : program.programId) || web3_js_1.PublicKey.default)[0];
    const getUserAccountPDA = (userPublicKey) => {
        return web3_js_1.PublicKey.findProgramAddressSync([Buffer.from('user'), userPublicKey.toBuffer()], (program === null || program === void 0 ? void 0 : program.programId) || web3_js_1.PublicKey.default)[0];
    };
    const getStakeAccountPDA = (nftMint) => {
        return web3_js_1.PublicKey.findProgramAddressSync([
            Buffer.from('stake'),
            nftMint.toBuffer(),
            configPDA.toBuffer(),
        ], (program === null || program === void 0 ? void 0 : program.programId) || web3_js_1.PublicKey.default)[0];
    };
    // Initialize config
    const initializeConfig = (pointsPerStake, maxStake, freezePeriod) => __awaiter(void 0, void 0, void 0, function* () {
        if (!program || !wallet.publicKey)
            return;
        return program.methods
            .initializeConfig(pointsPerStake, maxStake, freezePeriod)
            .accountsPartial({
            admin: wallet.publicKey,
            config: configPDA,
            rewardsMint: rewardsMintPDA,
            systemProgram: web3_js_1.PublicKey.default,
            tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
        })
            .rpc();
    });
    // Initialize user
    const initializeUser = () => __awaiter(void 0, void 0, void 0, function* () {
        if (!program || !wallet.publicKey)
            return;
        const userAccountPDA = getUserAccountPDA(wallet.publicKey);
        return program.methods
            .initializeUser()
            .accountsPartial({
            user: wallet.publicKey,
            userAccount: userAccountPDA,
            systemProgram: web3_js_1.PublicKey.default,
        })
            .rpc();
    });
    // Get user account data
    const getUserAccount = () => __awaiter(void 0, void 0, void 0, function* () {
        if (!program || !wallet.publicKey)
            return null;
        const userAccountPDA = getUserAccountPDA(wallet.publicKey);
        try {
            // Use the typed account fetch
            return yield program.account.user.fetch(userAccountPDA);
        }
        catch (error) {
            console.error('Error fetching user account:', error);
            return null;
        }
    });
    // Get config account data
    const getConfigAccount = () => __awaiter(void 0, void 0, void 0, function* () {
        if (!program)
            return null;
        try {
            // Use the typed account fetch
            return yield program.account.config.fetch(configPDA);
        }
        catch (error) {
            console.error('Error fetching config account:', error);
            return null;
        }
    });
    // Stake NFT
    const stakeNFT = (nftMint, collectionMint) => __awaiter(void 0, void 0, void 0, function* () {
        if (!program || !wallet.publicKey)
            return;
        const userAccountPDA = getUserAccountPDA(wallet.publicKey);
        const stakeAccountPDA = getStakeAccountPDA(nftMint);
        const mintAta = (0, spl_token_1.getAssociatedTokenAddressSync)(nftMint, wallet.publicKey);
        const nftMetadata = (0, mpl_token_metadata_1.findMetadataPda)(umi, { mint: nftMint });
        const nftEdition = (0, mpl_token_metadata_1.findMasterEditionPda)(umi, { mint: nftMint });
        return program.methods
            .stake()
            .accountsPartial({
            user: wallet.publicKey,
            mint: nftMint,
            collectionMint: collectionMint,
            mintAta,
            metadata: new web3_js_1.PublicKey(nftMetadata[0]),
            edition: new web3_js_1.PublicKey(nftEdition[0]),
            config: configPDA,
            stakeAccount: stakeAccountPDA,
            userAccount: userAccountPDA,
        })
            .rpc();
    });
    // Unstake NFT
    const unstakeNFT = (nftMint) => __awaiter(void 0, void 0, void 0, function* () {
        if (!program || !wallet.publicKey)
            return;
        const userAccountPDA = getUserAccountPDA(wallet.publicKey);
        const stakeAccountPDA = getStakeAccountPDA(nftMint);
        const mintAta = (0, spl_token_1.getAssociatedTokenAddressSync)(nftMint, wallet.publicKey);
        const nftEdition = (0, mpl_token_metadata_1.findMasterEditionPda)(umi, { mint: nftMint });
        return program.methods
            .unstake()
            .accountsPartial({
            user: wallet.publicKey,
            mint: nftMint,
            mintAta,
            edition: new web3_js_1.PublicKey(nftEdition[0]),
            config: configPDA,
            stakeAccount: stakeAccountPDA,
            userAccount: userAccountPDA,
        })
            .rpc();
    });
    // Claim rewards
    const claimRewards = () => __awaiter(void 0, void 0, void 0, function* () {
        if (!program || !wallet.publicKey)
            return;
        const userAccountPDA = getUserAccountPDA(wallet.publicKey);
        const rewardsAta = (0, spl_token_1.getAssociatedTokenAddressSync)(rewardsMintPDA, wallet.publicKey);
        return program.methods
            .claim()
            .accountsPartial({
            user: wallet.publicKey,
            userAccount: userAccountPDA,
            rewardsMint: rewardsMintPDA,
            config: configPDA,
            rewardsAta,
            systemProgram: web3_js_1.PublicKey.default,
            tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
            associatedTokenProgram: spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID,
        })
            .rpc();
    });
    return {
        initializeConfig,
        initializeUser,
        getUserAccount,
        getConfigAccount,
        stakeNFT,
        unstakeNFT,
        claimRewards,
        configPDA,
        rewardsMintPDA,
        getUserAccountPDA,
        getStakeAccountPDA,
    };
};
exports.useStakingProgram = useStakingProgram;
