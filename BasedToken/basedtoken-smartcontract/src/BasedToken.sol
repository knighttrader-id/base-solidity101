// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {ERC20Pausable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title BasedToken
 * @author [Your Name/Company]
 * @notice A feature-rich ERC20 token with minting, pausing, burning,
 * and role-based access control. Includes a blacklist and a daily reward claim mechanism.
 * @dev This contract uses OpenZeppelin's ERC20Pausable, AccessControl, and ReentrancyGuard.
 * It includes robust input validation and follows the Checks-Effects-Interactions pattern.
 */
contract BasedToken is ERC20, ERC20Burnable, ERC20Pausable, AccessControl, ReentrancyGuard {
    // Roles
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    // State variables
    uint256 public dailyRewardAmount;
    mapping(address => bool) public isBlacklisted;
    mapping(address => uint256) public lastClaimDay;

    // Events
    event UserBlacklisted(address indexed user, bool status);
    event UserBlacklistedBatch(address[] users, bool status);
    event RewardClaimed(address indexed user, uint256 amount);
    event DailyRewardUpdated(uint256 oldAmount, uint256 newAmount);
    event TokensMinted(address indexed to, uint256 amount);

    /**
     * @notice Constructor to deploy the BasedToken with hardcoded values.
     */
    constructor() ERC20("BasedToken", "BASED") {
        // Hardcoded deployment parameters
        uint256 initialSupply = 1000000; // 1 Million tokens
        uint256 dailyReward = 10;        // 10 tokens

        // Grant roles to the contract deployer
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);

        // Set the daily reward amount (converting from full units to wei)
        dailyRewardAmount = dailyReward * (10**decimals());

        // Mint initial supply to the deployer
        if (initialSupply > 0) {
            _mint(msg.sender, initialSupply * (10**decimals()));
        }
    }

    /**
     * @notice Mints new tokens and assigns them to an account.
     * @dev Can only be called by an account with the MINTER_ROLE.
     * @param to The address that will receive the minted tokens.
     * @param amount The amount of tokens to mint (in wei).
     */
    function mint(address to, uint256 amount) public virtual onlyRole(MINTER_ROLE) {
        // --- Input Validation ---
        require(to != address(0), "ERC20: mint to the zero address");
        require(amount > 0, "ERC20: mint amount must be greater than 0");
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    /**
     * @notice Pauses all token transfers.
     * @dev Can only be called by an account with the PAUSER_ROLE.
     */
    function pause() public virtual onlyRole(PAUSER_ROLE) {
        _pause();
    }

    /**
     * @notice Unpauses token transfers.
     * @dev Can only be called by an account with the PAUSER_ROLE.
     */
    function unpause() public virtual onlyRole(PAUSER_ROLE) {
        _unpause();
    }
    
    /**
     * @notice Adds or removes an address from the blacklist.
     * @dev Can only be called by an account with the DEFAULT_ADMIN_ROLE.
     * @param user The address to update.
     * @param status The blacklist status (true = blacklisted, false = removed).
     */
    function setBlacklist(address user, bool status) public virtual onlyRole(DEFAULT_ADMIN_ROLE) {
        // --- Input Validation ---
        require(user != address(0), "BasedToken: cannot blacklist the zero address");

        isBlacklisted[user] = status;
        emit UserBlacklisted(user, status);
    }

    /**
     * @notice Adds or removes a list of addresses from the blacklist in one transaction.
     * @dev Can only be called by an account with the DEFAULT_ADMIN_ROLE.
     * @param users The list of addresses to update.
     * @param status The blacklist status to apply to all addresses.
     */
    function setBlacklistBatch(address[] calldata users, bool status) public virtual onlyRole(DEFAULT_ADMIN_ROLE) {
        for (uint256 i = 0; i < users.length; i++) {
            address user = users[i];
            require(user != address(0), "BasedToken: cannot blacklist the zero address");
            isBlacklisted[user] = status;
        }
        emit UserBlacklistedBatch(users, status);
    }

    /**
     * @notice Updates the daily reward amount.
     * @dev Can only be called by an account with the DEFAULT_ADMIN_ROLE.
     * @param newAmountInFullUnits The new reward amount, in full token units.
     */
    function setDailyReward(uint256 newAmountInFullUnits) public virtual onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newAmountInFullUnits > 0, "BasedToken: reward must be > 0");
        uint256 newAmount = newAmountInFullUnits * (10**decimals());
        emit DailyRewardUpdated(dailyRewardAmount, newAmount);
        dailyRewardAmount = newAmount;
    }


    /**
     * @notice Allows a user to claim a fixed daily reward.
     * @dev A user can only claim once per calendar day (UTC). Blacklisted users cannot claim.
     * This function is protected against reentrancy attacks and cannot be called when paused.
     */
    function claimReward() public virtual nonReentrant {
        address user = msg.sender;
        uint256 currentDay = block.timestamp / 1 days;

        // --- Checks ---
        require(!isBlacklisted[user], "BasedToken: User is blacklisted");
        require(currentDay > lastClaimDay[user], "BasedToken: Can only claim once per day");

        // --- Effects ---
        // Update state *before* the external interaction (_mint) to prevent reentrancy.
        // Unchecked block saves gas as timestamp cannot overflow uint256.
        unchecked {
            lastClaimDay[user] = currentDay;
        }

        // --- Interactions ---
        _mint(user, dailyRewardAmount);

        emit RewardClaimed(user, dailyRewardAmount);
    }

    /**
     * @dev Hook that is called before any token transfer, including minting and burning.
     * It incorporates the pausable functionality and adds blacklist checks.
     */
    function _update(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20, ERC20Pausable) {
        require(!isBlacklisted[from], "BasedToken: Sender is blacklisted");
        require(!isBlacklisted[to], "BasedToken: Receiver is blacklisted");
        super._update(from, to, amount);
    }

    /**
     * @dev Hook that is called before an allowance is spent.
     * Ensures that tokens from a blacklisted owner cannot be transferred via an allowance.
     */
    function _spendAllowance(
        address owner,
        address spender,
        uint256 amount
    ) internal override virtual {
        require(!isBlacklisted[owner], "BasedToken: Owner is blacklisted");
        super._spendAllowance(owner, spender, amount);
    }
}