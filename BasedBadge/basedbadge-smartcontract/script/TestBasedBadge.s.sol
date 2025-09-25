// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {BasedBadge} from "../src/BasedBadge.sol";

/**
 * @title BasedBadge Test Script
 * @dev Demonstrates how to use the BasedBadge contract after deployment
 * @author Daniel Sukamto
 */
contract TestBasedBadgeScript is Script {
    BasedBadge public basedBadge;
    address public testStudent = address(0x1234567890123456789012345678901234567890);
    
    function run() public {
        // Deploy the contract first
        vm.startBroadcast();
        basedBadge = new BasedBadge();
        vm.stopBroadcast();
        
        console.log("BasedBadge deployed at:", address(basedBadge));
        
        // Test creating different badge types
        _testCreateBadgeTypes();
        
        // Test issuing badges
        _testIssueBadges();
        
        // Test achievements
        _testAchievements();
        
        // Test workshop creation
        _testWorkshopCreation();
        
        console.log("\n=== ALL TESTS COMPLETED ===");
    }
    
    function _testCreateBadgeTypes() internal {
        console.log("\n--- Testing Badge Type Creation ---");
        
        vm.startBroadcast();
        
        // Create certificate
        uint256 certId = basedBadge.createBadgeType(
            "Web3 Developer Certificate",
            "certificate",
            1000,
            false, // non-transferable
            "https://api.basedbadge.com/certs/web3-dev"
        );
        console.log("Certificate created with ID:", certId);
        
        // Create event badge
        uint256 eventId = basedBadge.createBadgeType(
            "Base Conference 2024",
            "event",
            500,
            true, // transferable
            "https://api.basedbadge.com/events/base-conf-2024"
        );
        console.log("Event badge created with ID:", eventId);
        
        vm.stopBroadcast();
    }
    
    function _testIssueBadges() internal {
        console.log("\n--- Testing Badge Issuance ---");
        
        vm.startBroadcast();
        
        // Issue certificate to student
        basedBadge.issueBadge(testStudent, 1000); // Certificate ID
        console.log("Certificate issued to student");
        
        // Issue event badge to student
        basedBadge.issueBadge(testStudent, 2000); // Event badge ID
        console.log("Event badge issued to student");
        
        vm.stopBroadcast();
        
        // Check balances
        uint256 certBalance = basedBadge.balanceOf(testStudent, 1000);
        uint256 eventBalance = basedBadge.balanceOf(testStudent, 2000);
        
        console.log("Student certificate balance:", certBalance);
        console.log("Student event badge balance:", eventBalance);
    }
    
    function _testAchievements() internal {
        console.log("\n--- Testing Achievements ---");
        
        vm.startBroadcast();
        
        // Grant different rarity achievements
        uint256 commonId = basedBadge.grantAchievement(
            testStudent,
            "First Steps",
            1, // Common
            block.timestamp + 365 days
        );
        console.log("Common achievement granted, ID:", commonId);
        
        uint256 rareId = basedBadge.grantAchievement(
            testStudent,
            "Code Master",
            2, // Rare
            0 // No expiry
        );
        console.log("Rare achievement granted, ID:", rareId);
        
        vm.stopBroadcast();
        
        // Verify achievements
        (bool valid1,) = basedBadge.verifyBadge(testStudent, commonId);
        (bool valid2,) = basedBadge.verifyBadge(testStudent, rareId);
        
        console.log("Common achievement valid:", valid1);
        console.log("Rare achievement valid:", valid2);
    }
    
    function _testWorkshopCreation() internal {
        console.log("\n--- Testing Workshop Creation ---");
        
        vm.startBroadcast();
        
        // Create a 3-session workshop
        uint256[] memory sessionIds = basedBadge.createWorkshop("Advanced Solidity", 3);
        console.log("Workshop created with", sessionIds.length, "sessions");
        
        // Issue first session to student
        basedBadge.issueBadge(testStudent, sessionIds[0]);
        console.log("First workshop session issued to student");
        
        vm.stopBroadcast();
        
        // Check student's token balance for the workshop session
        uint256 sessionBalance = basedBadge.balanceOf(testStudent, sessionIds[0]);
        console.log("Student workshop session balance:", sessionBalance);
    }
}
