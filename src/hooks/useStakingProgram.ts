import { useState, useCallback } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddressSync } from '@solana/spl-token';
import { findMasterEditionPda, findMetadataPda } from '@metaplex-foundation/mpl-token-metadata';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { publicKey as umiPublicKey } from '@metaplex-foundation/umi';
import { useAnchorProgram } from './useAnchorProgram';

export interface UserAccount {
  points: number;
  amountStaked: number;
  bump: number;
}

export interface StakeAccount {
  owner: PublicKey;
  mint: PublicKey;
  stakedAt: number;
  bump: number;
}

export interface Config {
  pointsPerStake: number;
  maxStake: number;
  freezePeriod: number;
  rewardsBump: number;
  bump: number;
}

export const useStakingProgram = () => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const { program, programId } = useAnchorProgram();
  const [loading, setLoading] = useState(false);
  const [userAccount, setUserAccount] = useState<UserAccount | null>(null);
  const [config, setConfig] = useState<Config | null>(null);

  const umi = createUmi(connection);

  // Derive PDAs
  const getConfigPDA = useCallback(() => {
    return PublicKey.findProgramAddressSync(
      [Buffer.from('config')],
      programId
    )[0];
  }, [programId]);

  const getRewardsMintPDA = useCallback(() => {
    const configPDA = getConfigPDA();
    return PublicKey.findProgramAddressSync(
      [Buffer.from('rewards'), configPDA.toBuffer()],
      programId
    )[0];
  }, [programId, getConfigPDA]);

  const getUserAccountPDA = useCallback(() => {
    if (!publicKey) return null;
    return PublicKey.findProgramAddressSync(
      [Buffer.from('user'), publicKey.toBuffer()],
      programId
    )[0];
  }, [publicKey, programId]);

  const getStakeAccountPDA = useCallback((mintAddress: PublicKey) => {
    const configPDA = getConfigPDA();
    return PublicKey.findProgramAddressSync(
      [Buffer.from('stake'), mintAddress.toBuffer(), configPDA.toBuffer()],
      programId
    )[0];
  }, [programId, getConfigPDA]);

  // Fetch user account
  const fetchUserAccount = useCallback(async () => {
    if (!program || !publicKey) return null;

    try {
      const userAccountPDA = getUserAccountPDA();
      if (!userAccountPDA) return null;

      const account = await program.account.user.fetch(userAccountPDA);
      const userData = {
        points: account.points,
        amountStaked: account.amountStaked,
        bump: account.bump,
      };
      setUserAccount(userData);
      return userData;
    } catch (error) {
      console.log('User account not found or error fetching:', error);
      setUserAccount(null);
      return null;
    }
  }, [program, publicKey, getUserAccountPDA]);

  // Fetch config
  const fetchConfig = useCallback(async () => {
    if (!program) return null;

    try {
      const configPDA = getConfigPDA();
      const account = await program.account.config.fetch(configPDA);
      const configData = {
        pointsPerStake: account.pointsPerStake,
        maxStake: account.maxStake,
        freezePeriod: account.freezePeriod,
        rewardsBump: account.rewardsBump,
        bump: account.bump,
      };
      setConfig(configData);
      return configData;
    } catch (error) {
      console.log('Config not found or error fetching:', error);
      setConfig(null);
      return null;
    }
  }, [program, getConfigPDA]);

  // Initialize user account
  const initializeUser = useCallback(async () => {
    if (!program || !publicKey) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    try {
      const userAccountPDA = getUserAccountPDA();
      if (!userAccountPDA) throw new Error('Cannot derive user account PDA');

      const tx = await program.methods
        .initializeUser()
        .accountsPartial({
          user: publicKey,
          userAccount: userAccountPDA,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      console.log('User account initialized:', tx);
      await fetchUserAccount();
      return tx;
    } catch (error) {
      console.error('Error initializing user:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [program, publicKey, getUserAccountPDA, fetchUserAccount]);

  // Stake NFT
  const stakeNFT = useCallback(async (mintAddress: string, collectionMintAddress: string) => {
    if (!program || !publicKey) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    try {
      const mint = new PublicKey(mintAddress);
      const collectionMint = new PublicKey(collectionMintAddress);
      
      const mintAta = getAssociatedTokenAddressSync(mint, publicKey);
      const configPDA = getConfigPDA();
      const userAccountPDA = getUserAccountPDA();
      const stakeAccountPDA = getStakeAccountPDA(mint);

      if (!userAccountPDA) throw new Error('Cannot derive user account PDA');

      // Get metadata and edition PDAs using UMI
      const nftMetadata = findMetadataPda(umi, { mint: umiPublicKey(mint.toString()) });
      const nftEdition = findMasterEditionPda(umi, { mint: umiPublicKey(mint.toString()) });

      const tx = await program.methods
        .stake()
        .accountsPartial({
          user: publicKey,
          mint,
          collectionMint,
          mintAta,
          metadata: new PublicKey(nftMetadata[0]),
          edition: new PublicKey(nftEdition[0]),
          config: configPDA,
          stakeAccount: stakeAccountPDA,
          userAccount: userAccountPDA,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          metadataProgram: new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'),
        })
        .rpc();

      console.log('NFT staked:', tx);
      await fetchUserAccount();
      return tx;
    } catch (error) {
      console.error('Error staking NFT:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [program, publicKey, getConfigPDA, getUserAccountPDA, getStakeAccountPDA, fetchUserAccount, umi]);

  // Unstake NFT
  const unstakeNFT = useCallback(async (mintAddress: string) => {
    if (!program || !publicKey) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    try {
      const mint = new PublicKey(mintAddress);
      const mintAta = getAssociatedTokenAddressSync(mint, publicKey);
      const configPDA = getConfigPDA();
      const userAccountPDA = getUserAccountPDA();
      const stakeAccountPDA = getStakeAccountPDA(mint);

      if (!userAccountPDA) throw new Error('Cannot derive user account PDA');

      // Get edition PDA using UMI
      const nftEdition = findMasterEditionPda(umi, { mint: umiPublicKey(mint.toString()) });

      const tx = await program.methods
        .unstake()
        .accountsPartial({
          user: publicKey,
          mint,
          mintAta,
          edition: new PublicKey(nftEdition[0]),
          config: configPDA,
          stakeAccount: stakeAccountPDA,
          userAccount: userAccountPDA,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          metadataProgram: new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'),
        })
        .rpc();

      console.log('NFT unstaked:', tx);
      await fetchUserAccount();
      return tx;
    } catch (error) {
      console.error('Error unstaking NFT:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [program, publicKey, getConfigPDA, getUserAccountPDA, getStakeAccountPDA, fetchUserAccount, umi]);

  // Claim rewards
  const claimRewards = useCallback(async () => {
    if (!program || !publicKey) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    try {
      const configPDA = getConfigPDA();
      const userAccountPDA = getUserAccountPDA();
      const rewardsMint = getRewardsMintPDA();
      const rewardsAta = getAssociatedTokenAddressSync(rewardsMint, publicKey);

      if (!userAccountPDA) throw new Error('Cannot derive user account PDA');

      const tx = await program.methods
        .claim()
        .accountsPartial({
          user: publicKey,
          userAccount: userAccountPDA,
          rewardsMint,
          config: configPDA,
          rewardsAta,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        })
        .rpc();

      console.log('Rewards claimed:', tx);
      await fetchUserAccount();
      return tx;
    } catch (error) {
      console.error('Error claiming rewards:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [program, publicKey, getConfigPDA, getUserAccountPDA, getRewardsMintPDA, fetchUserAccount]);

  return {
    userAccount,
    config,
    loading,
    initializeUser,
    stakeNFT,
    unstakeNFT,
    claimRewards,
    fetchUserAccount,
    fetchConfig,
    getUserAccountPDA,
    getStakeAccountPDA,
  };
};