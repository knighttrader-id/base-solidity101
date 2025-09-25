"use client";

import { useAccount, useConnect, useDisconnect, useConnectors } from "wagmi";
import { useState, useMemo, useEffect, useRef } from "react";
import { injected, metaMask } from "wagmi/connectors";

export default function WalletConnection() {
  const [mounted, setMounted] = useState(false);
  const { address, isConnected, isConnecting } = useAccount();
  const { connect, isPending, error: connectError, reset: resetConnect } = useConnect();
  const { disconnect } = useDisconnect();
  const [showDropdown, setShowDropdown] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Use wagmi's built-in connectors hook
  const connectors = useConnectors();
  
  // Fallback connectors if useConnectors doesn't work
  const fallbackConnectors = useMemo(() => [
    injected(),
    metaMask(),
  ], []);
  
  const availableConnectors = connectors.length > 0 ? connectors : fallbackConnectors;

  // Ensure component is mounted on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  // Reset connection state when disconnected
  useEffect(() => {
    if (!isConnected && !isConnecting) {
      setConnectionAttempts(0);
      if (connectError) {
        // Clear error after a short delay
        setTimeout(() => {
          resetConnect();
        }, 3000);
      }
    }
  }, [isConnected, isConnecting, connectError, resetConnect]);

  // Handle connection success
  useEffect(() => {
    if (isConnected) {
      setShowDropdown(false);
      setConnectionAttempts(0);
    }
  }, [isConnected]);

  if (!mounted) {
    return (
      <div className="web3-button text-sm opacity-50">
        Loading...
      </div>
    );
  }

  if (isConnected) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center space-x-2 bg-green-500/20 border border-green-500/30 rounded-lg px-3 py-2 hover:bg-green-500/30 transition-colors"
        >
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span className="text-green-400 font-mono text-sm">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
          <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {showDropdown && (
          <div ref={dropdownRef} className="absolute right-0 mt-2 w-48 glass rounded-lg shadow-xl z-50">
            <div className="p-2">
              <div className="px-3 py-2 text-sm text-gray-400 border-b border-white/10">
                <p className="font-mono text-xs">{address}</p>
              </div>
              <button
                onClick={() => {
                  disconnect();
                  setShowDropdown(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/20 rounded transition-colors"
              >
                Disconnect
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => {
          setShowDropdown(!showDropdown);
          // Reset connection state when opening dropdown
          if (!showDropdown && connectError) {
            resetConnect();
          }
        }}
        className="web3-button text-sm"
        disabled={isPending || isConnecting}
      >
        {isPending || isConnecting ? "Connecting..." : "Connect Wallet"}
      </button>
      
      {showDropdown && (
        <div ref={dropdownRef} className="absolute right-0 mt-2 w-48 glass rounded-lg shadow-xl z-50">
          <div className="p-2">
            <div className="px-3 py-2 text-sm text-gray-400 border-b border-white/10">
              Choose Wallet
            </div>
            {connectError && (
              <div className="px-3 py-2 text-xs text-red-400 border-b border-white/10">
                <div className="mb-2">
                  <p className="font-semibold">Connection Failed</p>
                  <p className="text-xs">{connectError.message}</p>
                </div>
                <button
                  onClick={() => {
                    resetConnect();
                    setConnectionAttempts(0);
                  }}
                  className="text-xs bg-red-500/20 hover:bg-red-500/30 px-2 py-1 rounded transition-colors"
                >
                  Clear Error
                </button>
              </div>
            )}
            {availableConnectors.map((connector) => (
              <button
                key={connector.uid}
                onClick={async () => {
                  try {
                    setConnectionAttempts(prev => prev + 1);
                    await connect({ connector });
                    setShowDropdown(false);
                  } catch (error) {
                    console.error("Connection error:", error);
                    // Keep dropdown open to show error
                  }
                }}
                disabled={isPending || isConnecting}
                className="w-full text-left px-3 py-2 text-sm hover:bg-white/10 rounded transition-colors disabled:opacity-50"
              >
                {isPending || isConnecting ? "Connecting..." : connector.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
