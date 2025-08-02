import { useMemo } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider } from '@coral-xyz/anchor';
import type { Idl } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import { IDL } from '../types/anchor_nft_staking';

const PROGRAM_ID = new PublicKey('7dMsiW22eikw4o2hKMjPqg45ftzRM2ibc11VSdpeTdTY');

export const useAnchorProgram = () => {
  const { connection } = useConnection();
  const wallet = useWallet();

  const program = useMemo(() => {
    if (!wallet.publicKey) return null;

    const provider = new AnchorProvider(
      connection,
      wallet as any,
      AnchorProvider.defaultOptions()
    );

    const idlWithAddress: Idl = {
      ...IDL,
      address: PROGRAM_ID.toBase58()
    } as Idl;

    return new Program(
      idlWithAddress,
      provider
    );
  }, [connection, wallet]);

  return { program, programId: PROGRAM_ID };
};