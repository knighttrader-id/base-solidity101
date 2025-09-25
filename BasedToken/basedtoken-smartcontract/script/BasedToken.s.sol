// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Script, console} from "../lib/forge-std/src/Script.sol";
import {BasedToken} from "../src/BasedToken.sol";

contract BasedTokenScript is Script {
    BasedToken public token;

    function setUp() public {}

    function run() public {
        console.log("Starting BasedToken deployment to Base Testnet...");
        console.log("");

        // Load deployer's private key from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console.log("Deployment Details:");
        console.log("Deployer address:", deployer);

        // Check balance
        uint256 balance = deployer.balance;
        console.log("Deployer balance:", balance / 1e18, "ETH");

        if (balance < 0.01 ether) {
            console.log("Warning: Low balance. Make sure you have enough ETH for deployment.");
        }

        // Get network info
        console.log("Network: Base Testnet");
        console.log("Chain ID: 84532");
        console.log("RPC URL: https://sepolia.base.org");
        console.log("");

        vm.startBroadcast(deployerPrivateKey);
        console.log("Deploying BasedToken contract...");
        token = new BasedToken(); // Constructor has hardcoded values
        
        // Roles are already granted to deployer in constructor
        vm.stopBroadcast();

        console.log("BasedToken deployed at:", address(token));
        console.log("Deployer:", deployer);
        console.log("Initial supply:", token.totalSupply() / 1e18, "BASED");
        console.log("Daily reward amount:", token.dailyRewardAmount() / 1e18, "BASED");
        console.log("All roles granted to deployer in constructor");
    }
}