#!/bin/bash

# BasedBadge Deployment Script
# This script deploys the BasedBadge contract to Base Sepolia

echo "🚀 Deploying BasedBadge to Base Sepolia..."

# Get the deployer address
DEPLOYER=$(cast wallet address --account metamask)
echo "📍 Deployer: $DEPLOYER"

# Deploy the contract
echo "📦 Deploying contract..."
forge script script/BasedBadge.s.sol:BasedBadgeScript \
  --rpc-url https://sepolia.base.org/ \
  --broadcast \
  --verify \
  --account metamask \
  --sender $DEPLOYER

echo "✅ Deployment complete!"
echo "📋 Contract Address: 0x5b73C5498c1E3b4dbA84de0F1833c4a029d90519"
echo "🌐 Network: Base Sepolia (Chain ID: 84532)"
echo "🔗 Explorer: https://sepolia.basescan.org/address/0x5b73C5498c1E3b4dbA84de0F1833c4a029d90519"
