"use client";

import { useState, useEffect } from "react";
import { useAccount, useWriteContract, useReadContract, useBalance } from "wagmi";
import { parseUnits, formatUnits } from "viem";

// Import the complete contract ABI
import contractABI from "../lib/contract-abi.json";

const contractAddress = "0xaee30eb0db08d4934d1390f49d41cbbb72ee4552" as `0x${string}`;

export default function TokenOperations() {
  const [mounted, setMounted] = useState(false);
  const { address, isConnected } = useAccount();
  const { writeContract, isPending, error } = useWriteContract();
  
  // State for form inputs
  const [transferTo, setTransferTo] = useState<string>('');
  const [transferAmount, setTransferAmount] = useState<string>('');
  const [mintTo, setMintTo] = useState<string>('');
  const [mintAmount, setMintAmount] = useState<string>('');
  const [burnAmount, setBurnAmount] = useState<string>('');
  const [blacklistAddress, setBlacklistAddress] = useState<string>('');
  const [blacklistBatchAddresses, setBlacklistBatchAddresses] = useState<string>('');
  const [dailyRewardAmount, setDailyRewardAmount] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  
  // Role states
  const [hasMinterRole, setHasMinterRole] = useState<boolean>(false);
  const [hasPauserRole, setHasPauserRole] = useState<boolean>(false);
  const [hasAdminRole, setHasAdminRole] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isUserBlacklisted, setIsUserBlacklisted] = useState<boolean>(false);
  const [dailyReward, setDailyReward] = useState<string>('0');
  const [lastClaimDay, setLastClaimDay] = useState<string>('0');

  // Get token balance
  const { data: tokenBalance } = useBalance({
    address: address,
    token: contractAddress,
  });

  // Get ETH balance
  const { data: ethBalance } = useBalance({
    address: address,
  });

  // Read contract data
  const { data: minterRole } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "MINTER_ROLE",
  });

  const { data: pauserRole } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "PAUSER_ROLE",
  });

  const { data: adminRole } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "DEFAULT_ADMIN_ROLE",
  });

  const { data: pausedStatus } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "paused",
  });

  const { data: dailyRewardAmountData } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "dailyRewardAmount",
  });

  const { data: userBlacklisted } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "isBlacklisted",
    args: address ? [address] : undefined,
  });

  const { data: userLastClaimDay } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "lastClaimDay",
    args: address ? [address] : undefined,
  });

  // Check roles
  const { data: hasMinter } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "hasRole",
    args: minterRole && address ? [minterRole, address] : undefined,
  });

  const { data: hasPauser } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "hasRole",
    args: pauserRole && address ? [pauserRole, address] : undefined,
  });

  const { data: hasAdmin } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "hasRole",
    args: adminRole && address ? [adminRole, address] : undefined,
  });

  // Ensure component is mounted on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update role states
  useEffect(() => {
    setHasMinterRole(hasMinter === true);
    setHasPauserRole(hasPauser === true);
    setHasAdminRole(hasAdmin === true);
    setIsPaused(pausedStatus === true);
    setIsUserBlacklisted(userBlacklisted === true);
    setDailyReward(dailyRewardAmountData ? formatUnits(dailyRewardAmountData, 18) : '0');
    setLastClaimDay(userLastClaimDay ? userLastClaimDay.toString() : '0');
  }, [hasMinter, hasPauser, hasAdmin, pausedStatus, userBlacklisted, dailyRewardAmountData, userLastClaimDay]);

  if (!mounted) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  // Handle transfer
  const handleTransfer = async () => {
    if (!isConnected || !transferTo || !transferAmount) {
      setStatus('Error: Please connect wallet and fill all fields');
      return;
    }

    try {
      setStatus('Transferring tokens...');
      await writeContract({
        address: contractAddress,
        abi: contractABI,
        functionName: "transfer",
        args: [transferTo as `0x${string}`, parseUnits(transferAmount, 18)],
      });
      setStatus('Tokens transferred successfully!');
      setTransferTo('');
      setTransferAmount('');
    } catch (error: any) {
      console.error('Error transferring tokens:', error);
      setStatus(`Error: ${error.message || 'Failed to transfer tokens'}`);
    }
  };

  // Handle mint
  const handleMint = async () => {
    if (!isConnected || !mintTo || !mintAmount) {
      setStatus('Error: Please connect wallet and fill all fields');
      return;
    }

    if (!hasMinterRole) {
      setStatus('Error: You do not have MINTER_ROLE');
      return;
    }

    try {
      setStatus('Minting tokens...');
      await writeContract({
        address: contractAddress,
        abi: contractABI,
        functionName: "mint",
        args: [mintTo as `0x${string}`, parseUnits(mintAmount, 18)],
      });
      setStatus('Tokens minted successfully!');
      setMintTo('');
      setMintAmount('');
    } catch (error: any) {
      console.error('Error minting tokens:', error);
      setStatus(`Error: ${error.message || 'Failed to mint tokens'}`);
    }
  };

  // Handle burn
  const handleBurn = async () => {
    if (!isConnected || !burnAmount) {
      setStatus('Error: Please connect wallet and fill amount');
      return;
    }

    try {
      setStatus('Burning tokens...');
      await writeContract({
        address: contractAddress,
        abi: contractABI,
        functionName: "burn",
        args: [parseUnits(burnAmount, 18)],
      });
      setStatus('Tokens burned successfully!');
      setBurnAmount('');
    } catch (error: any) {
      console.error('Error burning tokens:', error);
      setStatus(`Error: ${error.message || 'Failed to burn tokens'}`);
    }
  };

  // Handle claim reward
  const handleClaimReward = async () => {
    if (!isConnected) {
      setStatus('Error: Please connect wallet');
      return;
    }

    if (isUserBlacklisted) {
      setStatus('Error: You are blacklisted and cannot claim rewards');
      return;
    }

    try {
      setStatus('Claiming reward...');
      await writeContract({
        address: contractAddress,
        abi: contractABI,
        functionName: "claimReward",
        args: [],
      });
      setStatus('Reward claimed successfully!');
    } catch (error: any) {
      console.error('Error claiming reward:', error);
      setStatus(`Error: ${error.message || 'Failed to claim reward'}`);
    }
  };

  // Handle pause
  const handlePause = async () => {
    if (!isConnected) {
      setStatus('Error: Please connect wallet');
      return;
    }

    if (!hasPauserRole) {
      setStatus('Error: You do not have PAUSER_ROLE');
      return;
    }

    try {
      setStatus('Pausing transfers...');
      await writeContract({
        address: contractAddress,
        abi: contractABI,
        functionName: "pause",
        args: [],
      });
      setStatus('Transfers paused successfully!');
    } catch (error: any) {
      console.error('Error pausing transfers:', error);
      setStatus(`Error: ${error.message || 'Failed to pause transfers'}`);
    }
  };

  // Handle unpause
  const handleUnpause = async () => {
    if (!isConnected) {
      setStatus('Error: Please connect wallet');
      return;
    }

    if (!hasPauserRole) {
      setStatus('Error: You do not have PAUSER_ROLE');
      return;
    }

    try {
      setStatus('Unpausing transfers...');
      await writeContract({
        address: contractAddress,
        abi: contractABI,
        functionName: "unpause",
        args: [],
      });
      setStatus('Transfers unpaused successfully!');
    } catch (error: any) {
      console.error('Error unpausing transfers:', error);
      setStatus(`Error: ${error.message || 'Failed to unpause transfers'}`);
    }
  };

  // Handle blacklist
  const handleBlacklist = async () => {
    if (!isConnected || !blacklistAddress) {
      setStatus('Error: Please connect wallet and provide address');
      return;
    }

    if (!hasAdminRole) {
      setStatus('Error: You do not have ADMIN_ROLE');
      return;
    }

    try {
      setStatus('Updating blacklist...');
      await writeContract({
        address: contractAddress,
        abi: contractABI,
        functionName: "setBlacklist",
        args: [blacklistAddress as `0x${string}`, true],
      });
      setStatus('Address blacklisted successfully!');
      setBlacklistAddress('');
    } catch (error: any) {
      console.error('Error blacklisting address:', error);
      setStatus(`Error: ${error.message || 'Failed to blacklist address'}`);
    }
  };

  // Handle batch blacklist
  const handleBatchBlacklist = async () => {
    if (!isConnected || !blacklistBatchAddresses) {
      setStatus('Error: Please connect wallet and provide addresses');
      return;
    }

    if (!hasAdminRole) {
      setStatus('Error: You do not have ADMIN_ROLE');
      return;
    }

    try {
      const addresses = blacklistBatchAddresses.split(',').map(addr => addr.trim());
      setStatus('Updating batch blacklist...');
      await writeContract({
        address: contractAddress,
        abi: contractABI,
        functionName: "setBlacklistBatch",
        args: [addresses as `0x${string}`[], true],
      });
      setStatus('Addresses blacklisted successfully!');
      setBlacklistBatchAddresses('');
    } catch (error: any) {
      console.error('Error batch blacklisting addresses:', error);
      setStatus(`Error: ${error.message || 'Failed to batch blacklist addresses'}`);
    }
  };

  // Handle set daily reward
  const handleSetDailyReward = async () => {
    if (!isConnected || !dailyRewardAmount) {
      setStatus('Error: Please connect wallet and provide amount');
      return;
    }

    if (!hasAdminRole) {
      setStatus('Error: You do not have ADMIN_ROLE');
      return;
    }

    try {
      setStatus('Setting daily reward...');
      await writeContract({
        address: contractAddress,
        abi: contractABI,
        functionName: "setDailyReward",
        args: [parseUnits(dailyRewardAmount, 18)],
      });
      setStatus('Daily reward updated successfully!');
      setDailyRewardAmount('');
    } catch (error: any) {
      console.error('Error setting daily reward:', error);
      setStatus(`Error: ${error.message || 'Failed to set daily reward'}`);
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Please connect your wallet to interact with the token</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Balance Display */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">Your Balances</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass p-4 rounded-lg">
            <p className="text-sm text-gray-400">ETH Balance</p>
            <p className="text-xl font-bold text-white">
              {ethBalance ? formatUnits(ethBalance.value, 18) : '0'} ETH
            </p>
          </div>
          <div className="glass p-4 rounded-lg">
            <p className="text-sm text-gray-400">BASED Balance</p>
            <p className="text-xl font-bold text-white">
              {tokenBalance ? formatUnits(tokenBalance.value, 18) : '0'} BASED
            </p>
          </div>
        </div>
      </div>

      {/* User Status */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">User Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-3 rounded text-center ${isUserBlacklisted ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
            <p className="font-medium">Blacklist Status</p>
            <p className="text-sm">{isUserBlacklisted ? 'Blacklisted' : 'Not Blacklisted'}</p>
          </div>
          <div className={`p-3 rounded text-center ${isPaused ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
            <p className="font-medium">Contract Status</p>
            <p className="text-sm">{isPaused ? 'Paused' : 'Active'}</p>
          </div>
          <div className="glass p-3 rounded text-center">
            <p className="font-medium">Daily Reward</p>
            <p className="text-sm">{dailyReward} BASED</p>
          </div>
        </div>
      </div>

      {/* Role Information */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">Your Roles</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className={`p-3 rounded text-center ${hasMinterRole ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            <p className="font-medium">Minter</p>
            <p className="text-sm">{hasMinterRole ? 'Authorized' : 'Not Authorized'}</p>
          </div>
          <div className={`p-3 rounded text-center ${hasPauserRole ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            <p className="font-medium">Pauser</p>
            <p className="text-sm">{hasPauserRole ? 'Authorized' : 'Not Authorized'}</p>
          </div>
          <div className={`p-3 rounded text-center ${hasAdminRole ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            <p className="font-medium">Admin</p>
            <p className="text-sm">{hasAdminRole ? 'Authorized' : 'Not Authorized'}</p>
          </div>
        </div>
      </div>

      {/* Status Message */}
      {status && (
        <div className={`p-4 rounded-lg ${
          status.includes('Error') ? 'bg-red-500/20 text-red-400' :
          status.includes('success') ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
        }`}>
          {status}
        </div>
      )}

      {/* Token Operations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Transfer Tokens */}
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Transfer Tokens</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Recipient Address</label>
              <input
                type="text"
                placeholder="0x..."
                value={transferTo}
                onChange={(e) => setTransferTo(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Amount</label>
              <input
                type="text"
                placeholder="0.0"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                className="input-field"
              />
            </div>
            <button
              onClick={handleTransfer}
              disabled={isPending || isPaused || isUserBlacklisted}
              className="web3-button w-full disabled:opacity-50"
            >
              {isPending ? "Transferring..." : "Transfer"}
            </button>
          </div>
        </div>

        {/* Mint Tokens */}
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Mint Tokens</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Recipient Address</label>
              <input
                type="text"
                placeholder="0x..."
                value={mintTo}
                onChange={(e) => setMintTo(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Amount</label>
              <input
                type="text"
                placeholder="0.0"
                value={mintAmount}
                onChange={(e) => setMintAmount(e.target.value)}
                className="input-field"
              />
            </div>
            <button
              onClick={handleMint}
              disabled={isPending || !hasMinterRole}
              className="web3-button w-full disabled:opacity-50"
            >
              {isPending ? "Minting..." : "Mint"}
            </button>
          </div>
        </div>

        {/* Burn Tokens */}
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Burn Tokens</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Amount</label>
              <input
                type="text"
                placeholder="0.0"
                value={burnAmount}
                onChange={(e) => setBurnAmount(e.target.value)}
                className="input-field"
              />
            </div>
            <button
              onClick={handleBurn}
              disabled={isPending}
              className="web3-button w-full"
            >
              {isPending ? "Burning..." : "Burn"}
            </button>
          </div>
        </div>

        {/* Claim Reward */}
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Claim Daily Reward</h3>
          <div className="space-y-4">
            <div className="glass p-4 rounded-lg">
              <p className="text-sm text-gray-300">
                Claim your daily reward of {dailyReward} BASED tokens
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Last claim day: {lastClaimDay}
              </p>
            </div>
            <button
              onClick={handleClaimReward}
              disabled={isPending || isUserBlacklisted}
              className="web3-button w-full disabled:opacity-50"
            >
              {isPending ? "Claiming..." : "Claim Reward"}
            </button>
          </div>
        </div>

        {/* Pause/Unpause */}
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Pause/Unpause Transfers</h3>
          <div className="space-y-4">
            <div className="glass p-4 rounded-lg">
              <p className="text-sm text-gray-300">
                {isPaused ? 'Transfers are currently paused' : 'Transfers are currently active'}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handlePause}
                disabled={isPending || isPaused || !hasPauserRole}
                className="web3-button disabled:opacity-50"
              >
                Pause
              </button>
              <button
                onClick={handleUnpause}
                disabled={isPending || !isPaused || !hasPauserRole}
                className="web3-button disabled:opacity-50"
              >
                Unpause
              </button>
            </div>
          </div>
        </div>

        {/* Blacklist Management */}
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Blacklist Management</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Address to Blacklist</label>
              <input
                type="text"
                placeholder="0x..."
                value={blacklistAddress}
                onChange={(e) => setBlacklistAddress(e.target.value)}
                className="input-field"
              />
            </div>
            <button
              onClick={handleBlacklist}
              disabled={isPending || !hasAdminRole}
              className="web3-button w-full disabled:opacity-50"
            >
              {isPending ? "Blacklisting..." : "Blacklist Address"}
            </button>
          </div>
        </div>

        {/* Batch Blacklist */}
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Batch Blacklist</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Addresses (comma-separated)</label>
              <input
                type="text"
                placeholder="0x..., 0x..., 0x..."
                value={blacklistBatchAddresses}
                onChange={(e) => setBlacklistBatchAddresses(e.target.value)}
                className="input-field"
              />
            </div>
            <button
              onClick={handleBatchBlacklist}
              disabled={isPending || !hasAdminRole}
              className="web3-button w-full disabled:opacity-50"
            >
              {isPending ? "Batch Blacklisting..." : "Batch Blacklist"}
            </button>
          </div>
        </div>

        {/* Set Daily Reward */}
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Set Daily Reward</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">New Daily Reward Amount</label>
              <input
                type="text"
                placeholder="10"
                value={dailyRewardAmount}
                onChange={(e) => setDailyRewardAmount(e.target.value)}
                className="input-field"
              />
            </div>
            <button
              onClick={handleSetDailyReward}
              disabled={isPending || !hasAdminRole}
              className="web3-button w-full disabled:opacity-50"
            >
              {isPending ? "Setting..." : "Set Daily Reward"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}