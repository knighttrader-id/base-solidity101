# BasedBadge Smart Contract

An advanced ERC1155-based badge system for certificates, achievements, and workshop tokens built on Base blockchain.

## 🏆 Overview

BasedBadge is a comprehensive multi-token system that supports:
- **Certificates** - Non-transferable soulbound tokens for achievements
- **Event Badges** - Transferable tokens for events and conferences
- **Achievements** - Rare medals with different rarity levels
- **Workshop Tokens** - Session-based learning tokens

## 🚀 Features

### Core Functionality
- ✅ **ERC1155 Multi-Token Standard** - Efficient batch operations
- ✅ **Role-Based Access Control** - MINTER, PAUSER, URI_SETTER roles
- ✅ **Supply Management** - Configurable max supply per token type
- ✅ **Transfer Restrictions** - Non-transferable certificates
- ✅ **Batch Operations** - Efficient event badge distribution
- ✅ **Achievement System** - Rarity-based achievement medals
- ✅ **Workshop Series** - Multi-session workshop tracking

### Security Features
- ✅ **Reentrancy Protection** - Guards against reentrancy attacks
- ✅ **Pause Functionality** - Emergency pause/unpause capabilities
- ✅ **Input Validation** - Comprehensive parameter checking
- ✅ **Supply Limits** - Prevents over-minting
- ✅ **Access Control** - Role-based permissions

## 📋 Token ID Ranges

| Category | Base ID | Range | Transferable | Description |
|----------|---------|-------|--------------|-------------|
| Certificates | 1000 | 1000+ | ❌ No | Soulbound achievement certificates |
| Event Badges | 2000 | 2000+ | ✅ Yes | Transferable event attendance badges |
| Achievements | 3000 | 3000+ | ❌ No | Rare achievement medals |
| Workshops | 4000 | 4000+ | ❌ No | Workshop session tokens |

## 🛠️ Smart Contract Functions

### Core Functions
```solidity
// Create new badge type
function createBadgeType(
    string memory name,
    string memory category,
    uint256 maxSupply,
    bool transferable,
    string memory tokenUri
) external returns (uint256)

// Issue single badge
function issueBadge(address to, uint256 tokenId) external

// Batch issue badges
function batchIssueBadges(
    address[] calldata recipients,
    uint256 tokenId,
    uint256 amount
) external

// Grant achievement with rarity
function grantAchievement(
    address student,
    string memory achievementName,
    uint256 rarity,
    uint256 validUntil
) external returns (uint256)

// Create workshop series
function createWorkshop(
    string memory seriesName,
    uint256 totalSessions
) external returns (uint256[] memory)
```

### View Functions
```solidity
// Get token information
function tokenInfo(uint256 tokenId) external view returns (TokenInfo)

// Verify badge validity
function verifyBadge(address holder, uint256 tokenId) 
    external view returns (bool valid, uint256 earnedTimestamp)

// Check token balance
function balanceOf(address account, uint256 id) external view returns (uint256)
```

## 🚀 Deployment

### Prerequisites
- Foundry installed
- Base Sepolia testnet ETH
- MetaMask or compatible wallet

### Quick Deployment
```bash
# Navigate to smart contract directory
cd BasedBadge/basedbadge-smartcontract

# Install dependencies
forge install

# Run tests
forge test

# Deploy to Base Sepolia
forge script script/BasedBadge.s.sol:BasedBadgeScript \
  --rpc-url https://sepolia.base.org \
  --broadcast \
  --verify \
  --account metamask
```

### Using Deployment Script
```bash
# Make deployment script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

### Contract Address
**Deployed Contract**: `0x5b73C5498c1E3b4dbA84de0F1833c4a029d90519` ✅ DEPLOYED  
**Network**: Base Sepolia (Chain ID: 84532)  
**Explorer**: [View on BaseScan](https://sepolia.basescan.org/address/0x5b73C5498c1E3b4dbA84de0F1833c4a029d90519)  
**Status**: ✅ Fully deployed and tested

## 🧪 Testing

### Run All Tests
```bash
forge test
```

### Run Tests with Gas Report
```bash
forge test --gas-report
```

### Run Specific Test
```bash
forge test --match-path test/BasedBadge.t.sol
```

### Test Contract Functions
```bash
# Make test script executable
chmod +x test-contract.sh

# Run contract tests
./test-contract.sh
```

## 📊 Example Usage

### 1. Create Certificate Type
```solidity
uint256 certId = basedBadge.createBadgeType(
    "Solidity Developer Certificate",
    "certificate",
    1000, // maxSupply
    false, // non-transferable
    "https://api.basedbadge.com/certificates/solidity-developer"
);
```

### 2. Issue Certificate
```solidity
basedBadge.issueBadge(studentAddress, certId);
```

### 3. Create Event Badge
```solidity
uint256 eventId = basedBadge.createBadgeType(
    "Base Workshop Attendee",
    "event",
    500, // maxSupply
    true, // transferable
    "https://api.basedbadge.com/events/base-workshop"
);
```

### 4. Batch Issue Event Badges
```solidity
address[] memory attendees = [addr1, addr2, addr3];
basedBadge.batchIssueBadges(attendees, eventId, 1);
```

### 5. Grant Achievement
```solidity
uint256 achievementId = basedBadge.grantAchievement(
    studentAddress,
    "First Contribution",
    2, // rarity (1-4)
    0  // no expiry
);
```

## 🔐 Roles and Permissions

| Role | Description | Functions |
|------|-------------|-----------|
| `DEFAULT_ADMIN_ROLE` | Full contract control | All functions |
| `MINTER_ROLE` | Can mint tokens | `createBadgeType`, `issueBadge`, `batchIssueBadges`, `grantAchievement` |
| `PAUSER_ROLE` | Can pause contract | `pause`, `unpause` |
| `URI_SETTER_ROLE` | Can update metadata | `setUri` |

## 📈 Gas Optimization

The contract is optimized for gas efficiency:
- **Batch Operations**: Efficient batch minting for events
- **Supply Checks**: Early validation to prevent wasted gas
- **Event Logging**: Minimal gas cost for comprehensive logging
- **Storage Optimization**: Efficient data structures

## 🛡️ Security Considerations

### Implemented Security Measures
- **Reentrancy Protection**: All external functions protected
- **Access Control**: Role-based permissions
- **Input Validation**: Comprehensive parameter checking
- **Supply Limits**: Prevents over-minting
- **Pause Functionality**: Emergency stop mechanism

### Best Practices
- Always verify token existence before operations
- Use batch operations for multiple recipients
- Implement proper role management
- Monitor contract events for audit trails

## 📚 API Reference

### Events
```solidity
event TokenTypeCreated(uint256 indexed tokenId, string name, string category);
event BadgeIssued(uint256 indexed tokenId, address to, uint256 amount);
event BatchBadgesIssued(uint256 indexed tokenId, uint256 count, uint256 amount);
event AchievementGranted(uint256 indexed tokenId, address student, string achievement);
```

### Data Structures
```solidity
struct TokenInfo {
    string name;
    string category;
    uint256 maxSupply;
    bool isTransferable;
    uint256 validUntil;
    address issuer;
}
```

## 🔗 Integration

### Frontend Integration
The contract integrates seamlessly with the BasedBadge frontend:
- **Wagmi v2** hooks for contract interaction
- **Real-time event listening** for UI updates
- **Batch operation support** for efficient UX
- **Role-based UI** showing appropriate functions

### Web3 Integration
- **MetaMask** wallet connection
- **Base Sepolia** testnet support
- **Contract ABI** included in frontend
- **TypeScript** type definitions

## 🚀 Future Enhancements

- [ ] **Metadata Standards**: ERC-1155 metadata extension
- [ ] **Upgradeable Contracts**: Proxy pattern implementation
- [ ] **Cross-Chain Support**: Multi-chain badge system
- [ ] **Analytics**: Advanced badge analytics
- [ ] **Governance**: DAO-based badge management

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 🆘 Support

For support and questions:
- **GitHub Issues**: Report bugs and request features
- **Documentation**: Check the comprehensive docs
- **Community**: Join our developer community

---

**Built with ❤️ for the Base ecosystem**