"use client";

import BadgeOperations from "../components/BadgeOperations";
import WalletConnection from "../components/WalletConnection";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 w-full">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{marginLeft: 'auto', marginRight: 'auto'}}>
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">BB</span>
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">BasedBadge</h1>
                <p className="text-xs text-gray-400">ERC1155 Multi-Token on Base</p>
              </div>
            </div>
            <WalletConnection />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto" style={{marginLeft: 'auto', marginRight: 'auto'}}>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 min-h-[700px]">
            {/* Left Sidebar - Quick Actions */}
            <div className="lg:col-span-1 space-y-6">
              <div className="card">
                <h3 className="text-lg font-semibold mb-4 text-white">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full web3-button text-base py-4">
                    🏆 Create Badge
                  </button>
                  <button className="w-full web3-button text-base py-4">
                    🎖️ Issue Badge
                  </button>
                  <button className="w-full web3-button text-base py-4">
                    ⭐ Grant Achievement
                  </button>
                  <button className="w-full web3-button text-base py-4">
                    🎓 Create Workshop
                  </button>
                </div>
              </div>
              
              <div className="card">
                <h3 className="text-lg font-semibold mb-4 text-white">Contract Info</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Network:</span>
                    <span className="text-green-400">Base Sepolia</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Contract:</span>
                    <span className="text-blue-400 font-mono text-xs">0x5b73...0519</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Token Standard:</span>
                    <span className="text-purple-400">ERC1155</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Features:</span>
                    <span className="text-yellow-400">Multi-Token</span>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold mb-4 text-white">Badge Categories</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-400">📜</span>
                    <span className="text-gray-300">Certificates</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-400">🎫</span>
                    <span className="text-gray-300">Event Badges</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-400">⭐</span>
                    <span className="text-gray-300">Achievements</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-purple-400">🎓</span>
                    <span className="text-gray-300">Workshop Tokens</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3 flex flex-col">
              <BadgeOperations />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-400 text-sm">
            <p>Built on Base • Powered by Web3 • Secure & Decentralized</p>
          </div>
        </div>
      </footer>
    </div>
  );
}