# BasedCertificate Deployment Guide

## Prerequisites

1. **Private Key**: You need a private key with some ETH on Base Testnet
2. **Environment Variables**: Set up your `.env` file with the required keys

## Setup

### 1. Configure Environment Variables

Add your private key to the `.env` file:

```bash
# Add your private key (with 0x prefix)
PRIVATE_KEY=0xyour_private_key_here

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
forge script script/BasedCertificate.s.sol --rpc-url https://sepolia.base.org --broadcast --verify

# Deploy without verification (faster)
forge script script/BasedCertificate.s.sol --rpc-url https://sepolia.base.org --broadcast
```

### Deploy to Local Network (for testing)

```bash
# Start local node
anvil

# In another terminal, deploy to local
forge script script/BasedCertificate.s.sol --rpc-url http://localhost:8545 --broadcast
```

## Contract Features

The updated BasedCertificate contract includes:

- **Soulbound NFTs**: Non-transferable certificates
- **Role-based Access Control**: ISSUER_ROLE and MANAGER_ROLE
- **Duplicate Prevention**: Prevents issuing duplicate certificates
- **Certificate Management**: Issue, revoke, update, and burn certificates
- **Metadata Support**: URI-based certificate metadata
- **Events**: Comprehensive event logging

## Post-Deployment

After deployment, you can:

1. **Check Contract**: Verify the contract on BaseScan
2. **Test Functions**: Use the frontend to interact with the contract
3. **Issue Certificates**: Use `issueCertificate()` function
4. **Manage Certificates**: Use manager functions for revoke/update/burn

## Available Functions

### For Issuers (ISSUER_ROLE):
- `issueCertificate()` - Issue new certificates

### For Managers (MANAGER_ROLE):
- `revokeCertificate()` - Revoke certificates
- `updateCertificate()` - Update certificate data
- `burnCertificate()` - Burn certificates

### For Certificate Owners:
- `burnCertificate()` - Burn their own certificates

## Security Notes

- Keep your private key secure
- Never commit private keys to version control
- Use environment variables for sensitive data
- Test on testnet before mainnet deployment
- Certificates are soulbound (non-transferable)
