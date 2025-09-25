# BasedToken Deployment Guide

## Prerequisites

1. **Private Key**: You need a private key with some ETH on Base Testnet
2. **Environment Variables**: Set up your `.env` file with the required keys

## Setup

### 1. Configure Environment Variables

Add your private key to the `.env` file:

```bash
# Add your private key (without 0x prefix)
PRIVATE_KEY=your_private_key_here

# Etherscan API key (already configured)
ETHERSCAN_API_KEY=XV4KEHGY9DAD38SVS3F9H36AUQG88M8S92
```

### 2. Get Testnet ETH

You can get Base Testnet ETH from:
- [Base Faucet](https://bridge.base.org/deposit)
- [Alchemy Faucet](https://sepoliafaucet.com/)

## Deployment Commands

### Deploy to Base Testnet

```bash
# Deploy and verify on Base Testnet
forge script script/BasedToken.s.sol --rpc-url https://sepolia.base.org --broadcast --verify

# Deploy without verification (faster)
forge script script/BasedToken.s.sol --rpc-url https://sepolia.base.org --broadcast
```

### Deploy to Local Network (for testing)

```bash
# Start local node
anvil

# In another terminal, deploy to local
forge script script/BasedToken.s.sol --rpc-url http://localhost:8545 --broadcast
```

## Contract Features

The updated BasedToken contract includes:

- **Initial Supply**: 1,000,000 BASED tokens
- **Daily Reward**: 10 BASED tokens (configurable)
- **Role-based Access Control**: Admin, Minter, Pauser roles
- **Blacklist Functionality**: Single and batch operations
- **Pause/Unpause**: Emergency stop functionality
- **Events**: Comprehensive event logging

## Post-Deployment

After deployment, you can:

1. **Check Contract**: Verify the contract on BaseScan
2. **Test Functions**: Use the frontend to interact with the contract
3. **Monitor Events**: Watch for UserBlacklisted, RewardClaimed, etc.

## Security Notes

- Keep your private key secure
- Never commit private keys to version control
- Use environment variables for sensitive data
- Test on testnet before mainnet deployment
