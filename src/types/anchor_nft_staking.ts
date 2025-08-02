import { IdlAccounts, IdlTypes, Idl } from '@coral-xyz/anchor';

export interface AnchorNftStaking extends Idl {
  version: "0.1.0";
  name: "anchor_nft_staking";
  instructions: [
    {
      name: "initializeConfig";
      accounts: [
        {
          name: "admin";
          isMut: true;
          isSigner: true;
        },
        {
          name: "config";
          isMut: true;
          isSigner: false;
        },
        {
          name: "rewardsMint";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "pointsPerStake";
          type: "u8";
        },
        {
          name: "maxStake";
          type: "u8";
        },
        {
          name: "freezePeriod";
          type: "u32";
        }
      ];
    },
    {
      name: "initializeUser";
      accounts: [
        {
          name: "user";
          isMut: true;
          isSigner: true;
        },
        {
          name: "userAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "stake";
      accounts: [
        {
          name: "user";
          isMut: true;
          isSigner: true;
        },
        {
          name: "mint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "collectionMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "mintAta";
          isMut: true;
          isSigner: false;
        },
        {
          name: "metadata";
          isMut: false;
          isSigner: false;
        },
        {
          name: "edition";
          isMut: false;
          isSigner: false;
        },
        {
          name: "config";
          isMut: false;
          isSigner: false;
        },
        {
          name: "stakeAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "userAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "metadataProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "unstake";
      accounts: [
        {
          name: "user";
          isMut: true;
          isSigner: true;
        },
        {
          name: "mint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "mintAta";
          isMut: true;
          isSigner: false;
        },
        {
          name: "edition";
          isMut: false;
          isSigner: false;
        },
        {
          name: "config";
          isMut: false;
          isSigner: false;
        },
        {
          name: "stakeAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "userAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "metadataProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "claim";
      accounts: [
        {
          name: "user";
          isMut: true;
          isSigner: true;
        },
        {
          name: "userAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "rewardsMint";
          isMut: true;
          isSigner: false;
        },
        {
          name: "config";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rewardsAta";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "associatedTokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    }
  ];
  accounts: [
    {
      name: "config";
      type: {
        kind: "struct";
        fields: [
          {
            name: "pointsPerStake";
            type: "u8";
          },
          {
            name: "maxStake";
            type: "u8";
          },
          {
            name: "freezePeriod";
            type: "u32";
          },
          {
            name: "rewardsBump";
            type: "u8";
          },
          {
            name: "bump";
            type: "u8";
          }
        ];
      };
    },
    {
      name: "stakeAccount";
      type: {
        kind: "struct";
        fields: [
          {
            name: "owner";
            type: "publicKey";
          },
          {
            name: "mint";
            type: "publicKey";
          },
          {
            name: "stakedAt";
            type: "i64";
          },
          {
            name: "bump";
            type: "u8";
          }
        ];
      };
    },
    {
      name: "user";
      type: {
        kind: "struct";
        fields: [
          {
            name: "points";
            type: "u32";
          },
          {
            name: "amountStaked";
            type: "u8";
          },
          {
            name: "bump";
            type: "u8";
          }
        ];
      };
    }
  ];
  errors: [
    {
      code: 6000;
      name: "MaxStakeReached";
      msg: "You have reached the maximum number of NFTs you can stake";
    },
    {
      code: 6001;
      name: "FreezePeriodNotPassed";
      msg: "The freeze period has not passed yet";
    }
  ];
}

export type AnchorNftStakingAccounts = IdlAccounts<AnchorNftStaking>;
export type AnchorNftStakingTypes = IdlTypes<AnchorNftStaking>;

// Account types
export type ConfigAccount = AnchorNftStakingAccounts["config"];
export type UserAccount = AnchorNftStakingAccounts["user"];
export type StakeAccount = AnchorNftStakingAccounts["stakeAccount"];