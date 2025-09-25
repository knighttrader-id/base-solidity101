// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Test} from "forge-std/Test.sol";
import {BasedBadge} from "../src/BasedBadge.sol";

contract BasedBadgeTest is Test {
    BasedBadge badge;
    address deployer = address(0x1);
    address minter = address(0x2);
    address student = address(0x3);
    address student2 = address(0x4);

    function setUp() public {
        vm.startPrank(deployer);
        badge = new BasedBadge();
        // Grant minter role to minter address
        badge.grantRole(badge.MINTER_ROLE(), minter);
        vm.stopPrank();
    }

    // ------------------------------------------------------------
    // Deployment Tests
    // ------------------------------------------------------------
    function testDeployment() public view {
        assertTrue(badge.hasRole(badge.DEFAULT_ADMIN_ROLE(), deployer));
        assertTrue(badge.hasRole(badge.URI_SETTER_ROLE(), deployer));
        assertTrue(badge.hasRole(badge.PAUSER_ROLE(), deployer));
        assertTrue(badge.hasRole(badge.MINTER_ROLE(), deployer));
        assertTrue(badge.hasRole(badge.MINTER_ROLE(), minter));
    }

    // ------------------------------------------------------------
    // Badge Type Creation Tests
    // ------------------------------------------------------------
    function testCreateBadgeType() public {
        vm.startPrank(minter);
        
        uint256 tokenId = badge.createBadgeType(
            "Web3 Certificate",
            "certificate",
            100,
            false,
            "https://api.example.com/cert/1"
        );
        
        vm.stopPrank();
        
        // Check tokenId is in certificate range
        assertTrue(tokenId >= badge.CERTIFICATE_BASE());
        assertTrue(tokenId < badge.EVENT_BADGE_BASE());
        
        // Check token info
        (string memory name, string memory category, uint256 maxSupply, bool isTransferable, uint256 validUntil, address issuer) = badge.tokenInfo(tokenId);
        assertEq(name, "Web3 Certificate");
        assertEq(category, "certificate");
        assertEq(maxSupply, 100);
        assertFalse(isTransferable);
        assertEq(validUntil, 0);
        assertEq(issuer, minter);
    }

    function testCreateEventBadge() public {
        vm.startPrank(minter);
        
        uint256 tokenId = badge.createBadgeType(
            "Conference Badge",
            "event",
            500,
            true,
            "https://api.example.com/event/1"
        );
        
        vm.stopPrank();
        
        // Check tokenId is in event range
        assertTrue(tokenId >= badge.EVENT_BADGE_BASE());
        assertTrue(tokenId < badge.ACHIEVEMENT_BASE());
        
        // Check token info
        (string memory name, string memory category, uint256 maxSupply, bool isTransferable, uint256 validUntil, address issuer) = badge.tokenInfo(tokenId);
        assertEq(name, "Conference Badge");
        assertEq(category, "event");
        assertEq(maxSupply, 500);
        assertTrue(isTransferable);
        assertEq(issuer, minter);
    }

    function testCreateAchievementBadge() public {
        vm.startPrank(minter);
        
        uint256 tokenId = badge.createBadgeType(
            "Top Performer",
            "achievement",
            50,
            false,
            "https://api.example.com/achievement/1"
        );
        
        vm.stopPrank();
        
        // Check tokenId is in achievement range
        assertTrue(tokenId >= badge.ACHIEVEMENT_BASE());
        assertTrue(tokenId < badge.WORKSHOP_BASE());
        
        // Check token info
        (string memory name, string memory category, uint256 maxSupply, bool isTransferable, uint256 validUntil, address issuer) = badge.tokenInfo(tokenId);
        assertEq(name, "Top Performer");
        assertEq(category, "achievement");
        assertEq(maxSupply, 50);
        assertFalse(isTransferable);
        assertEq(issuer, minter);
    }

    function testCreateWorkshopBadge() public {
        vm.startPrank(minter);
        
        uint256 tokenId = badge.createBadgeType(
            "Solidity Workshop",
            "workshop",
            200,
            false,
            "https://api.example.com/workshop/1"
        );
        
        vm.stopPrank();
        
        // Check tokenId is in workshop range
        assertTrue(tokenId >= badge.WORKSHOP_BASE());
        
        // Check token info
        (string memory name, string memory category, uint256 maxSupply, bool isTransferable, uint256 validUntil, address issuer) = badge.tokenInfo(tokenId);
        assertEq(name, "Solidity Workshop");
        assertEq(category, "workshop");
        assertEq(maxSupply, 200);
        assertFalse(isTransferable);
        assertEq(issuer, minter);
    }

    function test_RevertCreateBadgeTypeInvalidCategory() public {
        vm.startPrank(minter);
        
        vm.expectRevert("BasedBadge: Invalid category");
        badge.createBadgeType(
            "Invalid Badge",
            "invalid",
            100,
            true,
            "https://api.example.com/invalid/1"
        );
        
        vm.stopPrank();
    }

    function test_RevertCreateBadgeTypeInvalidInput() public {
        vm.startPrank(minter);
        
        vm.expectRevert("BasedBadge: Name cannot be empty");
        badge.createBadgeType(
            "", // Empty name
            "certificate",
            100,
            true,
            "https://api.example.com/cert/1"
        );
        
        vm.stopPrank();
    }

    function test_RevertCreateBadgeTypeWithoutRole() public {
        vm.prank(student);
        vm.expectRevert();
        badge.createBadgeType(
            "Unauthorized Badge",
            "certificate",
            100,
            true,
            "https://api.example.com/cert/1"
        );
    }

    // ------------------------------------------------------------
    // Badge Issuance Tests
    // ------------------------------------------------------------
    function testIssueBadge() public {
        vm.startPrank(minter);
        
        // Create badge type first
        uint256 tokenId = badge.createBadgeType(
            "Web3 Certificate",
            "certificate",
            100,
            false,
            "https://api.example.com/cert/1"
        );
        
        // Issue badge to student
        badge.issueBadge(student, tokenId);
        
        vm.stopPrank();
        
        // Check balance
        assertEq(badge.balanceOf(student, tokenId), 1);
        assertEq(badge.totalSupply(tokenId), 1);
        
        // Check earned timestamp
        assertTrue(badge.earnedAt(tokenId, student) > 0);
        
        // Check token info
        (string memory name, string memory category, uint256 maxSupply, bool isTransferable, uint256 validUntil, address issuer) = badge.tokenInfo(tokenId);
        assertEq(name, "Web3 Certificate");
        assertEq(category, "certificate");
    }

    function testBatchIssueBadges() public {
        vm.startPrank(minter);
        
        // Create badge type first
        uint256 tokenId = badge.createBadgeType(
            "Event Badge",
            "event",
            1000,
            true,
            "https://api.example.com/event/1"
        );
        
        // Prepare recipients
        address[] memory recipients = new address[](3);
        recipients[0] = student;
        recipients[1] = student2;
        recipients[2] = address(0x5);
        
        // Batch issue badges
        badge.batchIssueBadges(recipients, tokenId, 2);
        
        vm.stopPrank();
        
        // Check balances
        assertEq(badge.balanceOf(student, tokenId), 2);
        assertEq(badge.balanceOf(student2, tokenId), 2);
        assertEq(badge.balanceOf(address(0x5), tokenId), 2);
        assertEq(badge.totalSupply(tokenId), 6);
    }

    function test_RevertIssueBadgeNonExistentToken() public {
        vm.startPrank(minter);
        
        vm.expectRevert("BasedBadge: Token type does not exist");
        badge.issueBadge(student, 9999);
        
        vm.stopPrank();
    }

    function test_RevertIssueBadgeMaxSupplyReached() public {
        vm.startPrank(minter);
        
        // Create badge type with max supply of 1
        uint256 tokenId = badge.createBadgeType(
            "Limited Badge",
            "certificate",
            1,
            false,
            "https://api.example.com/cert/1"
        );
        
        // Issue first badge
        badge.issueBadge(student, tokenId);
        
        // Try to issue second badge (should fail)
        vm.expectRevert("BasedBadge: Max supply reached");
        badge.issueBadge(student2, tokenId);
        
        vm.stopPrank();
    }

    function test_RevertBatchTooLarge() public {
        vm.startPrank(minter);
        
        // Create badge type
        uint256 tokenId = badge.createBadgeType(
            "Event Badge",
            "event",
            1000,
            true,
            "https://api.example.com/event/1"
        );
        
        // Create array with 101 recipients (exceeds limit)
        address[] memory recipients = new address[](101);
        for (uint256 i = 0; i < 101; i++) {
            recipients[i] = address(uint160(i + 100));
        }
        
        vm.expectRevert("BasedBadge: Batch size exceeds limit of 100");
        badge.batchIssueBadges(recipients, tokenId, 1);
        
        vm.stopPrank();
    }

    // ------------------------------------------------------------
    // Achievement Tests
    // ------------------------------------------------------------
    function testGrantAchievement() public {
        vm.startPrank(minter);
        
        uint256 tokenId = badge.grantAchievement(
            student,
            "Top Student",
            1, // Rarity 1
            block.timestamp + 365 days
        );
        
        vm.stopPrank();
        
        // Check tokenId is in achievement range
        assertTrue(tokenId >= badge.ACHIEVEMENT_BASE());
        
        // Check token info
        (string memory name, string memory category, uint256 maxSupply, bool isTransferable, uint256 validUntil, address issuer) = badge.tokenInfo(tokenId);
        assertEq(name, "Top Student");
        assertEq(category, "achievement");
        assertEq(maxSupply, 100); // Rarity 1 = maxSupply 100
        assertFalse(isTransferable);
        assertEq(validUntil, block.timestamp + 365 days);
        assertEq(issuer, minter);
        
        // Check balance
        assertEq(badge.balanceOf(student, tokenId), 1);
    }

    function testGrantAchievementDifferentRarities() public {
        vm.startPrank(minter);
        
        // Test rarity 1 (maxSupply 100)
        uint256 tokenId1 = badge.grantAchievement(student, "Common", 1, 0);
        (,, uint256 maxSupply1,,,) = badge.tokenInfo(tokenId1);
        assertEq(maxSupply1, 100);
        
        // Test rarity 2 (maxSupply 50)
        uint256 tokenId2 = badge.grantAchievement(student, "Rare", 2, 0);
        (,, uint256 maxSupply2,,,) = badge.tokenInfo(tokenId2);
        assertEq(maxSupply2, 50);
        
        // Test rarity 3 (maxSupply 25)
        uint256 tokenId3 = badge.grantAchievement(student, "Epic", 3, 0);
        (,, uint256 maxSupply3,,,) = badge.tokenInfo(tokenId3);
        assertEq(maxSupply3, 25);
        
        // Test rarity 4+ (maxSupply 10)
        uint256 tokenId4 = badge.grantAchievement(student, "Legendary", 4, 0);
        (,, uint256 maxSupply4,,,) = badge.tokenInfo(tokenId4);
        assertEq(maxSupply4, 10);
        
        vm.stopPrank();
    }

    // ------------------------------------------------------------
    // Workshop Tests
    // ------------------------------------------------------------
    function testCreateWorkshop() public {
        vm.startPrank(minter);
        
        uint256[] memory sessionIds = badge.createWorkshop("Web3 Development", 3);
        
        vm.stopPrank();
        
        // Check array length
        assertEq(sessionIds.length, 3);
        
        // Check all session IDs are in workshop range
        for (uint256 i = 0; i < sessionIds.length; i++) {
            assertTrue(sessionIds[i] >= badge.WORKSHOP_BASE());
            
            // Check token info
            (string memory name, string memory category, uint256 maxSupply, bool isTransferable, uint256 validUntil, address issuer) = badge.tokenInfo(sessionIds[i]);
            assertEq(category, "workshop");
            assertEq(maxSupply, 100);
            assertFalse(isTransferable);
            assertEq(issuer, minter);
        }
    }

    // ------------------------------------------------------------
    // Transferability Tests
    // ------------------------------------------------------------
    function testTransferableToken() public {
        vm.startPrank(minter);
        
        // Create transferable badge
        uint256 tokenId = badge.createBadgeType(
            "Transferable Badge",
            "event",
            100,
            true,
            "https://api.example.com/event/1"
        );
        
        // Issue to student
        badge.issueBadge(student, tokenId);
        
        vm.stopPrank();
        
        // Student transfers to student2
        vm.prank(student);
        badge.safeTransferFrom(student, student2, tokenId, 1, "");
        
        // Check balances
        assertEq(badge.balanceOf(student, tokenId), 0);
        assertEq(badge.balanceOf(student2, tokenId), 1);
    }

    function test_RevertTransferNonTransferableToken() public {
        vm.startPrank(minter);
        
        // Create non-transferable badge
        uint256 tokenId = badge.createBadgeType(
            "Non-Transferable Badge",
            "certificate",
            100,
            false,
            "https://api.example.com/cert/1"
        );
        
        // Issue to student
        badge.issueBadge(student, tokenId);
        
        vm.stopPrank();
        
        // Try to transfer (should fail)
        vm.prank(student);
        vm.expectRevert("BasedBadge: This token is non-transferable");
        badge.safeTransferFrom(student, student2, tokenId, 1, "");
    }

    // ------------------------------------------------------------
    // Verification Tests
    // ------------------------------------------------------------
    function testVerifyBadge() public {
        vm.startPrank(minter);
        
        // Create badge type
        uint256 tokenId = badge.createBadgeType(
            "Test Badge",
            "certificate",
            100,
            false,
            "https://api.example.com/cert/1"
        );
        
        // Issue badge
        badge.issueBadge(student, tokenId);
        
        vm.stopPrank();
        
        // Verify badge
        (bool valid, uint256 earnedTimestamp) = badge.verifyBadge(student, tokenId);
        
        assertTrue(valid);
        assertTrue(earnedTimestamp > 0);
    }

    function testVerifyBadgeExpired() public {
        vm.startPrank(minter);
        
        // Create badge type with expiry using grantAchievement (which sets validUntil)
        uint256 tokenId = badge.grantAchievement(student, "Expiring Achievement", 1, block.timestamp + 365 days);
        
        vm.stopPrank();
        
        // Fast forward time to expire the badge
        vm.warp(block.timestamp + 365 days + 1);
        
        // Verify badge (should be invalid due to expiry)
        (bool valid, uint256 earnedTimestamp) = badge.verifyBadge(student, tokenId);
        
        assertFalse(valid);
        assertTrue(earnedTimestamp > 0);
    }

    function test_RevertVerifyBadgeNonExistent() public {
        vm.expectRevert("BasedBadge: Token type does not exist");
        badge.verifyBadge(student, 9999);
    }

    // ------------------------------------------------------------
    // Pause Tests
    // ------------------------------------------------------------
    function testPauseUnpause() public {
        vm.startPrank(deployer);
        
        // Pause
        badge.pause();
        assertTrue(badge.paused());
        
        // Unpause
        badge.unpause();
        assertFalse(badge.paused());
        
        vm.stopPrank();
    }

    function test_RevertPauseWithoutRole() public {
        vm.prank(student);
        vm.expectRevert();
        badge.pause();
    }

    function test_RevertOperationsWhenPaused() public {
        vm.startPrank(minter);
        
        // Create badge type
        uint256 tokenId = badge.createBadgeType(
            "Test Badge",
            "certificate",
            100,
            false,
            "https://api.example.com/cert/1"
        );
        
        vm.stopPrank();
        
        // Pause contract
        vm.prank(deployer);
        badge.pause();
        
        // Try to issue badge (should fail)
        vm.startPrank(minter);
        vm.expectRevert();
        badge.issueBadge(student, tokenId);
        vm.stopPrank();
    }

    // ------------------------------------------------------------
    // URI Tests
    // ------------------------------------------------------------
    function testSetURI() public {
        vm.startPrank(deployer);
        
        // Create badge type
        uint256 tokenId = badge.createBadgeType(
            "Test Badge",
            "certificate",
            100,
            false,
            "https://api.example.com/cert/1"
        );
        
        // Set new URI
        badge.setURI(tokenId, "https://api.example.com/cert/updated");
        
        vm.stopPrank();
        
        // Check URI
        assertEq(badge.uri(tokenId), "https://api.example.com/cert/updated");
    }

    function test_RevertSetURIWithoutRole() public {
        vm.startPrank(minter);
        
        // Create badge type
        uint256 tokenId = badge.createBadgeType(
            "Test Badge",
            "certificate",
            100,
            false,
            "https://api.example.com/cert/1"
        );
        
        vm.stopPrank();
        
        // Try to set URI without role
        vm.prank(student);
        vm.expectRevert();
        badge.setURI(tokenId, "https://api.example.com/cert/updated");
    }
}
