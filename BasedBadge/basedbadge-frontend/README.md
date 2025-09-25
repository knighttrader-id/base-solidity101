# BasedBadge Frontend

A modern Web3 frontend for the BasedBadge ERC1155 multi-token system built on Base Sepolia testnet.

## 🚀 Features

### Badge Management
- **Create Badge Types** - Create new badge categories with metadata
- **Issue Badges** - Issue single badges to recipients
- **Batch Issue Badges** - Issue multiple badges to multiple recipients
- **Grant Achievements** - Create special achievement badges with rarity levels
- **Create Workshops** - Create workshop series with multiple sessions

### Badge Categories
- **Certificates** (ID: 1000+) - Non-transferable educational certificates
- **Event Badges** (ID: 2000+) - Transferable event attendance badges
- **Achievements** (ID: 3000+) - Non-transferable achievement medals
- **Workshop Sessions** (ID: 4000+) - Non-transferable workshop tokens

### Role-Based Access Control
- **MINTER_ROLE** - Can create and issue badges
- **PAUSER_ROLE** - Can pause/unpause transfers
- **URI_SETTER_ROLE** - Can update token metadata URIs
- **DEFAULT_ADMIN_ROLE** - Full contract control

### Badge Features
- **Multi-Token Support** - ERC1155 standard for efficient badge management
- **Transferability Control** - Some badges are non-transferable (soulbound)
- **Supply Limits** - Set maximum supply for badge types
- **Metadata Support** - URI-based badge information
- **Verification System** - Verify badge validity and ownership

## 🛠️ Technology Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Web3**: Wagmi v2, Viem
- **Blockchain**: Base Sepolia Testnet
- **Contract**: BasedBadge.sol (ERC1155 Multi-Token)

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- MetaMask or compatible Web3 wallet
- Base Sepolia testnet ETH

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
The contract address is hardcoded to the deployed BasedBadge contract:
- **Contract Address**: `0x5b73C5498c1E3b4dbA84de0F1833c4a029d90519` ✅ DEPLOYED
- **Network**: Base Sepolia Testnet (Chain ID: 84532)
- **Explorer**: https://sepolia.basescan.org/address/0x5b73C5498c1E3b4dbA84de0F1833c4a029d90519

### 3. Start Development Server
```bash
npm run dev
```

### 4. Access the Application
Open [http://localhost:3001](http://localhost:3001) in your browser.

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 🌐 Network Configuration

### Base Sepolia Testnet
- **Network Name**: Base Sepolia
- **RPC URL**: https://sepolia.base.org
- **Chain ID**: 84532
- **Currency Symbol**: ETH
- **Block Explorer**: https://sepolia.basescan.org

### Getting Testnet ETH
- [Base Faucet](https://bridge.base.org/deposit)
- [Alchemy Faucet](https://sepoliafaucet.com/)

## 📱 Usage Guide

### For Badge Creators (MINTER_ROLE)
1. **Create Badge Types** - Define new badge categories with metadata
2. **Issue Badges** - Award badges to recipients
3. **Batch Issue** - Award multiple badges efficiently
4. **Grant Achievements** - Create special achievement badges
5. **Create Workshops** - Set up workshop series

### For Badge Holders
1. **View Badges** - Check your badge collection
2. **Verify Badges** - Verify badge validity and ownership
3. **Transfer Badges** - Transfer transferable badges (if allowed)

### For Administrators
1. **Pause/Unpause** - Control badge transfers
2. **Update URIs** - Modify badge metadata
3. **Role Management** - Grant and revoke roles

## 🔐 Security Features

- **Role-Based Access Control** - Different permissions for different roles
- **Input Validation** - Comprehensive form validation
- **Error Handling** - Clear error messages and feedback
- **Transferability Control** - Some badges are non-transferable
- **Supply Limits** - Prevent over-minting of badges
- **Reentrancy Protection** - Secure contract interactions

## 🎨 UI Components

### Badge Operations
- **Create Badge Type Form** - Complete form with validation
- **Issue Badge Forms** - Single and batch issue operations
- **Achievement Granting** - Special achievement creation
- **Workshop Creation** - Workshop series setup
- **Badge Verification** - Verify badge validity and ownership

### Real-time Features
- **Event Watching** - Live updates for badge events
- **Status Indicators** - Connection and contract status
- **Loading States** - Visual feedback during transactions
- **Role Display** - Show user permissions

## 📊 Contract Information

- **Contract Address**: `0x5b73C5498c1E3b4dbA84de0F1833c4a029d90519`
- **Contract Type**: ERC1155 Multi-Token
- **Features**: Role-based access, Pausable, Supply limits, Metadata support
- **Network**: Base Sepolia Testnet
- **Explorer**: https://sepolia.basescan.org/address/0x5b73C5498c1E3b4dbA84de0F1833c4a029d90519

## 🔍 Available Functions

### Public Functions
- `tokenInfo(uint256)` - Get badge information by token ID
- `verifyBadge(address, uint256)` - Verify badge validity and ownership
- `balanceOf(address, uint256)` - Check badge balance
- `uri(uint256)` - Get metadata URI for badge

### Minter Functions (MINTER_ROLE)
- `createBadgeType(string, string, uint256, bool, string)` - Create new badge type
- `issueBadge(address, uint256)` - Issue single badge
- `batchIssueBadges(address[], uint256, uint256)` - Issue multiple badges
- `grantAchievement(address, string, uint256, uint256)` - Grant achievement
- `createWorkshop(string, uint256)` - Create workshop series

### Pauser Functions (PAUSER_ROLE)
- `pause()` - Pause all transfers
- `unpause()` - Unpause all transfers

### URI Setter Functions (URI_SETTER_ROLE)
- `setURI(uint256, string)` - Update badge metadata URI

## 🚨 Important Notes

1. **Token ID Ranges** - Different categories use different ID ranges
2. **Transferability** - Some badges are non-transferable (soulbound)
3. **Supply Limits** - Respect maximum supply constraints
4. **Role Requirements** - Ensure you have the correct role before attempting operations
5. **Testnet Only** - This is for testing purposes on Base Sepolia

## 🐛 Troubleshooting

### Common Issues
- **Wallet Not Connected** - Make sure MetaMask is connected to Base Sepolia
- **Insufficient ETH** - Get testnet ETH from faucets
- **Wrong Network** - Ensure you're on Base Sepolia (Chain ID: 84532)
- **Role Errors** - Check if you have the required role for the operation

### Getting Help
- Check the browser console for detailed error messages
- Verify your wallet is connected to the correct network
- Ensure you have sufficient ETH for gas fees

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Built on Base • Powered by Web3 • Secure & Decentralized**