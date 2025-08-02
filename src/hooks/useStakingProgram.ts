import { useAnchorProgram } from './useAnchorProgram';
import { PublicKey } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, getAssociatedTokenAddressSync } from '@solana/spl-token';
import { findMasterEditionPda, findMetadataPda } from '@metaplex-foundation/mpl-token-metadata';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { UserAccount, ConfigAccount } from '../types/anchor-nft-staking';

export const useStakingProgram = () => {
  const { program } = useAnchorProgram();
  const { connection } = useConnection();
  const wallet = useWallet();
  const umi = createUmi(connection);

  // PDAs
  const configPDA = PublicKey.findProgramAddressSync(
    [Buffer.from('config')],
    program?.programId || PublicKey.default
  )[0];

  const rewardsMintPDA = PublicKey.findProgramAddressSync(
    [Buffer.from('rewards'), configPDA.toBuffer()],
    program?.programId || PublicKey.default
  )[0];

  const getUserAccountPDA = (userPublicKey: PublicKey) => {
    return PublicKey.findProgramAddressSync(
      [Buffer.from('user'), userPublicKey.toBuffer()],
      program?.programId || PublicKey.default
    )[0];
  };

  const getStakeAccountPDA = (nftMint: PublicKey) => {
    return PublicKey.findProgramAddressSync(
      [
        Buffer.from('stake'),
        nftMint.toBuffer(),
        configPDA.toBuffer(),
      ],
      program?.programId || PublicKey.default
    )[0];
  };

  // Initialize config
  const initializeConfig = async (pointsPerStake: number, maxStake: number, freezePeriod: number) => {
    if (!program || !wallet.publicKey) return;

    return program.methods
      .initializeConfig(pointsPerStake, maxStake, freezePeriod)
      .accountsPartial({
        admin: wallet.publicKey,
        config: configPDA,
        rewardsMint: rewardsMintPDA,
        systemProgram: PublicKey.default,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();
  };

  // Initialize user
  const initializeUser = async () => {
    if (!program || !wallet.publicKey) return;

    const userAccountPDA = getUserAccountPDA(wallet.publicKey);

    return program.methods
      .initializeUser()
      .accountsPartial({
        user: wallet.publicKey,
        userAccount: userAccountPDA,
        systemProgram: PublicKey.default,
      })
      .rpc();
  };

  // Get user account data
  const getUserAccount = async (): Promise<UserAccount | null> => {
    if (!program || !wallet.publicKey) return null;

    const userAccountPDA = getUserAccountPDA(wallet.publicKey);
    try {
      // Use the typed account fetch
      return await program.account.user.fetch(userAccountPDA) as UserAccount;
    } catch (error) {
      console.error('Error fetching user account:', error);
      return null;
    }
  };

  // Get config account data
  const getConfigAccount = async (): Promise<ConfigAccount | null> => {
    if (!program) return null;

    try {
      // Use the typed account fetch
      return await program.account.config.fetch(configPDA) as ConfigAccount;
    } catch (error) {
      console.error('Error fetching config account:', error);
      return null;
    }
  };

  // Stake NFT
  const stakeNFT = async (nftMint: PublicKey, collectionMint: PublicKey) => {
    if (!program || !wallet.publicKey) return;

    const userAccountPDA = getUserAccountPDA(wallet.publicKey);
    const stakeAccountPDA = getStakeAccountPDA(nftMint);
    const mintAta = getAssociatedTokenAddressSync(nftMint, wallet.publicKey);
    
    const nftMetadata = findMetadataPda(umi, { mint: nftMint });
    const nftEdition = findMasterEditionPda(umi, { mint: nftMint });

    return program.methods
      .stake()
      .accountsPartial({
        user: wallet.publicKey,
        mint: nftMint,
        collectionMint: collectionMint,
        mintAta,
        metadata: new PublicKey(nftMetadata[0]),
        edition: new PublicKey(nftEdition[0]),
        config: configPDA,
        stakeAccount: stakeAccountPDA,
        userAccount: userAccountPDA,
      })
      .rpc();
  };

  // Unstake NFT
  const unstakeNFT = async (nftMint: PublicKey) => {
    if (!program || !wallet.publicKey) return;

    const userAccountPDA = getUserAccountPDA(wallet.publicKey);
    const stakeAccountPDA = getStakeAccountPDA(nftMint);
    const mintAta = getAssociatedTokenAddressSync(nftMint, wallet.publicKey);
    
    const nftEdition = findMasterEditionPda(umi, { mint: nftMint });

    return program.methods
      .unstake()
      .accountsPartial({
        user: wallet.publicKey,
        mint: nftMint,
        mintAta,
        edition: new PublicKey(nftEdition[0]),
        config: configPDA,
        stakeAccount: stakeAccountPDA,
        userAccount: userAccountPDA,
      })
      .rpc();
  };

  // Claim rewards
  const claimRewards = async () => {
    if (!program || !wallet.publicKey) return;

    const userAccountPDA = getUserAccountPDA(wallet.publicKey);
    const rewardsAta = getAssociatedTokenAddressSync(rewardsMintPDA, wallet.publicKey);

    return program.methods
      .claim()
      .accountsPartial({
        user: wallet.publicKey,
        userAccount: userAccountPDA,
        rewardsMint: rewardsMintPDA,
        config: configPDA,
        rewardsAta,
        systemProgram: PublicKey.default,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      })
      .rpc();
  };

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