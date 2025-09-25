# BasedToken Smart Contract

An advanced ERC-20 token implementation built for the Base blockchain with enhanced features including role-based access control, pausing functionality, daily rewards, and address blacklisting capabilities.

## 🎯 Overview

BasedToken is a comprehensive ERC-20 compliant token that extends standard functionality with enterprise-grade features. Built using OpenZeppelin's battle-tested libraries, it provides a secure foundation for utility tokens, governance tokens, and reward systems on the Base blockchain.

## ✨ Key Features

### 🪙 Core ERC-20 Functionality
- **Standard Compliance**: Full ERC-20 interface implementation
- **Transfer Operations**: Send tokens between addresses
- **Approval System**: Delegate spending allowances
- **Balance Queries**: Check account balances and total supply
- **Event Logging**: Complete transaction history

### 🔥 Advanced Features
- **Burnable Tokens**: Users can destroy their own tokens
- **Pausable Transfers**: Emergency stop mechanism for all operations
- **Daily Rewards**: Users can claim 10 tokens once per day
- **Address Blacklisting**: Prevent specific addresses from transacting
- **Role-Based Access**: Granular permission system

### 🛡️ Security Features
- **Reentrancy Protection**: Guards against reentrancy attacks
- **Access Control**: Role-based permission system
- **Input Validation**: Comprehensive parameter checking
- **Event Emission**: Complete audit trail
- **OpenZeppelin Standards**: Battle-tested security patterns

## 🏗️ Contract Architecture

### Inheritance Chain
```solidity
BasedToken
├── ERC20 (Standard token interface)
├── ERC20Burnable (Token burning capability)
├── Pausable (Pause/unpause functionality)
├── AccessControl (Role-based permissions)
└── ReentrancyGuard (Security protection)
```

### Key Storage Variables
- `blacklisted`: Mapping to track banned addresses
- `lastClaim`: Mapping to track reward claim timestamps
- `REWARD_AMOUNT`: Fixed daily reward amount (10 tokens)
- `REWARD_COOLDOWN`: 24-hour cooldown period

## 👥 Role System

### DEFAULT_ADMIN_ROLE
- **Full Administrative Control**: Can grant/revoke all roles
- **Blacklist Management**: Add/remove addresses from blacklist
- **Role Assignment**: Grant MINTER_ROLE and PAUSER_ROLE

### MINTER_ROLE
- **Token Minting**: Create new tokens and distribute
- **Supply Control**: Manage total token supply
- **Distribution**: Send tokens to any address

### PAUSER_ROLE
- **Emergency Control**: Pause all token transfers
- **Safety Mechanism**: Stop operations during emergencies
- **Recovery**: Resume operations when safe

## 📋 Contract Functions

### Token Operations

#### Standard ERC-20 Functions
```solidity
function transfer(address to, uint256 amount) public returns (bool)
function approve(address spender, uint256 amount) public returns (bool)
function transferFrom(address from, address to, uint256 amount) public returns (bool)
function balanceOf(address account) public view returns (uint256)
function totalSupply() public view returns (uint256)
```

#### Burning Functions
```solidity
function burn(uint256 amount) public
function burnFrom(address account, uint256 amount) public
```

### Administrative Functions

#### Minting (MINTER_ROLE required)
```solidity
function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE)
```

#### Pause Control (PAUSER_ROLE required)
```solidity
function pause() public onlyRole(PAUSER_ROLE)
function unpause() public onlyRole(PAUSER_ROLE)
```

#### Blacklist Management (DEFAULT_ADMIN_ROLE required)
```solidity
function setBlacklist(address user, bool status) public onlyRole(DEFAULT_ADMIN_ROLE)
function isBlacklisted(address user) public view returns (bool)
```

#### Role Management (DEFAULT_ADMIN_ROLE required)
```solidity
function grantMinterRole(address account) public onlyRole(DEFAULT_ADMIN_ROLE)
function grantPauserRole(address account) public onlyRole(DEFAULT_ADMIN_ROLE)
function revokeMinterRole(address account) public onlyRole(DEFAULT_ADMIN_ROLE)
function revokePauserRole(address account) public onlyRole(DEFAULT_ADMIN_ROLE)
```

### User Functions

#### Daily Rewards
```solidity
function claimReward() public nonReentrant
function canClaimReward(address user) public view returns (bool)
function getLastClaimTime(address user) public view returns (uint256)
```

## 📊 Events

The contract emits comprehensive events for monitoring and analytics:

```solidity
event TokensMinted(address indexed to, uint256 amount);
event TokensBurned(address indexed from, uint256 amount);
event RewardClaimed(address indexed user, uint256 amount);
event BlacklistUpdated(address indexed user, bool status);
event Paused(address account);
event Unpaused(address account);
```

## 🚀 Deployment

### Prerequisites
- Foundry installed and configured
- Base Sepolia testnet access
- Private key with sufficient ETH for gas
- Etherscan API key for contract verification

### Deployment Steps

1. **Set up environment variables:**
   ```bash
   export PRIVATE_KEY=your_private_key_here
   export ETHERSCAN_API_KEY=your_etherscan_api_key
   ```

2. **Deploy the contract:**
   ```bash
   forge script script/BasedToken.s.sol:BasedTokenScript \
     --rpc-url https://sepolia.base.org \
     --broadcast \
     --verify
   ```

3. **Verify deployment:**
   ```bash
   forge verify-contract <contract_address> src/BasedToken.sol:BasedToken \
     --chain-id 84532 \
     --etherscan-api-key $ETHERSCAN_API_KEY
   ```

### Constructor Parameters
- `initialSupply`: Initial token supply to mint to deployer
- `name`: Token name (e.g., "BasedToken")
- `symbol`: Token symbol (e.g., "BASED")
- `decimals`: Token decimals (18)

## 🧪 Testing

### Running Tests
```bash
# Run all tests
forge test

# Run tests with gas reporting
forge test --gas-report

# Run specific test file
forge test --match-path test/BasedToken.t.sol

# Run tests with verbose output
forge test -vvv
```

### Test Coverage
The comprehensive test suite covers:

- ✅ **Deployment Tests**: Contract initialization and setup
- ✅ **Transfer Tests**: Standard ERC-20 transfer functionality
- ✅ **Approval Tests**: Allowance and transferFrom operations
- ✅ **Burning Tests**: Token destruction functionality
- ✅ **Minting Tests**: New token creation
- ✅ **Pause Tests**: Emergency stop mechanisms
- ✅ **Blacklist Tests**: Address restriction functionality
- ✅ **Reward Tests**: Daily reward claiming system
- ✅ **Role Tests**: Access control and permissions
- ✅ **Reentrancy Tests**: Security vulnerability protection
- ✅ **Edge Cases**: Boundary conditions and error handling

### Test Structure
```
test/
├── BasedToken.t.sol              # Main test file
├── fixtures/                     # Test fixtures and utilities
├── mocks/                        # Mock contracts for testing
└── utils/                        # Test helper functions
```

## 🔐 Security Considerations

### Security Features Implemented
- **ReentrancyGuard**: Protection against reentrancy attacks
- **AccessControl**: Role-based access control system
- **Pausable**: Emergency stop mechanism
- **Input Validation**: Comprehensive parameter checking
- **Event Logging**: Complete audit trail

### Security Best Practices
- All external functions are protected with appropriate modifiers
- State changes are atomic and consistent
- Events are emitted for all state-changing operations
- Input validation prevents invalid data entry
- Role-based access control limits function access

### Audit Recommendations
While this contract uses well-audited OpenZeppelin components:
- Consider professional security audit before mainnet deployment
- Implement formal verification for critical functions
- Conduct penetration testing of the complete system
- Regular security reviews and updates

## 📈 Gas Optimization

### Gas-Efficient Features
- **Packed Storage**: Optimized storage layout
- **Batch Operations**: Efficient bulk operations
- **Event Optimization**: Minimal event data
- **Function Optimization**: Reduced gas consumption

### Gas Usage Estimates
| Function | Gas Cost | Description |
|----------|----------|-------------|
| `transfer()` | ~65,000 | Standard token transfer |
| `mint()` | ~80,000 | Mint new tokens |
| `burn()` | ~45,000 | Burn tokens |
| `claimReward()` | ~70,000 | Claim daily reward |
| `pause()` | ~30,000 | Pause all transfers |
| `setBlacklist()` | ~50,000 | Update blacklist status |

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
| `balanceOf(address)` | Get account balance | ~2,000 |
| `totalSupply()` | Get total supply | ~2,000 |
| `allowance(owner, spender)` | Get spending allowance | ~2,000 |
| `isBlacklisted(address)` | Check blacklist status | ~2,000 |
| `canClaimReward(address)` | Check reward eligibility | ~3,000 |

### State-Changing Functions
| Function | Description | Gas Cost |
|----------|-------------|----------|
| `transfer(to, amount)` | Send tokens | ~65,000 |
| `mint(to, amount)` | Create tokens | ~80,000 |
| `burn(amount)` | Destroy tokens | ~45,000 |
| `claimReward()` | Claim daily reward | ~70,000 |
| `pause()` | Pause transfers | ~30,000 |

## 🌟 Use Cases

### Utility Tokens
- **Platform Access**: Gate access to services
- **Fee Payment**: Pay for platform services
- **Staking**: Lock tokens for rewards

### Governance Tokens
- **Voting Rights**: Participate in governance decisions
- **Proposal Creation**: Submit governance proposals
- **Delegation**: Delegate voting power

### Reward Systems
- **Daily Rewards**: Regular token distribution
- **Achievement Rewards**: Reward specific actions
- **Loyalty Programs**: Incentivize user engagement

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
- **ERC-20 Standard**: https://eips.ethereum.org/EIPS/eip-20

---

**Built with ❤️ for the Base ecosystem**