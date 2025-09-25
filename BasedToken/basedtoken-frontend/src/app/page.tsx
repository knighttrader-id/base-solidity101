"use client";

import TokenOperations from "../components/TokenOperations";
import WalletConnection from "../components/WalletConnection";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">BT</span>
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">BasedToken</h1>
                <p className="text-xs text-gray-400">ERC-20 Token on Base</p>
              </div>
            </div>
            <WalletConnection />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold gradient-text mb-4">BasedToken Management</h2>
          <p className="text-gray-400">Manage your ERC-20 tokens with advanced features</p>
          <div className="mt-4 p-4 glass rounded-lg max-w-2xl mx-auto">
            <p className="text-sm text-gray-300 mb-2">
              <strong>Contract Address:</strong> 0xaee30eb0db08d4934d1390f49d41cbbb72ee4552
            </p>
            <p className="text-sm text-gray-300 mb-2">
              <strong>Network:</strong> Base Sepolia Testnet
            </p>
            <p className="text-sm text-gray-300">
              <strong>Features:</strong> Minting, Burning, Pausing, Blacklisting, Daily Rewards
            </p>
          </div>
        </div>

        <TokenOperations />
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-400 text-sm">
            <p>Built on Base • Powered by Web3 • Secure & Decentralized</p>
          </div>
        </div>
      </footer>
    </div>
  );
}