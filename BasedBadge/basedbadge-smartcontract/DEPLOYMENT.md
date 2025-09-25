# BasedBadge Deployment Guide

## 🚀 Deployment Instructions

This guide will help you deploy the BasedBadge contract to Base Testnet.

### Prerequisites

- **Foundry installed** - [Install Foundry](https://book.getfoundry.sh/getting-started/installation)
- **Base Sepolia testnet ETH** - Get from [Base Faucet](https://bridge.base.org/deposit)
- **Private key** - Your wallet's private key for deployment

### Environment Setup

1. **Create `.env` file** in the project root:
```bash
PRIVATE_KEY=0x_your_private_key_here
```

2. **Install dependencies** (if not already done):
```bash
forge install
```

### Deployment Options

#### Option 1: Simple Deployment
```bash
forge script script/Deploy.s.sol --rpc-url https://sepolia.base.org --broadcast --verify
```

#### Option 2: Full Deployment with Examples
```bash
forge script script/BasedBadge.s.sol --rpc-url https://sepolia.base.org --broadcast --verify
```

### Deployment Commands

#### Deploy to Base Testnet
```bash
# Simple deployment
forge script script/Deploy.s.sol --rpc-url https://sepolia.base.org --broadcast --verify

# Full deployment with example badges
forge script script/BasedBadge.s.sol --rpc-url https://sepolia.base.org --broadcast --verify
```

#### Deploy to Local Network
```bash
# Start local node
anvil

# Deploy to local network
forge script script/Deploy.s.sol --rpc-url http://localhost:8545 --broadcast
```

### Contract Features

#### 🎯 **Token Types**
- **Certificates** (ID: 1000+) - Non-transferable educational certificates
- **Event Badges** (ID: 2000+) - Transferable event attendance badges
- **Achievements** (ID: 3000+) - Non-transferable achievement medals
- **Workshop Sessions** (ID: 4000+) - Non-transferable workshop tokens

#### 🔐 **Roles**
- **DEFAULT_ADMIN_ROLE** - Full contract control
- **MINTER_ROLE** - Can create and issue badges
- **PAUSER_ROLE** - Can pause/unpause transfers
- **URI_SETTER_ROLE** - Can update token metadata URIs

#### ⚡ **Key Functions**
- `createBadgeType()` - Create new badge types
- `issueBadge()` - Issue single badge
- `batchIssueBadges()` - Issue multiple badges
- `grantAchievement()` - Grant special achievements
- `createWorkshop()` - Create workshop series
- `verifyBadge()` - Verify badge validity

### Post-Deployment

#### 1. **Verify Contract**
The contract will be automatically verified on Base Sepolia if you use the `--verify` flag.

#### 2. **Check Deployment**
```bash
# View deployment details
cast call <CONTRACT_ADDRESS> "name()" --rpc-url https://sepolia.base.org
```

#### 3. **Test Functions**
```bash
# Check if deployer has admin role
cast call <CONTRACT_ADDRESS> "hasRole(bytes32,address)" <DEFAULT_ADMIN_ROLE> <DEPLOYER_ADDRESS> --rpc-url https://sepolia.base.org
```

### Security Best Practices

#### 🔒 **Role Management**
- **Never share private keys**
- **Use multi-sig for production**
- **Regularly rotate admin keys**
- **Monitor role assignments**

#### 🛡️ **Access Control**
- **Limit MINTER_ROLE** to trusted addresses
- **Use PAUSER_ROLE** for emergency stops
- **Monitor URI_SETTER_ROLE** usage

#### 📊 **Monitoring**
- **Track badge issuance**
- **Monitor role changes**
- **Watch for unusual activity**

### Example Usage

#### Create a Certificate Type
```solidity
// Create a certificate type
uint256 certId = basedBadge.createBadgeType(
    "Web3 Developer Certificate",
    "certificate",
    1000, // maxSupply
    false, // non-transferable
    "https://api.example.com/cert/web3-dev"
);
```

#### Issue a Badge
```solidity
// Issue certificate to student
basedBadge.issueBadge(studentAddress, certId);
```

#### Batch Issue Event Badges
```solidity
// Batch issue event badges
address[] memory attendees = [addr1, addr2, addr3];
basedBadge.batchIssueBadges(attendees, eventBadgeId, 1);
```

#### Grant Achievement
```solidity
// Grant special achievement
uint256 achievementId = basedBadge.grantAchievement(
    studentAddress,
    "Code Master",
    2, // rarity (1-4)
    block.timestamp + 365 days // expiry
);
```

### Troubleshooting

#### Common Issues

1. **"Insufficient funds"**
   - Ensure you have enough ETH for gas fees
   - Check your balance on Base Sepolia

2. **"Private key not found"**
   - Verify your `.env` file exists
   - Check the `PRIVATE_KEY` format (should start with `0x`)

3. **"Verification failed"**
   - Ensure your contract is unique
   - Check Base Sepolia explorer for existing contracts

#### Gas Optimization

- **Batch operations** when possible
- **Use appropriate gas limits**
- **Monitor gas prices** on Base Sepolia

### Network Information

- **Network Name**: Base Sepolia
- **Chain ID**: 84532
- **RPC URL**: https://sepolia.base.org
- **Explorer**: https://sepolia.basescan.org
- **Faucet**: https://bridge.base.org/deposit

### Support

For issues or questions:
- **Documentation**: Check the README.md
- **Tests**: Run `forge test` to verify functionality
- **Community**: Join Base Discord for support

---

**⚠️ Important**: This is a testnet deployment. For mainnet, ensure thorough testing and security audits.