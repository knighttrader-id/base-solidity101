// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {BasedBadge} from "../src/BasedBadge.sol";

/**
 * @title Simple BasedBadge Deployment Script
 * @dev Simple deployment without complex role management
 */
contract DeployScript is Script {
    function run() public {
        // Get private key from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        // Start broadcasting with private key
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy BasedBadge contract
        console.log("Deploying BasedBadge contract...");
        BasedBadge basedBadge = new BasedBadge();
        
        console.log("BasedBadge deployed at:", address(basedBadge));
        console.log("Deployer:", msg.sender);
        
        vm.stopBroadcast();
        
        // Log deployment info
        console.log("\n=== DEPLOYMENT SUMMARY ===");
        console.log("Contract Address:", address(basedBadge));
        console.log("Deployer:", msg.sender);
        console.log("Network: Base Sepolia");
        console.log("Explorer: https://sepolia.basescan.org/address/", address(basedBadge));
    }
}
