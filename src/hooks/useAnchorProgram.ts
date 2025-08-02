import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useMemo } from 'react';
import { AnchorNftStaking } from '../types/anchor-nft-staking';
import idl from '../idl/anchor_nft_staking.json';
import { PublicKey } from '@solana/web3.js';

// Program ID from the deployed contract
const PROGRAM_ID = new PublicKey('7dMsiW22eikw4o2hKMjPqg45ftzRM2ibc11VSdpeTdTY');

export const useAnchorProgram = () => {
  const { connection } = useConnection();
  const wallet = useWallet();

  const provider = useMemo(() => {
    if (!wallet) return null;
    return new AnchorProvider(
      connection,
      wallet as any,
      { commitment: 'confirmed' }
    );
  }, [connection, wallet]);

  const program = useMemo(() => {
    if (!provider) return null;
    
    // Add the program ID to the IDL for convenience
    const idlWithAddress = {
      ...idl,
      address: PROGRAM_ID.toString(),
    };
    
    // Cast the IDL to the correct type
    return new Program<AnchorNftStaking>(
      idlWithAddress as unknown as AnchorNftStaking,
      PROGRAM_ID,
      provider
    );
  }, [provider]);

  return { program };
};