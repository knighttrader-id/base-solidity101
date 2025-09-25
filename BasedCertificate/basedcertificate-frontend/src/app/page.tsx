"use client";

import CertificateOperations from "../components/CertificateOperations";
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
                <span className="text-white font-bold text-sm">BC</span>
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">Based Certificate</h1>
                <p className="text-xs text-gray-400">NFT Certificates on Base</p>
              </div>
            </div>
            <WalletConnection />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Quick Actions */}
          <div className="lg:col-span-1 space-y-4">
            <div className="card">
              <h3 className="text-lg font-semibold mb-4 text-white">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full web3-button text-sm">
                  📜 Issue Certificate
                </button>
                <button className="w-full web3-button text-sm">
                  🔍 View Certificates
                </button>
                <button className="w-full web3-button text-sm">
                  ⚙️ Manage Roles
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
                  <span className="text-blue-400 font-mono text-xs">0x4ac2...006a</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Type:</span>
                  <span className="text-purple-400">ERC-721 NFT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Features:</span>
                  <span className="text-yellow-400">Soulbound</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <CertificateOperations />
          </div>
        </div>
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