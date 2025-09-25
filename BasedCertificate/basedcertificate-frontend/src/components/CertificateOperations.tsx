"use client";

import { useState, useEffect } from "react";
import { useAccount, useWriteContract, useReadContract, useWatchContractEvent } from "wagmi";
import { usePublicClient, useWalletClient } from "wagmi";
import { parseAbi } from "viem";

// Define the contract ABI and address
const contractABI = require("../lib/contract-abi.json");
const contractAddress = "0x4ac2057def8763135ffbfa1dc0d31656d960006a" as `0x${string}`;

// Debug logging
console.log("Contract Address:", contractAddress);
console.log("Contract ABI loaded:", !!contractABI);

// Define the certificate data structure
interface CertificateData {
  recipientName: string;
  course: string;
  issuer: string;
  issuedDate: bigint;
  valid: boolean;
}

export default function CertificateOperations() {
  const { address, isConnected } = useAccount();
  const { writeContract } = useWriteContract();
  
  // Hydration state
  const [mounted, setMounted] = useState(false);
  
  // State variables for certificate operations
  const [recipientAddress, setRecipientAddress] = useState<string>("");
  const [recipientName, setRecipientName] = useState<string>("");
  const [course, setCourse] = useState<string>("");
  const [issuer, setIssuer] = useState<string>("");
  const [uri, setUri] = useState<string>("");
  const [tokenId, setTokenId] = useState<string>("");
  const [newCourse, setNewCourse] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [account, setAccount] = useState<string>("");
  const [certificateData, setCertificateData] = useState<CertificateData | null>(null);
  const [ownerCertificates, setOwnerCertificates] = useState<bigint[]>([]);
  const [hasRole, setHasRole] = useState<boolean>(false);
  const [events, setEvents] = useState<any[]>([]);
  
  // Validation state
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState<{[key: string]: boolean}>({});
  
  // Watch contract events
  useWatchContractEvent({
    address: contractAddress,
    abi: contractABI,
    eventName: "CertificateIssued",
    onLogs: (logs) => {
      setEvents(prev => [...prev, ...logs]);
    }
  });
  
  useWatchContractEvent({
    address: contractAddress,
    abi: contractABI,
    eventName: "CertificateRevoked",
    onLogs: (logs) => {
      setEvents(prev => [...prev, ...logs]);
    }
  });
  
  useWatchContractEvent({
    address: contractAddress,
    abi: contractABI,
    eventName: "CertificateUpdated",
    onLogs: (logs) => {
      setEvents(prev => [...prev, ...logs]);
    }
  });
  
  useWatchContractEvent({
    address: contractAddress,
    abi: contractABI,
    eventName: "RoleGranted",
    onLogs: (logs) => {
      setEvents(prev => [...prev, ...logs]);
    }
  });
  
  useWatchContractEvent({
    address: contractAddress,
    abi: contractABI,
    eventName: "RoleRevoked",
    onLogs: (logs) => {
      setEvents(prev => [...prev, ...logs]);
    }
  });

  // Read certificate data
  const { data: certData, refetch: refetchCertificate } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "certificates",
    args: [BigInt(tokenId || 0)]
  });

  // Read certificates by owner
  const { data: ownerCerts, refetch: refetchOwnerCertificates } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "getCertificatesByOwner",
    args: [recipientAddress as `0x${string}`]
  });

  // Check if account has role
  const { data: roleCheck, refetch: refetchRole } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "hasRole",
    args: [role as `0x${string}`, account as `0x${string}`]
  });

  // Read role admin
  const { data: roleAdmin } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "getRoleAdmin",
    args: [role as `0x${string}`]
  }) as { data: string | undefined };

  // Validation functions
  const validateAddress = (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const validateTokenId = (id: string): boolean => {
    return /^\d+$/.test(id) && parseInt(id) > 0;
  };

  const validateRole = (role: string): boolean => {
    const validRoles = [
      "0x114e74f6ea3bd819998f78687bfcb11b140da08e9b7d222fa9c1f1ba1f2aa122", // ISSUER_ROLE
      "0x241ecf16d79d0f8dbfb92cbc07fe17840425976cf0667f022fe9877caa831b08"  // MANAGER_ROLE
    ];
    return validRoles.includes(role);
  };

  const validateForm = (formType: string, data: any): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    if (formType === "issue") {
      if (!data.recipientAddress || !validateAddress(data.recipientAddress)) {
        newErrors.recipientAddress = "Please enter a valid Ethereum address";
      }
      if (!data.recipientName || data.recipientName.trim().length < 2) {
        newErrors.recipientName = "Recipient name must be at least 2 characters";
      }
      if (!data.course || data.course.trim().length < 2) {
        newErrors.course = "Course name must be at least 2 characters";
      }
      if (!data.issuer || data.issuer.trim().length < 2) {
        newErrors.issuer = "Issuer name must be at least 2 characters";
      }
      if (!data.uri || !data.uri.startsWith("http")) {
        newErrors.uri = "Please enter a valid URI starting with http";
      }
    } else if (formType === "revoke" || formType === "update" || formType === "burn") {
      if (!data.tokenId || !validateTokenId(data.tokenId)) {
        newErrors.tokenId = "Please enter a valid token ID (positive number)";
      }
    } else if (formType === "update") {
      if (!data.newCourse || data.newCourse.trim().length < 2) {
        newErrors.newCourse = "New course name must be at least 2 characters";
      }
    } else if (formType === "role") {
      if (!data.role || !validateRole(data.role)) {
        newErrors.role = "Please enter a valid role hash";
      }
      if (!data.account || !validateAddress(data.account)) {
        newErrors.account = "Please enter a valid Ethereum address";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Issue certificate
  const handleIssueCertificate = async () => {
    if (!isConnected) {
      alert("Please connect your wallet first");
      return;
    }
    
    if (!contractAddress) {
      alert("Contract address not configured");
      return;
    }
    
    const formData = { recipientAddress, recipientName, course, issuer, uri };
    if (!validateForm("issue", formData)) {
      return;
    }
    
    setIsLoading(prev => ({ ...prev, issue: true }));
    
    try {
      console.log("Issuing certificate with data:", formData);
      const result = await writeContract({
        address: contractAddress,
        abi: contractABI,
        functionName: "issueCertificate",
        args: [
          recipientAddress as `0x${string}`,
          recipientName,
          course,
          issuer,
          uri
        ]
      });
      console.log("Certificate issued successfully:", result);
      alert("Certificate issued successfully!");
      // Clear form
      setRecipientAddress("");
      setRecipientName("");
      setCourse("");
      setIssuer("");
      setUri("");
    } catch (error) {
      console.error("Error issuing certificate:", error);
      alert(`Error issuing certificate: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(prev => ({ ...prev, issue: false }));
    }
  };

  // Revoke certificate
  const handleRevokeCertificate = async () => {
    if (!isConnected) {
      alert("Please connect your wallet first");
      return;
    }
    
    if (!contractAddress) {
      alert("Contract address not configured");
      return;
    }
    
    const formData = { tokenId };
    if (!validateForm("revoke", formData)) {
      return;
    }
    
    setIsLoading(prev => ({ ...prev, revoke: true }));
    
    try {
      console.log("Revoking certificate with tokenId:", tokenId);
      const result = await writeContract({
        address: contractAddress,
        abi: contractABI,
        functionName: "revokeCertificate",
        args: [BigInt(tokenId)]
      });
      console.log("Certificate revoked successfully:", result);
      alert("Certificate revoked successfully!");
      setTokenId("");
    } catch (error) {
      console.error("Error revoking certificate:", error);
      alert(`Error revoking certificate: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(prev => ({ ...prev, revoke: false }));
    }
  };

  // Update certificate
  const handleUpdateCertificate = async () => {
    if (!isConnected || !contractAddress) {
      alert("Please connect your wallet first");
      return;
    }
    
    const formData = { tokenId, newCourse };
    if (!validateForm("update", formData)) {
      return;
    }
    
    setIsLoading(prev => ({ ...prev, update: true }));
    
    try {
      await writeContract({
        address: contractAddress,
        abi: contractABI,
        functionName: "updateCertificate",
        args: [BigInt(tokenId), newCourse]
      });
      alert("Certificate updated successfully!");
      setTokenId("");
      setNewCourse("");
    } catch (error) {
      console.error("Error updating certificate:", error);
      alert("Error updating certificate. Check console for details.");
    } finally {
      setIsLoading(prev => ({ ...prev, update: false }));
    }
  };

  // Burn certificate
  const handleBurnCertificate = async () => {
    if (!isConnected || !contractAddress) {
      alert("Please connect your wallet first");
      return;
    }
    
    const formData = { tokenId };
    if (!validateForm("burn", formData)) {
      return;
    }
    
    setIsLoading(prev => ({ ...prev, burn: true }));
    
    try {
      await writeContract({
        address: contractAddress,
        abi: contractABI,
        functionName: "burnCertificate",
        args: [BigInt(tokenId)]
      });
      alert("Certificate burned successfully!");
      setTokenId("");
    } catch (error) {
      console.error("Error burning certificate:", error);
      alert("Error burning certificate. Check console for details.");
    } finally {
      setIsLoading(prev => ({ ...prev, burn: false }));
    }
  };

  // Grant role
  const handleGrantRole = async () => {
    if (!isConnected || !contractAddress) {
      alert("Please connect your wallet first");
      return;
    }
    
    const formData = { role, account };
    if (!validateForm("role", formData)) {
      return;
    }
    
    setIsLoading(prev => ({ ...prev, grantRole: true }));
    
    try {
      await writeContract({
        address: contractAddress,
        abi: contractABI,
        functionName: "grantRole",
        args: [role as `0x${string}`, account as `0x${string}`]
      });
      alert("Role granted successfully!");
      setRole("");
      setAccount("");
    } catch (error) {
      console.error("Error granting role:", error);
      alert("Error granting role. Check console for details.");
    } finally {
      setIsLoading(prev => ({ ...prev, grantRole: false }));
    }
  };

  // Revoke role
  const handleRevokeRole = async () => {
    if (!isConnected || !contractAddress) {
      alert("Please connect your wallet first");
      return;
    }
    
    const formData = { role, account };
    if (!validateForm("role", formData)) {
      return;
    }
    
    setIsLoading(prev => ({ ...prev, revokeRole: true }));
    
    try {
      await writeContract({
        address: contractAddress,
        abi: contractABI,
        functionName: "revokeRole",
        args: [role as `0x${string}`, account as `0x${string}`]
      });
      alert("Role revoked successfully!");
      setRole("");
      setAccount("");
    } catch (error) {
      console.error("Error revoking role:", error);
      alert("Error revoking role. Check console for details.");
    } finally {
      setIsLoading(prev => ({ ...prev, revokeRole: false }));
    }
  };

  // Fetch certificate data when tokenId changes
  useEffect(() => {
    if (tokenId) {
      refetchCertificate();
    }
  }, [tokenId, refetchCertificate]);

  // Update certificate data state when certData changes
  useEffect(() => {
    if (certData && Array.isArray(certData)) {
      setCertificateData({
        recipientName: certData[0] as string,
        course: certData[1] as string,
        issuer: certData[2] as string,
        issuedDate: certData[3] as bigint,
        valid: certData[4] as boolean
      });
    }
  }, [certData]);

  // Fetch owner certificates when recipientAddress changes
  useEffect(() => {
    if (recipientAddress) {
      refetchOwnerCertificates();
    }
  }, [recipientAddress, refetchOwnerCertificates]);

  // Update owner certificates state when ownerCerts changes
  useEffect(() => {
    if (ownerCerts && Array.isArray(ownerCerts)) {
      setOwnerCertificates(ownerCerts as bigint[]);
    }
  }, [ownerCerts]);

  // Check role when role or account changes
  useEffect(() => {
    if (role && account) {
      refetchRole();
    }
  }, [role, account, refetchRole]);

  // Update hasRole state when roleCheck changes
  useEffect(() => {
    if (roleCheck !== undefined) {
      setHasRole(roleCheck as boolean);
    }
  }, [roleCheck]);

  // Set mounted state to prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Show loading state until component is mounted
  if (!mounted) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold gradient-text">Certificate Operations</h2>
        <div className="flex items-center space-x-4 text-sm">
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
      
      {!isConnected && (
        <div className="card bg-yellow-500/10 border border-yellow-500/30">
          <div className="flex items-center space-x-2 text-yellow-400">
            <span className="text-xl">⚠️</span>
            <p className="text-sm">Please connect your wallet to interact with the contract</p>
          </div>
        </div>
      )}
      
      {/* Issue Certificate */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-2xl">📜</span>
          <h3 className="text-xl font-semibold text-white">Issue Certificate</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <label className="block mb-2 text-sm font-medium text-gray-300">Recipient Name</label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className={`input-field ${errors.recipientName ? 'error' : ''}`}
              placeholder="Recipient Name"
            />
            {errors.recipientName && (
              <p className="text-red-400 text-sm mt-1">{errors.recipientName}</p>
            )}
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">Course</label>
            <input
              type="text"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className={`input-field ${errors.course ? 'error' : ''}`}
              placeholder="Course Name"
            />
            {errors.course && (
              <p className="text-red-400 text-sm mt-1">{errors.course}</p>
            )}
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">Issuer</label>
            <input
              type="text"
              value={issuer}
              onChange={(e) => setIssuer(e.target.value)}
              className={`input-field ${errors.issuer ? 'error' : ''}`}
              placeholder="Issuer Name"
            />
            {errors.issuer && (
              <p className="text-red-400 text-sm mt-1">{errors.issuer}</p>
            )}
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">URI</label>
            <input
              type="text"
              value={uri}
              onChange={(e) => setUri(e.target.value)}
              className={`input-field ${errors.uri ? 'error' : ''}`}
              placeholder="Metadata URI"
            />
            {errors.uri && (
              <p className="text-red-400 text-sm mt-1">{errors.uri}</p>
            )}
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={handleIssueCertificate}
            disabled={isLoading.issue}
            className="web3-button w-full"
          >
            {isLoading.issue ? "Issuing..." : "Issue Certificate"}
          </button>
        </div>
      </div>
      
      {/* Certificate Management */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Revoke Certificate */}
        <div className="card">
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-2xl">❌</span>
            <h3 className="text-lg font-semibold text-white">Revoke</h3>
          </div>
          <div className="space-y-3">
            <div className="glass p-2 rounded text-xs text-gray-400">
              <p>Requires MANAGER_ROLE</p>
              <p>Marks certificate as invalid</p>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-300">Token ID</label>
              <input
                type="text"
                value={tokenId}
                onChange={(e) => setTokenId(e.target.value)}
                className={`input-field ${errors.tokenId ? 'error' : ''}`}
                placeholder="Token ID"
              />
              {errors.tokenId && (
                <p className="text-red-400 text-xs mt-1">{errors.tokenId}</p>
              )}
            </div>
            <button
              onClick={handleRevokeCertificate}
              disabled={isLoading.revoke}
              className="w-full bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 disabled:opacity-50 py-2 px-3 rounded-lg transition-colors text-sm"
            >
              {isLoading.revoke ? "Revoking..." : "Revoke Certificate"}
            </button>
          </div>
        </div>
        
        {/* Update Certificate */}
        <div className="card">
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-2xl">✏️</span>
            <h3 className="text-lg font-semibold text-white">Update</h3>
          </div>
          <div className="space-y-3">
            <div className="glass p-2 rounded text-xs text-gray-400">
              <p>Requires MANAGER_ROLE</p>
              <p>Updates course information</p>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-300">Token ID</label>
              <input
                type="text"
                value={tokenId}
                onChange={(e) => setTokenId(e.target.value)}
                className={`input-field ${errors.tokenId ? 'error' : ''}`}
                placeholder="Token ID"
              />
              {errors.tokenId && (
                <p className="text-red-400 text-xs mt-1">{errors.tokenId}</p>
              )}
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-300">New Course</label>
              <input
                type="text"
                value={newCourse}
                onChange={(e) => setNewCourse(e.target.value)}
                className={`input-field ${errors.newCourse ? 'error' : ''}`}
                placeholder="New Course Name"
              />
              {errors.newCourse && (
                <p className="text-red-400 text-xs mt-1">{errors.newCourse}</p>
              )}
            </div>
            <button
              onClick={handleUpdateCertificate}
              disabled={isLoading.update}
              className="w-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/30 disabled:opacity-50 py-2 px-3 rounded-lg transition-colors text-sm"
            >
              {isLoading.update ? "Updating..." : "Update Certificate"}
            </button>
          </div>
        </div>
        
        {/* Burn Certificate */}
        <div className="card">
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-2xl">🔥</span>
            <h3 className="text-lg font-semibold text-white">Burn</h3>
          </div>
          <div className="space-y-3">
            <div className="glass p-2 rounded text-xs text-gray-400">
              <p>Owner or MANAGER_ROLE</p>
              <p>Permanently destroys certificate</p>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-300">Token ID</label>
              <input
                type="text"
                value={tokenId}
                onChange={(e) => setTokenId(e.target.value)}
                className={`input-field ${errors.tokenId ? 'error' : ''}`}
                placeholder="Token ID"
              />
              {errors.tokenId && (
                <p className="text-red-400 text-xs mt-1">{errors.tokenId}</p>
              )}
            </div>
            <button
              onClick={handleBurnCertificate}
              disabled={isLoading.burn}
              className="w-full bg-purple-500/20 border border-purple-500/30 text-purple-400 hover:bg-purple-500/30 disabled:opacity-50 py-2 px-3 rounded-lg transition-colors text-sm"
            >
              {isLoading.burn ? "Burning..." : "Burn Certificate"}
            </button>
          </div>
        </div>
      </div>
      
      {/* Role Management */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-2xl">👥</span>
          <h3 className="text-xl font-semibold text-white">Role Management</h3>
        </div>
        
        <div className="mb-4 p-3 glass rounded-lg">
          <h4 className="text-sm font-semibold mb-2 text-gray-300">Available Roles (click to copy):</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div 
              className="cursor-pointer hover:bg-blue-500/20 p-2 rounded border border-blue-500/30 transition-colors"
              onClick={() => setRole("0x114e74f6ea3bd819998f78687bfcb11b140da08e9b7d222fa9c1f1ba1f2aa122")}
            >
              <span className="text-blue-400 font-medium">ISSUER_ROLE</span>
              <p className="text-gray-400 font-mono text-xs mt-1">0x114e74f6...f2aa122</p>
              <p className="text-gray-500 text-xs mt-1">Issue certificates</p>
            </div>
            <div 
              className="cursor-pointer hover:bg-green-500/20 p-2 rounded border border-green-500/30 transition-colors"
              onClick={() => setRole("0x241ecf16d79d0f8dbfb92cbc07fe17840425976cf0667f022fe9877caa831b08")}
            >
              <span className="text-green-400 font-medium">MANAGER_ROLE</span>
              <p className="text-gray-400 font-mono text-xs mt-1">0x241ecf16...31b08</p>
              <p className="text-gray-500 text-xs mt-1">Revoke, update, burn certificates</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">Role</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={`input-field ${errors.role ? 'error' : ''}`}
              placeholder="Role (bytes32)"
            />
            {errors.role && (
              <p className="text-red-400 text-xs mt-1">{errors.role}</p>
            )}
            {roleAdmin && (
              <p className="mt-2 text-xs text-gray-400">
                Role Admin: {String(roleAdmin)}
              </p>
            )}
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">Account</label>
            <input
              type="text"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              className={`input-field ${errors.account ? 'error' : ''}`}
              placeholder="Account Address"
            />
            {errors.account && (
              <p className="text-red-400 text-xs mt-1">{errors.account}</p>
            )}
            {role && account && (
              <p className="mt-2 text-xs text-gray-400">
                Has Role: {hasRole ? "Yes" : "No"}
              </p>
            )}
          </div>
        </div>
        <div className="flex space-x-3 mt-4">
          <button
            onClick={handleGrantRole}
            disabled={isLoading.grantRole}
            className="flex-1 bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30 disabled:opacity-50 py-2 px-3 rounded-lg transition-colors text-sm"
          >
            {isLoading.grantRole ? "Granting..." : "Grant Role"}
          </button>
          <button
            onClick={handleRevokeRole}
            disabled={isLoading.revokeRole}
            className="flex-1 bg-orange-500/20 border border-orange-500/30 text-orange-400 hover:bg-orange-500/30 disabled:opacity-50 py-2 px-3 rounded-lg transition-colors text-sm"
          >
            {isLoading.revokeRole ? "Revoking..." : "Revoke Role"}
          </button>
        </div>
      </div>
      
      {/* Data Views */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* View Certificate Data */}
        <div className="card">
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-2xl">🔍</span>
            <h3 className="text-lg font-semibold text-white">View Certificate</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-300">Token ID</label>
              <input
                type="text"
                value={tokenId}
                onChange={(e) => setTokenId(e.target.value)}
                className="input-field"
                placeholder="Token ID"
              />
            </div>
            {certificateData && (
              <div className="glass p-3 rounded-lg">
                <h4 className="font-semibold mb-2 text-white">Certificate Details</h4>
                <div className="space-y-1 text-sm">
                  <p><span className="text-gray-400">Name:</span> {certificateData.recipientName}</p>
                  <p><span className="text-gray-400">Course:</span> {certificateData.course}</p>
                  <p><span className="text-gray-400">Issuer:</span> {certificateData.issuer}</p>
                  <p><span className="text-gray-400">Date:</span> {new Date(Number(certificateData.issuedDate) * 1000).toLocaleDateString()}</p>
                  <p><span className="text-gray-400">Valid:</span> <span className={certificateData.valid ? "text-green-400" : "text-red-400"}>{certificateData.valid ? "Yes" : "No"}</span></p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* View Owner Certificates */}
        <div className="card">
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-2xl">👤</span>
            <h3 className="text-lg font-semibold text-white">Owner Certificates</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-300">Owner Address</label>
              <input
                type="text"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                className="input-field"
                placeholder="Owner Address"
              />
            </div>
            {ownerCertificates.length > 0 && (
              <div className="glass p-3 rounded-lg">
                <h4 className="font-semibold mb-2 text-white">Certificate IDs</h4>
                <div className="flex flex-wrap gap-2">
                  {ownerCertificates.map((id, index) => (
                    <span key={index} className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs font-mono">
                      #{id.toString()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Events */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-2xl">📊</span>
          <h3 className="text-lg font-semibold text-white">Recent Events</h3>
        </div>
        <div className="glass p-4 rounded-lg max-h-60 overflow-y-auto scrollbar-hide">
          {events.length > 0 ? (
            <div className="space-y-3">
              {events.map((event, index) => (
                <div key={index} className="border-b border-white/10 pb-2 last:border-b-0">
                  <p className="font-semibold text-sm text-white">{event.eventName}</p>
                  <p className="text-xs text-gray-400">Block: {event.blockNumber?.toString()}</p>
                  <p className="text-xs text-gray-400 font-mono">{event.transactionHash?.slice(0, 20)}...</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No events yet</p>
          )}
        </div>
      </div>
    </div>
  );
}