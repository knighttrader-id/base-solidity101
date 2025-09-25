#!/bin/bash

# BasedBadge Contract Test Script
# This script tests the deployed BasedBadge contract

CONTRACT_ADDRESS="0x5b73C5498c1E3b4dbA84de0F1833c4a029d90519"
RPC_URL="https://sepolia.base.org/"

echo "🧪 Testing BasedBadge Contract..."
echo "📍 Contract: $CONTRACT_ADDRESS"
echo "🌐 Network: Base Sepolia"

# Test 1: Check contract name
echo "📋 Test 1: Contract Name"
cast call $CONTRACT_ADDRESS "name()" --rpc-url $RPC_URL

# Test 2: Check total supply of certificate (ID: 1000)
echo "📋 Test 2: Certificate Total Supply"
cast call $CONTRACT_ADDRESS "totalSupply(uint256)" 1000 --rpc-url $RPC_URL

# Test 3: Check total supply of event badge (ID: 2000)
echo "📋 Test 3: Event Badge Total Supply"
cast call $CONTRACT_ADDRESS "totalSupply(uint256)" 2000 --rpc-url $RPC_URL

# Test 4: Check token info for certificate
echo "📋 Test 4: Certificate Token Info"
cast call $CONTRACT_ADDRESS "tokenInfo(uint256)" 1000 --rpc-url $RPC_URL

echo "✅ Contract tests completed!"
