# BasedCertificate Frontend

A modern Web3 frontend for the BasedCertificate NFT system built on Base Sepolia testnet.

## 🚀 Features

### Certificate Management
- **Issue Certificates** - Create new NFT certificates with metadata
- **Revoke Certificates** - Mark certificates as invalid (Manager role required)
- **Update Certificates** - Modify course information (Manager role required)
- **Burn Certificates** - Permanently destroy certificates (Owner or Manager role)

### Role-Based Access Control
- **ISSUER_ROLE** - Can issue new certificates
- **MANAGER_ROLE** - Can revoke, update, and burn certificates
- **Role Management** - Grant and revoke roles for different accounts

### Certificate Features
- **Soulbound NFTs** - Non-transferable certificates
- **Metadata Support** - URI-based certificate information
- **Duplicate Prevention** - Prevents issuing duplicate certificates
- **Certificate Tracking** - View all certificates by owner

## 🛠️ Technology Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Web3**: Wagmi v2, Viem
- **Blockchain**: Base Sepolia Testnet
- **Contract**: BasedCertificate.sol (ERC-721)

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
The contract address is hardcoded to the deployed BasedCertificate contract:
- **Contract Address**: `0x4ac2057def8763135ffbfa1dc0d31656d960006a` ✅ DEPLOYED
- **Network**: Base Sepolia Testnet (Chain ID: 84532)
- **Explorer**: https://sepolia.basescan.org/address/0x4ac2057def8763135ffbfa1dc0d31656d960006a

### 3. Start Development Server
```bash
npm run dev
```

### 4. Access the Application
Open [http://localhost:3000](http://localhost:3000) in your browser.

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

### For Certificate Issuers
1. **Connect Wallet** - Use MetaMask or compatible wallet
2. **Issue Certificate** - Fill in recipient details and metadata URI
3. **Verify Issuance** - Check the certificate in the "View Certificate" section

### For Certificate Managers
1. **Revoke Certificate** - Mark certificates as invalid
2. **Update Certificate** - Modify course information
3. **Burn Certificate** - Permanently destroy certificates

### For Certificate Holders
1. **View Certificates** - See all your certificates
2. **Burn Own Certificates** - Destroy your own certificates if needed

## 🔐 Security Features

- **Role-Based Access Control** - Different permissions for different roles
- **Input Validation** - Comprehensive form validation
- **Error Handling** - Clear error messages and feedback
- **Soulbound NFTs** - Certificates cannot be transferred
- **Duplicate Prevention** - Prevents issuing duplicate certificates

## 🎨 UI Components

### Certificate Operations
- **Issue Certificate Form** - Complete form with validation
- **Certificate Management** - Revoke, update, burn operations
- **Role Management** - Grant and revoke roles
- **Certificate Viewer** - View certificate details and owner certificates

### Real-time Features
- **Event Watching** - Live updates for certificate events
- **Status Indicators** - Connection and contract status
- **Loading States** - Visual feedback during transactions

## 📊 Contract Information

- **Contract Address**: `0x4ac2057def8763135ffbfa1dc0d31656d960006a`
- **Contract Type**: ERC-721 NFT
- **Features**: Soulbound, Role-based access, Metadata support
- **Network**: Base Sepolia Testnet
- **Explorer**: https://sepolia.basescan.org/address/0x4ac2057def8763135ffbfa1dc0d31656d960006a

## 🔍 Available Functions

### Public Functions
- `getCertificatesByOwner(address)` - Get all certificates for an address
- `certificates(uint256)` - Get certificate data by token ID
- `tokenURI(uint256)` - Get metadata URI for certificate

### Issuer Functions (ISSUER_ROLE)
- `issueCertificate(address, string, string, string, string)` - Issue new certificate

### Manager Functions (MANAGER_ROLE)
- `revokeCertificate(uint256)` - Revoke certificate
- `updateCertificate(uint256, string)` - Update certificate course

### Owner/Manager Functions
- `burnCertificate(uint256)` - Burn certificate

## 🚨 Important Notes

1. **Soulbound Certificates** - Certificates cannot be transferred between addresses
2. **Role Requirements** - Ensure you have the correct role before attempting operations
3. **Testnet Only** - This is for testing purposes on Base Sepolia
4. **Gas Fees** - You need ETH for transaction fees
5. **Duplicate Prevention** - Cannot issue certificates with identical recipient, course, and issuer

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