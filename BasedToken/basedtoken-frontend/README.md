# BasedToken Frontend

A modern React/Next.js frontend for the BasedToken ERC-20 smart contract deployed on Base Sepolia.

## 🚀 Features

### Core Token Operations
- **Transfer Tokens** - Send BASED tokens to other addresses
- **Mint Tokens** - Create new tokens (requires MINTER_ROLE)
- **Burn Tokens** - Destroy your own tokens
- **View Balances** - ETH and BASED token balances

### Advanced Features
- **Daily Rewards** - Claim daily BASED token rewards
- **Blacklist Management** - Blacklist addresses (requires ADMIN_ROLE)
- **Batch Blacklist** - Blacklist multiple addresses at once
- **Pause/Unpause** - Emergency pause functionality (requires PAUSER_ROLE)
- **Role Management** - View your assigned roles and permissions

### Smart Contract Integration
- **Contract Address**: `0xaee30eb0db08d4934d1390f49d41cbbb72ee4552` ✅ DEPLOYED
- **Network**: Base Sepolia Testnet
- **Chain ID**: 84532
- **Explorer**: https://sepolia.basescan.org/address/0xaee30eb0db08d4934d1390f49d41cbbb72ee4552

## 🛠️ Technology Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Wagmi** - Ethereum React hooks
- **Viem** - Ethereum library
- **Tailwind CSS** - Styling
- **Base Sepolia** - Testnet network

## 📦 Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Start development server:**
```bash
npm run dev
```

3. **Open in browser:**
```
http://localhost:3000
```

## 🔧 Configuration

### Network Setup
The app is configured for Base Sepolia testnet:
- **RPC URL**: https://sepolia.base.org
- **Chain ID**: 84532
- **Explorer**: https://sepolia.basescan.org

### Contract Integration
- **Contract ABI**: Automatically loaded from `src/lib/contract-abi.json`
- **Contract Address**: Hardcoded in `TokenOperations.tsx`
- **Token Symbol**: BASED
- **Token Decimals**: 18

## 🎯 User Interface

### Dashboard Sections

#### 1. **Balance Display**
- ETH Balance
- BASED Token Balance
- Real-time updates

#### 2. **User Status**
- Blacklist status
- Contract pause status
- Daily reward amount

#### 3. **Role Information**
- Minter role (can mint tokens)
- Pauser role (can pause transfers)
- Admin role (can manage blacklist)

#### 4. **Token Operations**
- Transfer tokens to other addresses
- Mint new tokens (role required)
- Burn your own tokens
- Claim daily rewards

#### 5. **Administrative Functions**
- Pause/unpause transfers (role required)
- Blacklist individual addresses (role required)
- Batch blacklist multiple addresses (role required)
- Set daily reward amount (role required)

## 🔐 Role-Based Access Control

### Roles and Permissions

#### **MINTER_ROLE**
- Can mint new tokens
- Can call `mint()` function
- Assigned to contract deployer by default

#### **PAUSER_ROLE**
- Can pause/unpause transfers
- Can call `pause()` and `unpause()` functions
- Emergency control functionality

#### **DEFAULT_ADMIN_ROLE**
- Full administrative control
- Can manage blacklist
- Can set daily reward amount
- Can grant/revoke other roles

### Role Checking
The frontend automatically checks your roles and:
- Shows role status in the UI
- Enables/disables functions based on permissions
- Displays appropriate error messages

## 🎨 UI Components

### **TokenOperations.tsx**
Main component with all token functionality:
- Balance display
- Role status
- Token operations
- Administrative functions

### **WalletConnection.tsx**
Wallet connection component:
- Connect/disconnect wallet
- Network switching
- Account information

## 🔄 State Management

### Real-time Data
- **Token balances** - Updated automatically
- **Role status** - Fetched from contract
- **Blacklist status** - Real-time checking
- **Pause status** - Contract state monitoring

### Form State
- Input validation
- Error handling
- Loading states
- Success/error messages

## 🚨 Error Handling

### Common Errors
- **Insufficient balance** - Not enough tokens
- **Role required** - Missing required role
- **Blacklisted user** - User is blacklisted
- **Contract paused** - Transfers are paused
- **Invalid address** - Malformed address

### User Feedback
- Clear error messages
- Loading indicators
- Success confirmations
- Status updates

## 🔧 Development

### Project Structure
```
src/
├── app/
│   ├── page.tsx          # Main page
│   └── globals.css       # Global styles
├── components/
│   ├── TokenOperations.tsx  # Main token component
│   └── WalletConnection.tsx # Wallet connection
├── lib/
│   ├── contract-abi.json    # Contract ABI
│   └── wagmi.ts            # Wagmi configuration
└── providers/
    └── WagmiProvider.tsx   # Wagmi provider
```

### Key Files
- **`TokenOperations.tsx`** - Main functionality
- **`contract-abi.json`** - Contract interface
- **`wagmi.ts`** - Ethereum configuration
- **`page.tsx`** - Main application page

## 🌐 Network Information

### Base Sepolia Testnet
- **Network Name**: Base Sepolia
- **Chain ID**: 84532
- **RPC URL**: https://sepolia.base.org
- **Explorer**: https://sepolia.basescan.org
- **Faucet**: https://bridge.base.org/deposit

### Getting Test ETH
1. Visit Base Bridge: https://bridge.base.org/deposit
2. Connect your wallet
3. Bridge ETH from Ethereum to Base Sepolia
4. Use the bridged ETH for gas fees

## 🎯 Usage Guide

### For Regular Users
1. **Connect Wallet** - Use MetaMask or injected wallet
2. **View Balances** - Check your ETH and BASED balances
3. **Transfer Tokens** - Send BASED to other addresses
4. **Claim Rewards** - Claim daily BASED rewards
5. **Burn Tokens** - Destroy your own tokens

### For Administrators
1. **Mint Tokens** - Create new BASED tokens
2. **Manage Blacklist** - Blacklist/whitelist addresses
3. **Pause Transfers** - Emergency pause functionality
4. **Set Rewards** - Configure daily reward amount

## 🔒 Security Features

### Smart Contract Security
- **Role-based access control**
- **Pausable functionality**
- **Blacklist management**
- **Reentrancy protection**
- **Input validation**

### Frontend Security
- **Input sanitization**
- **Address validation**
- **Role-based UI**
- **Error handling**
- **Transaction confirmation**

## 📱 Responsive Design

### Mobile Support
- Responsive grid layout
- Touch-friendly buttons
- Mobile-optimized forms
- Adaptive typography

### Desktop Features
- Multi-column layouts
- Hover effects
- Keyboard navigation
- Large screen optimization

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
vercel deploy
```

### Environment Variables
```bash
NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS=0xaee30eb0db08d4934d1390f49d41cbbb72ee4552
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

---

**Built with ❤️ for the Base ecosystem**