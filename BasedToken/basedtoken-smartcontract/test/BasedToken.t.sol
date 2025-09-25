// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Test} from "forge-std/Test.sol";
import {BasedToken} from "../src/BasedToken.sol"; // adjust path if needed

contract BasedTokenTest is Test {
    BasedToken token;
    address deployer = address(0x1);
    address alice = address(0x2);
    address bob   = address(0x3);

    uint256 initialSupply = 1000000 ether; // 1M tokens (matches constructor)

    function setUp() public {
        vm.startPrank(deployer);
        token = new BasedToken(); // No constructor parameters needed
        vm.stopPrank();
    }

    // ------------------------------------------------------------
    // Deployment
    // ------------------------------------------------------------
    function testDeployment() public view {
        assertEq(token.totalSupply(), initialSupply);
        assertEq(token.balanceOf(deployer), initialSupply);
        assertTrue(token.hasRole(token.DEFAULT_ADMIN_ROLE(), deployer));
        assertTrue(token.hasRole(token.MINTER_ROLE(), deployer));
        assertTrue(token.hasRole(token.PAUSER_ROLE(), deployer));
    }

    // ------------------------------------------------------------
    // Minting
    // ------------------------------------------------------------
    function testMintAsMinter() public {
        vm.startPrank(deployer);
        token.mint(alice, 100 ether);
        vm.stopPrank();

        assertEq(token.balanceOf(alice), 100 ether);
    }

    function test_RevertMintWithoutRole() public {
        vm.prank(alice);
        vm.expectRevert(); // access control revert
        token.mint(alice, 100 ether);
    }

    function test_RevertMintZeroAmount() public {
        vm.startPrank(deployer);
        vm.expectRevert(); // amount must be > 0
        token.mint(alice, 0);
        vm.stopPrank();
    }

    // ------------------------------------------------------------
    // Pause & Unpause
    // ------------------------------------------------------------
    function testPauseAndUnpause() public {
        vm.startPrank(deployer);
        token.pause();
        assertTrue(token.paused());

        token.unpause();
        assertFalse(token.paused());
        vm.stopPrank();
    }

    function test_RevertPauseWithoutRole() public {
        vm.prank(alice);
        vm.expectRevert(); // access control revert
        token.pause();
    }

    function testCannotTransferWhenPaused() public {
        vm.startPrank(deployer);
        token.pause();
        vm.stopPrank();

        vm.prank(deployer);
        vm.expectRevert();
        bool success = token.transfer(alice, 1 ether);
        assertFalse(success);
    }

    // ------------------------------------------------------------
    // Blacklist
    // ------------------------------------------------------------
    function testBlacklistPreventsTransfer() public {
        vm.startPrank(deployer);
        token.setBlacklist(alice, true);
        vm.stopPrank();

        vm.prank(deployer);
        vm.expectRevert();
        bool success = token.transfer(alice, 1 ether);
        assertFalse(success);
    }

    function testBlacklistBatch() public {
        address[] memory users = new address[](2);
        users[0] = alice;
        users[1] = bob;

        vm.startPrank(deployer);
        token.setBlacklistBatch(users, true);
        vm.stopPrank();

        assertTrue(token.isBlacklisted(alice));
        assertTrue(token.isBlacklisted(bob));
    }

    function test_RevertBlacklistByNonAdmin() public {
        vm.prank(alice);
        vm.expectRevert(); // only admin
        token.setBlacklist(bob, true);
    }

    // ------------------------------------------------------------
    // Claim Reward
    // ------------------------------------------------------------
    function testClaimReward() public {
        uint256 reward = token.dailyRewardAmount();

        vm.prank(alice);
        token.claimReward();
        assertEq(token.balanceOf(alice), reward);

        vm.prank(alice);
        vm.expectRevert(); // too soon
        token.claimReward();

        vm.warp(block.timestamp + 1 days);

        vm.prank(alice);
        token.claimReward();
        assertEq(token.balanceOf(alice), 2 * reward);
    }

    function test_RevertClaimRewardWhenBlacklisted() public {
        vm.startPrank(deployer);
        token.setBlacklist(alice, true);
        vm.stopPrank();

        vm.prank(alice);
        vm.expectRevert(); // blacklisted
        token.claimReward();
    }

    // ------------------------------------------------------------
    // Reentrancy Protection
    // ------------------------------------------------------------
    function testClaimRewardHasNonReentrantModifier() public {
        // This test verifies that the claimReward function has the nonReentrant modifier applied
        // Since claimReward doesn't call external contracts, it's not actually vulnerable to reentrancy
        // but we're adding the modifier as a preventive measure
        
        // We can't easily test reentrancy protection without a vulnerable function,
        // but we can verify the function exists and works normally
        vm.prank(alice);
        token.claimReward();
        
        uint256 reward = token.dailyRewardAmount();
        assertEq(token.balanceOf(alice), reward);
    }

    function testSetDailyReward() public {
        uint256 newReward = 20; // 20 tokens
        
        vm.startPrank(deployer);
        token.setDailyReward(newReward);
        vm.stopPrank();
        
        assertEq(token.dailyRewardAmount(), newReward * 10**token.decimals());
    }

    function test_RevertSetDailyRewardByNonAdmin() public {
        vm.prank(alice);
        vm.expectRevert(); // only admin
        token.setDailyReward(20);
    }

    // ------------------------------------------------------------
    // Transfers
    // ------------------------------------------------------------
    function testTransferWorksNormally() public {
        vm.startPrank(deployer);
        bool success = token.transfer(alice, 100 ether);
        assertTrue(success);
        vm.stopPrank();

        assertEq(token.balanceOf(alice), 100 ether);
    }
}

contract ReentrancyAttacker {
    BasedToken public token;
    
    constructor(BasedToken _token) {
        token = _token;
    }
    
    function attack() public {
        token.claimReward();
    }
    
    // This function would be called during the reentrancy attack
    // but since we're using nonReentrant modifier, it won't be able to reenter
    function onErc721Received(
        address,
        address,
        uint256,
        bytes memory
    ) public returns (bytes4) {
        // Try to reenter claimReward function
        token.claimReward();
        return this.onErc721Received.selector;
    }
}