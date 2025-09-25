// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {BasedBadge} from "../src/BasedBadge.sol";

/**
 * @title BasedBadge Deployment Script
 * @dev Deploys the BasedBadge contract and sets up initial configuration
 * @author Daniel Sukamto
 */
contract BasedBadgeScript is Script {
    BasedBadge public basedBadge;
    
    // Deployment configuration
    address public deployer;
    address public minter;
    address public pauser;
    address public uriSetter;
    
    function setUp() public {
        // Get deployer from environment or use msg.sender
        deployer = vm.envOr("DEPLOYER", msg.sender);
        minter = vm.envOr("MINTER", deployer);
        pauser = vm.envOr("PAUSER", deployer);
        uriSetter = vm.envOr("URI_SETTER", deployer);
    }
    
    function run() public {
        // Start broadcasting transactions with proper sender
        vm.startBroadcast();
        
        // Deploy BasedBadge contract
        console.log("Deploying BasedBadge contract...");
        console.log("Deployer:", deployer);
        
        basedBadge = new BasedBadge();
        
        console.log("BasedBadge deployed at:", address(basedBadge));
        
        // Grant additional roles if different from deployer
        if (minter != deployer) {
            console.log("Granting MINTER_ROLE to:", minter);
            basedBadge.grantRole(basedBadge.MINTER_ROLE(), minter);
        }
        
        if (pauser != deployer) {
            console.log("Granting PAUSER_ROLE to:", pauser);
            basedBadge.grantRole(basedBadge.PAUSER_ROLE(), pauser);
        }
        
        if (uriSetter != deployer) {
            console.log("Granting URI_SETTER_ROLE to:", uriSetter);
            basedBadge.grantRole(basedBadge.URI_SETTER_ROLE(), uriSetter);
        }
        
        // Create some example badge types
        _createExampleBadges();
        
        vm.stopBroadcast();
        
        // Log deployment summary
        _logDeploymentSummary();
    }
    
    function _createExampleBadges() internal {
        console.log("Creating example badge types...");
        
        // Create a certificate type
        uint256 certId = basedBadge.createBadgeType(
            "Solidity Developer Certificate",
            "certificate",
            1000, // maxSupply
            false, // non-transferable
            "https://api.basedbadge.com/certificates/solidity-developer"
        );
        console.log("Certificate created with ID:", certId);
        
        // Create an event badge type
        uint256 eventId = basedBadge.createBadgeType(
            "Base Workshop Attendee",
            "event",
            500, // maxSupply
            true, // transferable
            "https://api.basedbadge.com/events/base-workshop"
        );
        console.log("Event badge created with ID:", eventId);
        
        // Create an achievement type
        uint256 achievementId = basedBadge.createBadgeType(
            "First Contribution",
            "achievement",
            100, // maxSupply
            false, // non-transferable
            "https://api.basedbadge.com/achievements/first-contribution"
        );
        console.log("Achievement created with ID:", achievementId);
        
        // Create a workshop series
        uint256[] memory workshopIds = basedBadge.createWorkshop("Advanced Solidity", 3);
        console.log("Workshop series created with IDs:");
        for (uint256 i = 0; i < workshopIds.length; i++) {
            console.log("  Session", i + 1, ":", workshopIds[i]);
        }
    }
    
    function _logDeploymentSummary() internal view {
        console.log("\n=== DEPLOYMENT SUMMARY ===");
        console.log("Contract Address:", address(basedBadge));
        console.log("Deployer:", deployer);
        console.log("Minter:", minter);
        console.log("Pauser:", pauser);
        console.log("URI Setter:", uriSetter);
        console.log("\n=== TOKEN ID RANGES ===");
        console.log("Certificate Base:", basedBadge.CERTIFICATE_BASE());
        console.log("Event Badge Base:", basedBadge.EVENT_BADGE_BASE());
        console.log("Achievement Base:", basedBadge.ACHIEVEMENT_BASE());
        console.log("Workshop Base:", basedBadge.WORKSHOP_BASE());
        console.log("\n=== ROLES ===");
        console.log("DEFAULT_ADMIN_ROLE:", vm.toString(basedBadge.DEFAULT_ADMIN_ROLE()));
        console.log("MINTER_ROLE:", vm.toString(basedBadge.MINTER_ROLE()));
        console.log("PAUSER_ROLE:", vm.toString(basedBadge.PAUSER_ROLE()));
        console.log("URI_SETTER_ROLE:", vm.toString(basedBadge.URI_SETTER_ROLE()));
        console.log("\n=== DEPLOYMENT COMPLETE ===");
    }
    
    /**
     * @dev Helper function to issue a certificate to a student
     * @param student The address of the student
     * @param tokenId The token ID to issue
     */
    function issueCertificate(address student, uint256 tokenId) external {
        require(address(basedBadge) != address(0), "Contract not deployed");
        vm.startBroadcast();
        basedBadge.issueBadge(student, tokenId);
        vm.stopBroadcast();
        console.log("Certificate issued to: %s, Token ID: %d", student, tokenId);
    }
    
    /**
     * @dev Helper function to grant an achievement to a student
     * @param student The address of the student
     * @param achievementName The name of the achievement
     * @param rarity The rarity level (1-4)
     * @param validUntil Expiry timestamp (0 for no expiry)
     */
    function grantAchievement(
        address student, 
        string memory achievementName, 
        uint256 rarity, 
        uint256 validUntil
    ) external returns (uint256) {
        require(address(basedBadge) != address(0), "Contract not deployed");
        vm.startBroadcast();
        uint256 tokenId = basedBadge.grantAchievement(student, achievementName, rarity, validUntil);
        vm.stopBroadcast();
        console.log("Achievement granted to: %s, Token ID: %d", student, tokenId);
        return tokenId;
    }
    
    /**
     * @dev Helper function to batch issue badges for an event
     * @param recipients Array of recipient addresses
     * @param tokenId The token ID to issue
     * @param amount Amount per recipient
     */
    function batchIssueEventBadges(
        address[] memory recipients, 
        uint256 tokenId, 
        uint256 amount
    ) external {
        require(address(basedBadge) != address(0), "Contract not deployed");
        vm.startBroadcast();
        basedBadge.batchIssueBadges(recipients, tokenId, amount);
        vm.stopBroadcast();
        console.log("Batch issued %d badges to %d recipients", amount, recipients.length);
    }
}
