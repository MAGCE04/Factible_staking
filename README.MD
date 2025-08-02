# 🎯 NFT Staking — Template

**Type:** Anchor

---

## 📘 Use Case

This template enables **staking NFTs to earn points** over time.  
Each NFT staked increases the user's score based on a configurable rate and duration.  
Commonly used in GameFi, loyalty programs, NFT-powered access systems, or on-chain progression mechanics.

---

## 🧱 Data Structure

| Account         | Description                                                                 |
|------------------|-----------------------------------------------------------------------------|
| `Config`         | Global configuration (points per stake, max stake, freeze period)          |
| `User`           | Tracks each user's total staked amount and earned points                   |
| `StakeAccount`   | Stores staking info per NFT (owner, mint, timestamp)                       |

---

## 🧾 Instructions

| Name                | Description                                                              |
|---------------------|--------------------------------------------------------------------------|
| `initialize_config` | Initializes the staking rules (point rate, limits, freeze duration)      |
| `initialize_user`   | Initializes a user profile for staking                                   |
| `stake`             | Stakes a single NFT and starts tracking it                               |
| `unstake`           | Unstakes an NFT (after optional freeze period)                           |
| `claim`             | Claims the points earned from staking                                     |

---

## 💡 Staking Rules

- **Points per Stake**: Number of points awarded per NFT per claim cycle
- **Max Stake**: Maximum NFTs a user can stake
- **Freeze Period**: Minimum slots before an NFT can be unstaked

---

## 📦 Example Parameters

- `points_per_stake`: 5  
- `max_stake`: 3  
- `freeze_period`: 1000 slots (approx ~8 minutes)