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
const anchor = __importStar(require("@coral-xyz/anchor"));
const mpl_token_metadata_1 = require("@metaplex-foundation/mpl-token-metadata");
const umi_bundle_defaults_1 = require("@metaplex-foundation/umi-bundle-defaults");
const umi_1 = require("@metaplex-foundation/umi");
const spl_token_1 = require("@solana/spl-token");
const system_1 = require("@coral-xyz/anchor/dist/cjs/native/system");
describe("nft-staking", () => {
    // Configure the client to use the local cluster.
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);
    const program = anchor.workspace
        .AnchorNftStacking;
    const umi = (0, umi_bundle_defaults_1.createUmi)(provider.connection);
    const payer = provider.wallet;
    let nftMint = (0, umi_1.generateSigner)(umi);
    let collectionMint = (0, umi_1.generateSigner)(umi);
    const creatorWallet = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(payer.payer.secretKey));
    const creator = (0, umi_1.createSignerFromKeypair)(umi, creatorWallet);
    umi.use((0, umi_1.keypairIdentity)(creator));
    umi.use((0, mpl_token_metadata_1.mplTokenMetadata)());
    const collection = new anchor.web3.PublicKey(collectionMint.publicKey.toString());
    const config = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from("config")], program.programId)[0];
    const rewardsMint = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from("rewards"), config.toBuffer()], program.programId)[0];
    const userAccount = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from("user"), provider.publicKey.toBuffer()], program.programId)[0];
    const stakeAccount = anchor.web3.PublicKey.findProgramAddressSync([
        Buffer.from("stake"),
        new anchor.web3.PublicKey(nftMint.publicKey).toBuffer(),
        config.toBuffer(),
    ], program.programId)[0];
    it("Mint Collection NFT", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, mpl_token_metadata_1.createNft)(umi, {
            mint: collectionMint,
            name: "GM",
            symbol: "GM",
            uri: "https://arweave.net/123",
            sellerFeeBasisPoints: (0, umi_1.percentAmount)(5.5),
            creators: null,
            collectionDetails: {
                __kind: "V1",
                size: 10,
            },
        }).sendAndConfirm(umi);
        console.log(`Created Collection NFT: ${collectionMint.publicKey.toString()}`);
    }));
    it("Mint NFT", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, mpl_token_metadata_1.createNft)(umi, {
            mint: nftMint,
            name: "GM",
            symbol: "GM",
            uri: "https://arweave.net/123",
            sellerFeeBasisPoints: (0, umi_1.percentAmount)(5.5),
            collection: { verified: false, key: collectionMint.publicKey },
            creators: null,
        }).sendAndConfirm(umi);
        console.log(`\nCreated NFT: ${nftMint.publicKey.toString()}`);
    }));
    it("Verify Collection NFT", () => __awaiter(void 0, void 0, void 0, function* () {
        const collectionMetadata = (0, mpl_token_metadata_1.findMetadataPda)(umi, {
            mint: collectionMint.publicKey,
        });
        const collectionMasterEdition = (0, mpl_token_metadata_1.findMasterEditionPda)(umi, {
            mint: collectionMint.publicKey,
        });
        const nftMetadata = (0, mpl_token_metadata_1.findMetadataPda)(umi, { mint: nftMint.publicKey });
        yield (0, mpl_token_metadata_1.verifySizedCollectionItem)(umi, {
            metadata: nftMetadata,
            collectionAuthority: creator,
            collectionMint: collectionMint.publicKey,
            collection: collectionMetadata,
            collectionMasterEditionAccount: collectionMasterEdition,
        }).sendAndConfirm(umi);
        console.log("\nCollection NFT Verified!");
    }));
    it("Initialize Config Account", () => __awaiter(void 0, void 0, void 0, function* () {
        const tx = yield program.methods
            .initializeConfig(10, 10, 0)
            .accountsPartial({
            admin: provider.wallet.publicKey,
            config,
            rewardsMint,
            systemProgram: anchor.web3.SystemProgram.programId,
            tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
        })
            .rpc();
        console.log("\nConfig Account Initialized!");
        console.log("Your transaction signature", tx);
    }));
    it("Initialize User Account", () => __awaiter(void 0, void 0, void 0, function* () {
        const tx = yield program.methods
            .initializeUser()
            .accountsPartial({
            user: provider.wallet.publicKey,
            userAccount,
            systemProgram: anchor.web3.SystemProgram.programId,
        })
            .rpc();
        console.log("\nUser Account Initialized!");
        console.log("Your transaction signature", tx);
    }));
    it("Stake NFT", () => __awaiter(void 0, void 0, void 0, function* () {
        const mintAta = (0, spl_token_1.getAssociatedTokenAddressSync)(new anchor.web3.PublicKey(nftMint.publicKey), provider.wallet.publicKey);
        const nftMetadata = (0, mpl_token_metadata_1.findMetadataPda)(umi, { mint: nftMint.publicKey });
        const nftEdition = (0, mpl_token_metadata_1.findMasterEditionPda)(umi, { mint: nftMint.publicKey });
        const tx = yield program.methods
            .stake()
            .accountsPartial({
            user: provider.wallet.publicKey,
            mint: nftMint.publicKey,
            collectionMint: collectionMint.publicKey,
            mintAta,
            metadata: new anchor.web3.PublicKey(nftMetadata[0]),
            edition: new anchor.web3.PublicKey(nftEdition[0]),
            config,
            stakeAccount,
            userAccount,
        })
            .rpc();
        console.log("\nNFT Staked!");
        console.log("Your transaction signature", tx);
    }));
    it("Unstake NFT", () => __awaiter(void 0, void 0, void 0, function* () {
        const mintAta = (0, spl_token_1.getAssociatedTokenAddressSync)(new anchor.web3.PublicKey(nftMint.publicKey), provider.wallet.publicKey);
        const nftEdition = (0, mpl_token_metadata_1.findMasterEditionPda)(umi, { mint: nftMint.publicKey });
        const tx = yield program.methods
            .unstake()
            .accountsPartial({
            user: provider.wallet.publicKey,
            mint: nftMint.publicKey,
            mintAta,
            edition: new anchor.web3.PublicKey(nftEdition[0]),
            config,
            stakeAccount,
            userAccount,
        })
            .rpc();
        console.log("\nNFT unstaked!");
        console.log("Your transaction signature", tx);
        let account = yield program.account.user.fetch(userAccount);
        console.log("user points: ", account.points);
    }));
    it("Claim Rewards", () => __awaiter(void 0, void 0, void 0, function* () {
        const rewardsAta = (0, spl_token_1.getAssociatedTokenAddressSync)(rewardsMint, provider.wallet.publicKey);
        const tx = yield program.methods
            .claim()
            .accountsPartial({
            user: provider.wallet.publicKey,
            userAccount,
            rewardsMint,
            config,
            rewardsAta,
            systemProgram: system_1.SYSTEM_PROGRAM_ID,
            tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
            associatedTokenProgram: spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID,
        })
            .rpc();
        console.log("\nRewards claimed");
        console.log("Your transaction signature", tx);
        let account = yield program.account.user.fetch(userAccount);
        console.log("User points: ", account.points);
    }));
});
