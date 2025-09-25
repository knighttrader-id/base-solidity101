# BasedCertificate Smart Contract

A comprehensive NFT-based certificate system built on the Base blockchain for issuing, managing, and tracking digital certificates. This soulbound NFT system ensures certificates are non-transferable and permanently linked to their recipients.

## 🎯 Overview

BasedCertificate is a sophisticated smart contract system that enables organizations to issue digital certificates as NFTs. These certificates are "soulbound" (non-transferable) and include comprehensive metadata for tracking achievements, graduations, training completions, and other accomplishments.

## ✨ Key Features

### 🔒 Security & Compliance
- **Soulbound Tokens**: Certificates are non-transferable by design
- **Reentrancy Protection**: OpenZeppelin's ReentrancyGuard implementation
- **Access Control**: Role-based permission system
- **Duplicate Prevention**: Unique certificate identification system
- **Input Validation**: Comprehensive parameter checking

### 🎓 Certificate Management
- **Issue Certificates**: Create new certificates with metadata
- **Revoke Certificates**: Mark certificates as invalid
- **Update Certificates**: Modify certificate information
- **Burn Certificates**: Permanently remove certificates
- **View Certificates**: Query certificate details and ownership

### 👥 Role-Based Access Control
- **DEFAULT_ADMIN_ROLE**: Full administrative control
- **ISSUER_ROLE**: Permission to issue new certificates
- **REVOKER_ROLE**: Permission to revoke certificates
- **UPDATER_ROLE**: Permission to update certificate information
- **BURNER_ROLE**: Permission to burn certificates

## 🏗️ Contract Architecture

### Inheritance Chain
```solidity
BasedCertificate
├── ERC721 (NFT standard)
├── ERC721URIStorage (metadata storage)
├── ERC721Burnable (burning capability)
├── AccessControl (role management)
└── ReentrancyGuard (security)
```

### Key Storage Variables
- `certificates`: Mapping of tokenId to certificate data
- `certificateHashes`: Mapping to prevent duplicate certificates
- `certificateCount`: Total number of certificates issued

## 📋 Contract Functions

### Certificate Operations

#### `issueCertificate`
Issues a new certificate to a recipient.
```solidity
function issueCertificate(
    address to,
    string memory recipientName,
    string memory course,
    string memory issuer,
    string memory uri
) public onlyRole(ISSUER_ROLE) nonReentrant
```

**Parameters:**
- `to`: Recipient address
- `recipientName`: Name of the certificate recipient
- `course`: Course or achievement name
- `issuer`: Issuing organization
- `uri`: Metadata URI

#### `revokeCertificate`
Revokes a certificate, marking it as invalid.
```solidity
function revokeCertificate(uint256 tokenId) public onlyRole(REVOKER_ROLE)
```

#### `updateCertificate`
Updates certificate course information.
```solidity
function updateCertificate(uint256 tokenId, string memory newCourse) 
    public onlyRole(UPDATER_ROLE)
```

#### `burnCertificate`
Permanently removes a certificate.
```solidity
function burnCertificate(uint256 tokenId) public onlyRole(BURNER_ROLE)
```

### Query Functions

#### `getCertificateData`
Returns complete certificate information.
```solidity
function getCertificateData(uint256 tokenId) 
    public view returns (string memory, string memory, string memory, uint256, bool)
```

#### `getCertificatesByOwner`
Returns all certificate IDs owned by an address.
```solidity
function getCertificatesByOwner(address owner) 
    public view returns (uint256[] memory)
```

### Role Management

#### `grantRole`
Grants a role to an account.
```solidity
function grantRole(bytes32 role, address account) public onlyRole(getRoleAdmin(role))
```

#### `revokeRole`
Revokes a role from an account.
```solidity
function revokeRole(bytes32 role, address account) public onlyRole(getRoleAdmin(role))
```

## 📊 Events

The contract emits the following events for tracking and monitoring:

```solidity
event CertificateIssued(
    uint256 indexed tokenId,
    address indexed to,
    string recipientName,
    string course,
    string issuer
);

event CertificateRevoked(uint256 indexed tokenId);
event CertificateUpdated(uint256 indexed tokenId, string newCourse);
event CertificateBurned(uint256 indexed tokenId);
```

## 🚀 Deployment

### Prerequisites
- Foundry installed
- Base Sepolia testnet access
- Private key with sufficient ETH for gas

### Deployment Steps

1. **Set up environment variables:**
   ```bash
   export PRIVATE_KEY=your_private_key_here
   export ETHERSCAN_API_KEY=your_etherscan_api_key
   ```

2. **Deploy the contract:**
   ```bash
   forge script script/BasedCertificate.s.sol:BasedCertificateScript \
     --rpc-url https://sepolia.base.org \
     --broadcast \
     --verify
   ```

3. **Verify deployment:**
   ```bash
   forge verify-contract <contract_address> src/BasedCertificate.sol:BasedCertificate \
     --chain-id 84532 \
     --etherscan-api-key $ETHERSCAN_API_KEY
   ```

### Constructor Parameters
The contract is deployed with the deployer automatically assigned the `DEFAULT_ADMIN_ROLE`.

## 🧪 Testing

### Running Tests
```bash
# Run all tests
forge test

# Run tests with gas reporting
forge test --gas-report

# Run specific test file
forge test --match-path test/BasedCertificate.t.sol

# Run tests with verbose output
forge test -vvv
```

### Test Coverage
The test suite covers:
- ✅ Contract deployment
- ✅ Certificate issuance
- ✅ Certificate revocation
- ✅ Certificate updates
- ✅ Certificate burning
- ✅ Role management
- ✅ Access control
- ✅ Duplicate prevention
- ✅ Reentrancy protection
- ✅ Event emission

### Test Structure
```
test/
├── BasedCertificate.t.sol          # Main test file
├── fixtures/                        # Test fixtures
├── utils/                          # Test utilities
└── mocks/                          # Mock contracts
```

## 🔐 Security Considerations

### Security Features Implemented
- **ReentrancyGuard**: Protection against reentrancy attacks
- **AccessControl**: Role-based access control system
- **Input Validation**: Comprehensive parameter checking
- **Duplicate Prevention**: Hash-based certificate uniqueness
- **Event Logging**: Complete audit trail

### Security Best Practices
- All external functions are protected with appropriate modifiers
- State changes are atomic and consistent
- Events are emitted for all state-changing operations
- Input validation prevents invalid data entry
- Role-based access control limits function access

### Audit Recommendations
While this contract uses well-audited OpenZeppelin components, consider:
- Professional security audit before mainnet deployment
- Formal verification for critical functions
- Penetration testing of the complete system
- Regular security reviews and updates

## 📈 Gas Optimization

### Gas-Efficient Features
- **Packed Structs**: Optimized storage layout
- **Batch Operations**: Efficient bulk operations
- **Event Optimization**: Minimal event data
- **Storage Optimization**: Reduced storage operations

### Gas Usage Estimates
- Certificate Issuance: ~150,000 gas
- Certificate Revocation: ~50,000 gas
- Certificate Update: ~60,000 gas
- Certificate Burning: ~40,000 gas

## 🔧 Development

### Local Development
```bash
# Install dependencies
forge install

# Compile contracts
forge build

# Run tests
forge test

# Generate gas report
forge test --gas-report
```

### Code Quality
- **Solidity Style Guide**: Follows official Solidity style guide
- **Documentation**: Comprehensive NatSpec documentation
- **Error Handling**: Descriptive error messages
- **Event Emission**: All state changes are logged

## 📚 API Reference

### View Functions
| Function | Description | Gas Cost |
|----------|-------------|----------|
| `getCertificateData(tokenId)` | Get certificate details | ~2,000 |
| `getCertificatesByOwner(owner)` | Get owner's certificates | ~5,000 |
| `hasRole(role, account)` | Check role assignment | ~2,000 |
| `getRoleAdmin(role)` | Get role admin | ~2,000 |

### State-Changing Functions
| Function | Description | Gas Cost |
|----------|-------------|----------|
| `issueCertificate(...)` | Issue new certificate | ~150,000 |
| `revokeCertificate(tokenId)` | Revoke certificate | ~50,000 |
| `updateCertificate(...)` | Update certificate | ~60,000 |
| `burnCertificate(tokenId)` | Burn certificate | ~40,000 |

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](../../CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.

## 🆘 Support

For support and questions:
- **Documentation**: Check this README and inline code comments
- **Issues**: Create an issue on GitHub
- **Discussions**: Join our community discussions

## 🔗 Links

- **Base Blockchain**: https://base.org
- **Base Sepolia**: https://sepolia.base.org
- **Foundry Documentation**: https://book.getfoundry.sh
- **OpenZeppelin**: https://docs.openzeppelin.com
- **ERC-721 Standard**: https://eips.ethereum.org/EIPS/eip-721

---

**Built with ❤️ for the Base ecosystem**