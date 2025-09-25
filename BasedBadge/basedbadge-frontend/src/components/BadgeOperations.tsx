"use client";

import { useState, useEffect } from "react";
import { useAccount, useWriteContract, useReadContract, useWatchContractEvent } from "wagmi";
// import { parseUnits, formatUnits } from "viem";

// Contract ABI and address
import contractABI from "../lib/contract-abi.json";
const contractAddress = "0x5b73C5498c1E3b4dbA84de0F1833c4a029d90519" as `0x${string}`;

// Badge data structure
interface BadgeData {
  name: string;
  category: string;
  maxSupply: bigint;
  isTransferable: boolean;
  validUntil: bigint;
  issuer: string;
}

interface BadgeVerification {
  valid: boolean;
  earnedTimestamp: bigint;
}

export default function BadgeOperations() {
  const [mounted, setMounted] = useState(false);
  const { address, isConnected } = useAccount();
  const { writeContract, isPending } = useWriteContract();
  
  // State for form inputs
  const [badgeName, setBadgeName] = useState<string>('');
  const [badgeCategory, setBadgeCategory] = useState<string>('certificate');
  const [maxSupply, setMaxSupply] = useState<string>('');
  const [isTransferable, setIsTransferable] = useState<boolean>(false);
  const [tokenUri, setTokenUri] = useState<string>('');
  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const [tokenId, setTokenId] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [achievementName, setAchievementName] = useState<string>('');
  const [rarity, setRarity] = useState<string>('1');
  const [validUntil, setValidUntil] = useState<string>('');
  const [workshopName, setWorkshopName] = useState<string>('');
  const [totalSessions, setTotalSessions] = useState<string>('');
  const [verifyAddress, setVerifyAddress] = useState<string>('');
  const [verifyTokenId, setVerifyTokenId] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  
  // Role states
  const [hasMinterRole, setHasMinterRole] = useState<boolean>(false);
  const [hasPauserRole, setHasPauserRole] = useState<boolean>(false);
  const [hasAdminRole, setHasAdminRole] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Badge data states
  const [badgeData, setBadgeData] = useState<BadgeData | null>(null);
  const [verificationData, setVerificationData] = useState<BadgeVerification | null>(null);
  const [events, setEvents] = useState<unknown[]>([]);

  // Validation state
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState<{[key: string]: boolean}>({});

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

  // Get badge info
  const { data: badgeInfo } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "tokenInfo",
    args: tokenId ? [BigInt(tokenId)] : undefined,
  });

  // Get badge verification
  const { data: verification, refetch: refetchVerification } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "verifyBadge",
    args: verifyAddress && verifyTokenId ? [verifyAddress as `0x${string}`, BigInt(verifyTokenId)] : undefined,
  });

  // Note: getTokensByHolder function was removed from the contract
  // This functionality is no longer available

  // Watch contract events
  useWatchContractEvent({
    address: contractAddress,
    abi: contractABI,
    eventName: "TokenTypeCreated",
    onLogs: (logs) => {
      setEvents(prev => [...prev, ...logs]);
    }
  });

  useWatchContractEvent({
    address: contractAddress,
    abi: contractABI,
    eventName: "BadgeIssued",
    onLogs: (logs) => {
      setEvents(prev => [...prev, ...logs]);
    }
  });

  useWatchContractEvent({
    address: contractAddress,
    abi: contractABI,
    eventName: "BatchBadgesIssued",
    onLogs: (logs) => {
      setEvents(prev => [...prev, ...logs]);
    }
  });

  useWatchContractEvent({
    address: contractAddress,
    abi: contractABI,
    eventName: "AchievementGranted",
    onLogs: (logs) => {
      setEvents(prev => [...prev, ...logs]);
    }
  });

  // Update role states
  useEffect(() => {
    setHasMinterRole(hasMinter === true);
    setHasPauserRole(hasPauser === true);
    setHasAdminRole(hasAdmin === true);
    setIsPaused(pausedStatus === true);
  }, [hasMinter, hasPauser, hasAdmin, pausedStatus]);

  // Update badge data when badgeInfo changes
  useEffect(() => {
    if (badgeInfo && Array.isArray(badgeInfo)) {
      setBadgeData({
        name: badgeInfo[0] as string,
        category: badgeInfo[1] as string,
        maxSupply: badgeInfo[2] as bigint,
        isTransferable: badgeInfo[3] as boolean,
        validUntil: badgeInfo[4] as bigint,
        issuer: badgeInfo[5] as string,
      });
    }
  }, [badgeInfo]);

  // Update verification data when verification changes
  useEffect(() => {
    if (verification && Array.isArray(verification)) {
      setVerificationData({
        valid: verification[0] as boolean,
        earnedTimestamp: verification[1] as bigint,
      });
    }
  }, [verification]);

  // Note: Holder tokens functionality removed as getTokensByHolder was removed from contract

  // Ensure component is mounted on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Validation functions
  const validateAddress = (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const validateTokenId = (id: string): boolean => {
    return /^\d+$/.test(id) && parseInt(id) > 0;
  };

  const validateForm = (formType: string, data: Record<string, unknown>): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    if (formType === "createBadge") {
      const badgeName = data.badgeName as string;
      const badgeCategory = data.badgeCategory as string;
      const maxSupply = data.maxSupply as string;
      const tokenUri = data.tokenUri as string;
      
      if (!badgeName || badgeName.trim().length < 2) {
        newErrors.badgeName = "Badge name must be at least 2 characters";
      }
      if (!badgeCategory || !['certificate', 'event', 'achievement', 'workshop'].includes(badgeCategory)) {
        newErrors.badgeCategory = "Please select a valid category";
      }
      if (!maxSupply || isNaN(parseInt(maxSupply)) || parseInt(maxSupply) < 0) {
        newErrors.maxSupply = "Max supply must be a valid number";
      }
      if (!tokenUri || !tokenUri.startsWith("http")) {
        newErrors.tokenUri = "Please enter a valid URI starting with http";
      }
    } else if (formType === "issueBadge") {
      const recipientAddress = data.recipientAddress as string;
      const tokenId = data.tokenId as string;
      
      if (!recipientAddress || !validateAddress(recipientAddress)) {
        newErrors.recipientAddress = "Please enter a valid Ethereum address";
      }
      if (!tokenId || !validateTokenId(tokenId)) {
        newErrors.tokenId = "Please enter a valid token ID";
      }
    } else if (formType === "batchIssue") {
      const recipientAddress = data.recipientAddress as string;
      const tokenId = data.tokenId as string;
      const amount = data.amount as string;
      
      if (!recipientAddress || !validateAddress(recipientAddress)) {
        newErrors.recipientAddress = "Please enter a valid Ethereum address";
      }
      if (!tokenId || !validateTokenId(tokenId)) {
        newErrors.tokenId = "Please enter a valid token ID";
      }
      if (!amount || isNaN(parseInt(amount)) || parseInt(amount) <= 0) {
        newErrors.amount = "Amount must be a positive number";
      }
    } else if (formType === "grantAchievement") {
      const recipientAddress = data.recipientAddress as string;
      const achievementName = data.achievementName as string;
      const rarity = data.rarity as string;
      
      if (!recipientAddress || !validateAddress(recipientAddress)) {
        newErrors.recipientAddress = "Please enter a valid Ethereum address";
      }
      if (!achievementName || achievementName.trim().length < 2) {
        newErrors.achievementName = "Achievement name must be at least 2 characters";
      }
      if (!rarity || !['1', '2', '3', '4'].includes(rarity)) {
        newErrors.rarity = "Please select a valid rarity (1-4)";
      }
    } else if (formType === "createWorkshop") {
      const workshopName = data.workshopName as string;
      const totalSessions = data.totalSessions as string;
      
      if (!workshopName || workshopName.trim().length < 2) {
        newErrors.workshopName = "Workshop name must be at least 2 characters";
      }
      if (!totalSessions || isNaN(parseInt(totalSessions)) || parseInt(totalSessions) <= 0) {
        newErrors.totalSessions = "Total sessions must be a positive number";
      }
    } else if (formType === "verifyBadge") {
      const verifyAddress = data.verifyAddress as string;
      const verifyTokenId = data.verifyTokenId as string;
      
      if (!verifyAddress || !validateAddress(verifyAddress)) {
        newErrors.verifyAddress = "Please enter a valid Ethereum address";
      }
      if (!verifyTokenId || !validateTokenId(verifyTokenId)) {
        newErrors.verifyTokenId = "Please enter a valid token ID";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Create badge type
  const handleCreateBadgeType = async () => {
    if (!isConnected) {
      setStatus('Error: Please connect your wallet first');
      return;
    }

    if (!hasMinterRole) {
      setStatus('Error: You do not have MINTER_ROLE');
      return;
    }

    const formData = { badgeName, badgeCategory, maxSupply, tokenUri };
    if (!validateForm("createBadge", formData)) {
      return;
    }

    setIsLoading(prev => ({ ...prev, createBadge: true }));

    try {
      setStatus('Creating badge type...');
      await writeContract({
        address: contractAddress,
        abi: contractABI,
        functionName: "createBadgeType",
        args: [badgeName, badgeCategory, BigInt(maxSupply), isTransferable, tokenUri],
      });
      setStatus('Badge type created successfully!');
      // Clear form
      setBadgeName('');
      setMaxSupply('');
      setTokenUri('');
    } catch (error: unknown) {
      console.error('Error creating badge type:', error);
      setStatus(`Error: ${error instanceof Error ? error.message : 'Failed to create badge type'}`);
    } finally {
      setIsLoading(prev => ({ ...prev, createBadge: false }));
    }
  };

  // Issue badge
  const handleIssueBadge = async () => {
    if (!isConnected) {
      setStatus('Error: Please connect your wallet first');
      return;
    }

    if (!hasMinterRole) {
      setStatus('Error: You do not have MINTER_ROLE');
      return;
    }

    const formData = { recipientAddress, tokenId };
    if (!validateForm("issueBadge", formData)) {
      return;
    }

    setIsLoading(prev => ({ ...prev, issueBadge: true }));

    try {
      setStatus('Issuing badge...');
      await writeContract({
        address: contractAddress,
        abi: contractABI,
        functionName: "issueBadge",
        args: [recipientAddress as `0x${string}`, BigInt(tokenId)],
      });
      setStatus('Badge issued successfully!');
      setRecipientAddress('');
      setTokenId('');
    } catch (error: unknown) {
      console.error('Error issuing badge:', error);
      setStatus(`Error: ${error instanceof Error ? error.message : 'Failed to issue badge'}`);
    } finally {
      setIsLoading(prev => ({ ...prev, issueBadge: false }));
    }
  };

  // Batch issue badges
  const handleBatchIssueBadges = async () => {
    if (!isConnected) {
      setStatus('Error: Please connect your wallet first');
      return;
    }

    if (!hasMinterRole) {
      setStatus('Error: You do not have MINTER_ROLE');
      return;
    }

    const formData = { recipientAddress, tokenId, amount };
    if (!validateForm("batchIssue", formData)) {
      return;
    }

    setIsLoading(prev => ({ ...prev, batchIssue: true }));

    try {
      setStatus('Batch issuing badges...');
      await writeContract({
        address: contractAddress,
        abi: contractABI,
        functionName: "batchIssueBadges",
        args: [[recipientAddress as `0x${string}`], BigInt(tokenId), BigInt(amount)],
      });
      setStatus('Badges batch issued successfully!');
      setRecipientAddress('');
      setTokenId('');
      setAmount('');
    } catch (error: unknown) {
      console.error('Error batch issuing badges:', error);
      setStatus(`Error: ${error instanceof Error ? error.message : 'Failed to batch issue badges'}`);
    } finally {
      setIsLoading(prev => ({ ...prev, batchIssue: false }));
    }
  };

  // Grant achievement
  const handleGrantAchievement = async () => {
    if (!isConnected) {
      setStatus('Error: Please connect your wallet first');
      return;
    }

    if (!hasMinterRole) {
      setStatus('Error: You do not have MINTER_ROLE');
      return;
    }

    const formData = { recipientAddress, achievementName, rarity };
    if (!validateForm("grantAchievement", formData)) {
      return;
    }

    setIsLoading(prev => ({ ...prev, grantAchievement: true }));

    try {
      setStatus('Granting achievement...');
      const validUntilTimestamp = validUntil ? BigInt(Math.floor(new Date(validUntil).getTime() / 1000)) : BigInt(0);
      await writeContract({
        address: contractAddress,
        abi: contractABI,
        functionName: "grantAchievement",
        args: [recipientAddress as `0x${string}`, achievementName, BigInt(rarity), validUntilTimestamp],
      });
      setStatus('Achievement granted successfully!');
      setRecipientAddress('');
      setAchievementName('');
      setValidUntil('');
    } catch (error: unknown) {
      console.error('Error granting achievement:', error);
      setStatus(`Error: ${error instanceof Error ? error.message : 'Failed to grant achievement'}`);
    } finally {
      setIsLoading(prev => ({ ...prev, grantAchievement: false }));
    }
  };

  // Create workshop
  const handleCreateWorkshop = async () => {
    if (!isConnected) {
      setStatus('Error: Please connect your wallet first');
      return;
    }

    if (!hasMinterRole) {
      setStatus('Error: You do not have MINTER_ROLE');
      return;
    }

    const formData = { workshopName, totalSessions };
    if (!validateForm("createWorkshop", formData)) {
      return;
    }

    setIsLoading(prev => ({ ...prev, createWorkshop: true }));

    try {
      setStatus('Creating workshop...');
      await writeContract({
        address: contractAddress,
        abi: contractABI,
        functionName: "createWorkshop",
        args: [workshopName, BigInt(totalSessions)],
      });
      setStatus('Workshop created successfully!');
      setWorkshopName('');
      setTotalSessions('');
    } catch (error: unknown) {
      console.error('Error creating workshop:', error);
      setStatus(`Error: ${error instanceof Error ? error.message : 'Failed to create workshop'}`);
    } finally {
      setIsLoading(prev => ({ ...prev, createWorkshop: false }));
    }
  };

  // Verify badge
  const handleVerifyBadge = async () => {
    const formData = { verifyAddress, verifyTokenId };
    if (!validateForm("verifyBadge", formData)) {
      return;
    }

    try {
      await refetchVerification();
      setStatus('Badge verification completed!');
    } catch (error: unknown) {
      console.error('Error verifying badge:', error);
      setStatus(`Error: ${error instanceof Error ? error.message : 'Failed to verify badge'}`);
    }
  };

  // Note: getTokensByHolder functionality removed from contract

  // Pause/Unpause
  const handlePause = async () => {
    if (!isConnected) {
      setStatus('Error: Please connect your wallet first');
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
    } catch (error: unknown) {
      console.error('Error pausing transfers:', error);
      setStatus(`Error: ${error instanceof Error ? error.message : 'Failed to pause transfers'}`);
    }
  };

  const handleUnpause = async () => {
    if (!isConnected) {
      setStatus('Error: Please connect your wallet first');
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
    } catch (error: unknown) {
      console.error('Error unpausing transfers:', error);
      setStatus(`Error: ${error instanceof Error ? error.message : 'Failed to unpause transfers'}`);
    }
  };

  if (!mounted) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">Please connect your wallet to interact with the badge system</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold gradient-text">Badge Operations</h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm">
          <div className="flex items-center space-x-2 text-gray-400">
            <div className={`w-2 h-2 rounded-full ${contractAddress ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <span>{contractAddress ? 'Contract Active' : 'Contract Not Configured'}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
            <span>{isConnected ? 'Wallet Connected' : 'Wallet Not Connected'}</span>
          </div>
        </div>
      </div>

      {/* Role Information */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">Your Roles</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

      {/* Create Badge Type */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-2xl">🏆</span>
          <h3 className="text-xl font-semibold text-white">Create Badge Type</h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">Badge Name</label>
            <input
              type="text"
              value={badgeName}
              onChange={(e) => setBadgeName(e.target.value)}
              className={`input-field ${errors.badgeName ? 'error' : ''}`}
              placeholder="Badge Name"
            />
            {errors.badgeName && (
              <p className="text-red-400 text-sm mt-1">{errors.badgeName}</p>
            )}
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">Category</label>
            <select
              value={badgeCategory}
              onChange={(e) => setBadgeCategory(e.target.value)}
              className={`input-field ${errors.badgeCategory ? 'error' : ''}`}
            >
              <option value="certificate">Certificate</option>
              <option value="event">Event</option>
              <option value="achievement">Achievement</option>
              <option value="workshop">Workshop</option>
            </select>
            {errors.badgeCategory && (
              <p className="text-red-400 text-sm mt-1">{errors.badgeCategory}</p>
            )}
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">Max Supply</label>
            <input
              type="number"
              value={maxSupply}
              onChange={(e) => setMaxSupply(e.target.value)}
              className={`input-field ${errors.maxSupply ? 'error' : ''}`}
              placeholder="0 = unlimited"
            />
            {errors.maxSupply && (
              <p className="text-red-400 text-sm mt-1">{errors.maxSupply}</p>
            )}
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">Token URI</label>
            <input
              type="text"
              value={tokenUri}
              onChange={(e) => setTokenUri(e.target.value)}
              className={`input-field ${errors.tokenUri ? 'error' : ''}`}
              placeholder="https://..."
            />
            {errors.tokenUri && (
              <p className="text-red-400 text-sm mt-1">{errors.tokenUri}</p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4 mt-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isTransferable}
              onChange={(e) => setIsTransferable(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-gray-300">Transferable</span>
          </label>
        </div>
        <div className="mt-4">
          <button
            onClick={handleCreateBadgeType}
            disabled={isLoading.createBadge || !hasMinterRole}
            className="web3-button w-full disabled:opacity-50"
          >
            {isLoading.createBadge ? "Creating..." : "Create Badge Type"}
          </button>
        </div>
      </div>

      {/* Issue Badge */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-2xl">🎖️</span>
          <h3 className="text-xl font-semibold text-white">Issue Badge</h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">Recipient Address</label>
            <input
              type="text"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              className={`input-field ${errors.recipientAddress ? 'error' : ''}`}
              placeholder="0x..."
            />
            {errors.recipientAddress && (
              <p className="text-red-400 text-sm mt-1">{errors.recipientAddress}</p>
            )}
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">Token ID</label>
            <input
              type="text"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
              className={`input-field ${errors.tokenId ? 'error' : ''}`}
              placeholder="Token ID"
            />
            {errors.tokenId && (
              <p className="text-red-400 text-sm mt-1">{errors.tokenId}</p>
            )}
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={handleIssueBadge}
            disabled={isLoading.issueBadge || !hasMinterRole}
            className="web3-button w-full disabled:opacity-50"
          >
            {isLoading.issueBadge ? "Issuing..." : "Issue Badge"}
          </button>
        </div>
      </div>

      {/* Batch Issue Badges */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-2xl">📦</span>
          <h3 className="text-xl font-semibold text-white">Batch Issue Badges</h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">Recipient Address</label>
            <input
              type="text"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              className={`input-field ${errors.recipientAddress ? 'error' : ''}`}
              placeholder="0x..."
            />
            {errors.recipientAddress && (
              <p className="text-red-400 text-sm mt-1">{errors.recipientAddress}</p>
            )}
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">Token ID</label>
            <input
              type="text"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
              className={`input-field ${errors.tokenId ? 'error' : ''}`}
              placeholder="Token ID"
            />
            {errors.tokenId && (
              <p className="text-red-400 text-sm mt-1">{errors.tokenId}</p>
            )}
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`input-field ${errors.amount ? 'error' : ''}`}
              placeholder="Amount"
            />
            {errors.amount && (
              <p className="text-red-400 text-sm mt-1">{errors.amount}</p>
            )}
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={handleBatchIssueBadges}
            disabled={isLoading.batchIssue || !hasMinterRole}
            className="web3-button w-full disabled:opacity-50"
          >
            {isLoading.batchIssue ? "Batch Issuing..." : "Batch Issue Badges"}
          </button>
        </div>
      </div>

      {/* Grant Achievement */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-2xl">⭐</span>
          <h3 className="text-xl font-semibold text-white">Grant Achievement</h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">Student Address</label>
            <input
              type="text"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              className={`input-field ${errors.recipientAddress ? 'error' : ''}`}
              placeholder="0x..."
            />
            {errors.recipientAddress && (
              <p className="text-red-400 text-sm mt-1">{errors.recipientAddress}</p>
            )}
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">Achievement Name</label>
            <input
              type="text"
              value={achievementName}
              onChange={(e) => setAchievementName(e.target.value)}
              className={`input-field ${errors.achievementName ? 'error' : ''}`}
              placeholder="Achievement Name"
            />
            {errors.achievementName && (
              <p className="text-red-400 text-sm mt-1">{errors.achievementName}</p>
            )}
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">Rarity</label>
            <select
              value={rarity}
              onChange={(e) => setRarity(e.target.value)}
              className={`input-field ${errors.rarity ? 'error' : ''}`}
            >
              <option value="1">Common (100 max)</option>
              <option value="2">Uncommon (50 max)</option>
              <option value="3">Rare (25 max)</option>
              <option value="4">Legendary (10 max)</option>
            </select>
            {errors.rarity && (
              <p className="text-red-400 text-sm mt-1">{errors.rarity}</p>
            )}
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">Valid Until (Optional)</label>
            <input
              type="datetime-local"
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
              className="input-field"
            />
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={handleGrantAchievement}
            disabled={isLoading.grantAchievement || !hasMinterRole}
            className="web3-button w-full disabled:opacity-50"
          >
            {isLoading.grantAchievement ? "Granting..." : "Grant Achievement"}
          </button>
        </div>
      </div>

      {/* Create Workshop */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-2xl">🎓</span>
          <h3 className="text-xl font-semibold text-white">Create Workshop</h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">Workshop Name</label>
            <input
              type="text"
              value={workshopName}
              onChange={(e) => setWorkshopName(e.target.value)}
              className={`input-field ${errors.workshopName ? 'error' : ''}`}
              placeholder="Workshop Series Name"
            />
            {errors.workshopName && (
              <p className="text-red-400 text-sm mt-1">{errors.workshopName}</p>
            )}
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">Total Sessions</label>
            <input
              type="number"
              value={totalSessions}
              onChange={(e) => setTotalSessions(e.target.value)}
              className={`input-field ${errors.totalSessions ? 'error' : ''}`}
              placeholder="Number of sessions"
            />
            {errors.totalSessions && (
              <p className="text-red-400 text-sm mt-1">{errors.totalSessions}</p>
            )}
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={handleCreateWorkshop}
            disabled={isLoading.createWorkshop || !hasMinterRole}
            className="web3-button w-full disabled:opacity-50"
          >
            {isLoading.createWorkshop ? "Creating..." : "Create Workshop"}
          </button>
        </div>
      </div>

      {/* Verify Badge */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-2xl">🔍</span>
          <h3 className="text-xl font-semibold text-white">Verify Badge</h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">Holder Address</label>
            <input
              type="text"
              value={verifyAddress}
              onChange={(e) => setVerifyAddress(e.target.value)}
              className={`input-field ${errors.verifyAddress ? 'error' : ''}`}
              placeholder="0x..."
            />
            {errors.verifyAddress && (
              <p className="text-red-400 text-sm mt-1">{errors.verifyAddress}</p>
            )}
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">Token ID</label>
            <input
              type="text"
              value={verifyTokenId}
              onChange={(e) => setVerifyTokenId(e.target.value)}
              className={`input-field ${errors.verifyTokenId ? 'error' : ''}`}
              placeholder="Token ID"
            />
            {errors.verifyTokenId && (
              <p className="text-red-400 text-sm mt-1">{errors.verifyTokenId}</p>
            )}
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={handleVerifyBadge}
            className="web3-button w-full"
          >
            Verify Badge
          </button>
        </div>
        {verificationData && (
          <div className="mt-4 glass p-4 rounded-lg">
            <h4 className="font-semibold mb-2 text-white">Verification Result</h4>
            <div className="space-y-1 text-sm">
              <p><span className="text-gray-400">Valid:</span> <span className={verificationData.valid ? "text-green-400" : "text-red-400"}>{verificationData.valid ? "Yes" : "No"}</span></p>
              <p><span className="text-gray-400">Earned:</span> {new Date(Number(verificationData.earnedTimestamp) * 1000).toLocaleString()}</p>
            </div>
          </div>
        )}
      </div>

      {/* Note: Holder tokens functionality removed as getTokensByHolder was removed from contract */}

      {/* Badge Info */}
      {badgeData && (
        <div className="card">
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-2xl">ℹ️</span>
            <h3 className="text-lg font-semibold text-white">Badge Information</h3>
          </div>
          <div className="bg-white/5 backdrop-blur-xl p-4 rounded-lg border border-white/10">
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-400">Name:</span> {badgeData.name}</p>
              <p><span className="text-gray-400">Category:</span> {badgeData.category}</p>
              <p><span className="text-gray-400">Max Supply:</span> {badgeData.maxSupply.toString()}</p>
              <p><span className="text-gray-400">Transferable:</span> <span className={badgeData.isTransferable ? "text-green-400" : "text-red-400"}>{badgeData.isTransferable ? "Yes" : "No"}</span></p>
              <p><span className="text-gray-400">Valid Until:</span> {badgeData.validUntil.toString() === "0" ? "Never" : new Date(Number(badgeData.validUntil) * 1000).toLocaleString()}</p>
              <p><span className="text-gray-400">Issuer:</span> {badgeData.issuer}</p>
            </div>
          </div>
        </div>
      )}

      {/* Pause/Unpause */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-2xl">⏸️</span>
          <h3 className="text-xl font-semibold text-white">Pause/Unpause Transfers</h3>
        </div>
        <div className="space-y-4">
          <div className="bg-white/5 backdrop-blur-xl p-4 rounded-lg border border-white/10">
            <p className="text-sm text-gray-300">
              {isPaused ? 'Transfers are currently paused' : 'Transfers are currently active'}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

      {/* Events */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-2xl">📊</span>
          <h3 className="text-lg font-semibold text-white">Recent Events</h3>
        </div>
        <div className="bg-white/5 backdrop-blur-xl p-4 rounded-lg border border-white/10 max-h-60 overflow-y-auto scrollbar-hide">
          {events.length > 0 ? (
            <div className="space-y-3">
              {events.map((event, index) => {
                const eventData = event as { eventName?: string; blockNumber?: bigint; transactionHash?: string };
                return (
                  <div key={index} className="border-b border-white/10 pb-2 last:border-b-0">
                    <p className="font-semibold text-sm text-white">{eventData.eventName || 'Unknown Event'}</p>
                    <p className="text-xs text-gray-400">Block: {eventData.blockNumber?.toString() || 'N/A'}</p>
                    <p className="text-xs text-gray-400 font-mono">{eventData.transactionHash?.slice(0, 20) || 'N/A'}...</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No events yet</p>
          )}
        </div>
      </div>
    </div>
  );
}