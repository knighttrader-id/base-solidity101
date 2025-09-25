# Solidity101 - Base Workshop Projects

A comprehensive collection of Web3 projects built on the Base blockchain, featuring smart contracts and modern frontend applications. This repository contains three main projects demonstrating different aspects of blockchain development.

**Created by: Daniel Sukamto**

## 🚀 Projects Overview

### 1. **BasedToken** - Advanced ERC-20 Token ✅ DEPLOYED
An enhanced ERC-20 token with advanced features for utility and governance.

**Contract Address:** `0x8c8e8c8e8c8e8c8e8c8e8c8e8c8e8c8e8c8e8c8e` (Base Sepolia)

**Features:**
- 🪙 Standard ERC-20 compliance with burnable tokens
- ⏸️ Pause/unpause functionality
- 🎁 Daily reward system (10 tokens per day)
- 🚫 Address blacklisting capabilities
- 👥 Role-based access control

**Frontend:** ✅ Available

### 2. **BasedCertificate** - NFT Certificate System ✅ DEPLOYED
A soulbound NFT-based certificate system for achievements, graduations, and training completions.

**Contract Address:** `0x4ac2057def8763135ffbfa1dc0d31656d960006a` (Base Sepolia)

**Features:**
- 🎓 Non-transferable NFT certificates (soulbound)
- 🔐 Role-based access control
- 📜 Certificate issuance, revocation, and updates
- 🛡️ Reentrancy protection and duplicate prevention
- 💻 Modern PWA frontend with wallet integration

**Frontend:** ✅ Available

### 3. **BasedBadge** - ERC1155 Multi-Token Badge System ✅ DEPLOYED
An advanced ERC1155-based badge system for certificates, achievements, and workshop tokens.

**Contract Address:** `0x5b73C5498c1E3b4dbA84de0F1833c4a029d90519` (Base Sepolia)

**Features:**
- 🏆 ERC1155 multi-token standard for badges and certificates
- 🎓 Non-transferable certificates (soulbound)
- 🎫 Transferable event badges
- ⭐ Achievement medals with rarity system
- 🎓 Workshop session tokens
- 🔐 Role-based access control (MINTER, PAUSER, URI_SETTER)
- 📊 Batch operations for events
- 🛡️ Reentrancy protection and supply limits

**Frontend:** ✅ Available

## 🚀 Current Status

### ✅ **All Projects Deployed**

| Project | Smart Contract | Frontend | Status |
|---------|---------------|----------|---------|
| **BasedToken** | `0xaee30eb0db08d4934d1390f49d41cbbb72ee4552` | Available | ✅ Deployed |
| **BasedCertificate** | `0x4ac2057def8763135ffbfa1dc0d31656d960006a` | Available | ✅ Deployed |
| **BasedBadge** | `0x5b73C5498c1E3b4dbA84de0F1833c4a029d90519` | Available | ✅ Deployed |

### 🌐 **Network Information**
- **Network**: Base Sepolia Testnet (Chain ID: 84532)
- **RPC URL**: https://sepolia.base.org
- **Explorer**: https://sepolia.basescan.org
- **Faucet**: https://bridge.base.org/deposit

## 🏗️ Architecture

Each project follows a consistent architecture:

```
ProjectName/
├── projectname-smartcontract/     # Solidity smart contracts
│   ├── src/                       # Contract source code
│   ├── test/                      # Contract tests
│   ├── script/                    # Deployment scripts
│   └── lib/                       # Dependencies
└── projectname-frontend/          # Next.js frontend
    ├── src/                       # React components
    ├── public/                    # Static assets
    └── package.json              # Dependencies
```

## 🛠️ Technology Stack

### Smart Contracts
- **Solidity** - Smart contract programming language
- **Foundry** - Development framework and testing
- **OpenZeppelin** - Secure contract libraries
- **Base Sepolia** - Testnet deployment

### Frontend Applications
- **Next.js 15** - React framework with App Router
- **React 18** - UI library
- **Tailwind CSS v4** - Utility-first CSS framework
- **Wagmi v2** - React hooks for Ethereum
- **Viem** - TypeScript interface for Ethereum
- **PWA** - Progressive Web App capabilities
- **Dark Theme** - Modern glassmorphism design

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or later)
- Foundry (for smart contract development)
- MetaMask or compatible wallet
- Base Sepolia testnet ETH

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Solidity101
```

### 2. Smart Contract Development
```bash
# Navigate to any smart contract directory
cd BasedToken/basedtoken-smartcontract

# Install dependencies
forge install

# Run tests
forge test

# Deploy to Base Sepolia
forge script script/ContractName.s.sol:ContractScript --rpc-url https://sepolia.base.org --broadcast --verify
```

### 3. Frontend Development
```bash
# Navigate to any frontend directory
cd BasedToken/basedtoken-frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your contract address

# Run development server
npm run dev
```

## 📱 Progressive Web App (PWA)

All frontend applications are optimized as Progressive Web Apps:

- **Offline Support** - Service worker for caching
- **Mobile Optimized** - Responsive design for all devices
- **App-like Experience** - Standalone display mode
- **Installable** - Add to home screen on mobile devices

## 🔐 Security Features

### Smart Contract Security
- **OpenZeppelin Libraries** - Battle-tested security patterns
- **Reentrancy Protection** - Guards against reentrancy attacks
- **Access Control** - Role-based permission system
- **Input Validation** - Comprehensive parameter checking
- **Event Logging** - Complete audit trail

### Frontend Security
- **Wallet Integration** - Secure wallet connection
- **Input Validation** - Client-side form validation
- **Error Handling** - Comprehensive error management
- **Type Safety** - TypeScript for type checking

## 🧪 Testing

### Smart Contract Testing
```bash
# Run all tests
forge test

# Run tests with gas reporting
forge test --gas-report

# Run specific test file
forge test --match-path test/ContractName.t.sol
```

### Frontend Testing
```bash
# Run frontend tests
npm run test

# Run linting
npm run lint

# Type checking
npm run type-check
```

## 🚀 Deployment

### Smart Contract Deployment
1. **Set up environment variables:**
   ```bash
   export PRIVATE_KEY=your_private_key_here
   export ETHERSCAN_API_KEY=your_etherscan_api_key
   ```

2. **Deploy to Base Sepolia:**
   ```bash
   forge script script/ContractName.s.sol:ContractScript \
     --rpc-url https://sepolia.base.org \
     --broadcast \
     --verify
   ```

### Frontend Deployment
1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel:**
   - Connect your GitHub repository to Vercel
   - Configure build settings
   - Deploy automatically on push

## 📚 Documentation

Each project includes comprehensive documentation:

- **Smart Contract Docs** - Detailed function documentation
- **API Reference** - Contract interface documentation
- **Frontend Docs** - Component and usage documentation
- **Deployment Guides** - Step-by-step deployment instructions

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch:**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes:**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch:**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Contribution Guidelines
- Follow existing code style and patterns
- Add tests for new functionality
- Update documentation as needed
- Ensure all tests pass before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. **Check the documentation** for each project
2. **Search existing issues** on GitHub
3. **Create a new issue** with detailed information
4. **Join our community** discussions

## 🌟 Features Highlights

### BasedToken
- ✅ ERC-20 compliant token
- ✅ Daily reward system
- ✅ Pause/unpause functionality
- ✅ Address blacklisting
- ✅ Role-based permissions

### BasedCertificate
- ✅ Soulbound NFT certificates
- ✅ Role-based access control
- ✅ Certificate lifecycle management
- ✅ Modern PWA frontend
- ✅ Wallet integration

### BasedBadge
- ✅ ERC1155 multi-token standard
- ✅ Certificate and badge management
- ✅ Achievement system with rarity
- ✅ Workshop session tracking
- ✅ Batch operations for events
- ✅ Role-based access control
- ✅ Modern dark theme frontend

## 🔗 Links

- **Base Blockchain**: https://base.org
- **Base Sepolia Testnet**: https://sepolia.base.org
- **Foundry Documentation**: https://book.getfoundry.sh
- **Next.js Documentation**: https://nextjs.org/docs
- **Wagmi Documentation**: https://wagmi.sh

---

**Built with ❤️ for the Base ecosystem**