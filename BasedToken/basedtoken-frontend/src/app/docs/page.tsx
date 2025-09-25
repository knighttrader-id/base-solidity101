'use client';

import Link from 'next/link';

export default function Docs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10 fade-in">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-5xl">
            BasedToken Documentation
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive guide to the BasedToken smart contract and frontend application
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
          <p className="text-gray-700 mb-4">
            BasedToken is an ERC-20 compliant token built on the Base blockchain with enhanced features including role-based access control, pausing functionality, and burnable capabilities. It's designed for various use cases such as utility tokens, governance tokens, and reward systems.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Smart Contract Features</h2>
          
          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Core Functionality</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Standard ERC-20 token functionality (transfer, approve, balanceOf, etc.)</li>
            <li>Burnable tokens - users can destroy their tokens</li>
            <li>Daily reward system - users can claim 10 BASED tokens once per day</li>
            <li>Blacklisting mechanism - administrators can prevent addresses from transacting</li>
          </ul>
          
          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Access Control</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Role-based access control using OpenZeppelin's AccessControl</li>
            <li>Three primary roles: DEFAULT_ADMIN_ROLE, MINTER_ROLE, and PAUSER_ROLE</li>
            <li>Deployer is granted all roles by default</li>
            <li>Administrators can grant/revoke roles to other addresses</li>
          </ul>
          
          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Security Features</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Pause functionality - all token transfers can be paused/unpaused</li>
            <li>Reentrancy protection on reward claims</li>
            <li>Input validation on all functions</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Roles and Permissions</h2>
          
          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">DEFAULT_ADMIN_ROLE</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Can grant/revoke MINTER_ROLE and PAUSER_ROLE to addresses</li>
            <li>Can blacklist/unblacklist addresses</li>
            <li>Held by the contract deployer by default</li>
          </ul>
          
          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">MINTER_ROLE</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Can mint new tokens to any address</li>
            <li>Essential for token distribution and rewards</li>
          </ul>
          
          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">PAUSER_ROLE</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Can pause and unpause all token transfers</li>
            <li>Emergency functionality to halt transactions if needed</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Frontend Application</h2>
          
          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Wallet Connection</h3>
          <p className="text-gray-700 mb-4">
            Users can connect their MetaMask or compatible wallets to interact with the token contract. 
            The application displays connected wallet information and token balances.
          </p>
          
          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Token Operations</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li><strong>Transfer Tokens:</strong> Send BASED tokens to other addresses</li>
            <li><strong>Mint Tokens:</strong> Create new tokens (requires MINTER_ROLE)</li>
            <li><strong>Burn Tokens:</strong> Destroy your own tokens</li>
            <li><strong>Claim Reward:</strong> Receive 10 BASED tokens once per day</li>
            <li><strong>Pause/Unpause:</strong> Control token transfers (requires PAUSER_ROLE)</li>
          </ul>
          
          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Role Information</h3>
          <p className="text-gray-700 mb-4">
            The application displays your current roles and permissions. Different operations are enabled 
            or disabled based on your assigned roles.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Deployment Information</h2>
          
          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Contract Details</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li><strong>Name:</strong> BasedToken</li>
            <li><strong>Symbol:</strong> BASED</li>
            <li><strong>Decimals:</strong> 18</li>
            <li><strong>Network:</strong> Base Chain (Base Sepolia Testnet for testing)</li>
          </ul>
          
          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Initial Setup</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>1,000,000 BASED tokens are minted to the deployer</li>
            <li>Deployer receives all roles (ADMIN, MINTER, PAUSER)</li>
            <li>Contract is initially unpaused</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Handling</h2>
          <p className="text-gray-700 mb-4">
            The application provides clear error messages for common issues:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Insufficient role permissions</li>
            <li>Token transfers paused</li>
            <li>Invalid input values</li>
            <li>Daily reward cooldown period</li>
            <li>Blacklisted addresses</li>
          </ul>
        </div>

        <div className="text-center mt-10">
          <Link href="/" className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Back to Home
          </Link>
        </div>
      </div>
      <footer className="bg-white mt-12 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            BasedToken - A decentralized token on Base Chain
          </p>
          <p className="text-center text-gray-500 text-sm mt-2">
            <a href="/" className="text-indigo-600 hover:text-indigo-800">Home</a> |
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 ml-2">GitHub Repository</a>
          </p>
        </div>
      </footer>
    </div>
  );
}