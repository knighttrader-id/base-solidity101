// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {ERC1155Supply} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title BasedBadge
 * @dev A secure, scalable ERC1155 multi-token contract for badges and achievements.
 * Features:
 * - Role-Based Access Control
 * - Pausable for security
 * - Reentrancy protection
 * - Robust input validation
 */
contract BasedBadge is ERC1155, AccessControl, Pausable, ERC1155Supply, ReentrancyGuard {
    // --- Role definitions ---
    bytes32 public constant URI_SETTER_ROLE = keccak256("URI_SETTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    // --- Token ID ranges for organization ---
    uint256 public constant CERTIFICATE_BASE = 1000;
    uint256 public constant EVENT_BADGE_BASE = 2000;
    uint256 public constant ACHIEVEMENT_BASE = 3000;
    uint256 public constant WORKSHOP_BASE = 4000;

    // --- Token metadata structure ---
    struct TokenInfo {
        string name;
        string category;
        uint256 maxSupply; // 0 for unlimited
        bool isTransferable;
        uint256 validUntil; // 0 for no expiry
        address issuer;
    }

    // --- Mappings ---
    mapping(uint256 => TokenInfo) public tokenInfo;
    mapping(uint256 => string) private _tokenURIs;
    mapping(uint256 => mapping(address => uint256)) public earnedAt;

    // --- Counters for unique IDs ---
    uint256 private _certificateCounter;
    uint256 private _eventCounter;
    uint256 private _achievementCounter;
    uint256 private _workshopCounter;

    // --- Events ---
    event TokenTypeCreated(uint256 indexed tokenId, string name, string category, uint256 maxSupply, bool isTransferable);
    event BadgeIssued(uint256 indexed tokenId, address indexed to, uint256 amount);
    event BatchBadgesIssued(uint256 indexed tokenId, uint256 recipientCount, uint256 amountPerRecipient);
    event AchievementGranted(uint256 indexed tokenId, address indexed student, string achievement);

    constructor() ERC1155("") {
        // --- Setup roles ---
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(URI_SETTER_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    /**
      * @dev Creates a new type of badge or certificate. Requires MINTER_ROLE.
      */
    function createBadgeType(
        string memory name,
        string memory category,
        uint256 maxSupply,
        bool transferable,
        string memory tokenURI
    ) public onlyRole(MINTER_ROLE) nonReentrant returns (uint256) {
        require(bytes(name).length > 0, "BasedBadge: Name cannot be empty");
        require(bytes(category).length > 0, "BasedBadge: Category cannot be empty");
        require(bytes(tokenURI).length > 0, "BasedBadge: Token URI cannot be empty");

        uint256 tokenId;
        bytes32 categoryHash = keccak256(bytes(category));

        if (categoryHash == keccak256(bytes("certificate"))) {
            tokenId = CERTIFICATE_BASE + _certificateCounter++;
        } else if (categoryHash == keccak256(bytes("event"))) {
            tokenId = EVENT_BADGE_BASE + _eventCounter++;
        } else if (categoryHash == keccak256(bytes("achievement"))) {
            tokenId = ACHIEVEMENT_BASE + _achievementCounter++;
        } else if (categoryHash == keccak256(bytes("workshop"))) {
            tokenId = WORKSHOP_BASE + _workshopCounter++;
        } else {
            revert("BasedBadge: Invalid category");
        }

        tokenInfo[tokenId] = TokenInfo(name, category, maxSupply, transferable, 0, msg.sender);
        _tokenURIs[tokenId] = tokenURI;

        emit TokenTypeCreated(tokenId, name, category, maxSupply, transferable);
        return tokenId;
    }

    /**
      * @dev Issues a single badge or certificate to a user. Requires MINTER_ROLE.
      */
    function issueBadge(address to, uint256 tokenId) public onlyRole(MINTER_ROLE) nonReentrant {
        require(to != address(0), "BasedBadge: Cannot issue to the zero address");
        require(tokenInfo[tokenId].issuer != address(0), "BasedBadge: Token type does not exist");

        if (tokenInfo[tokenId].maxSupply > 0) {
            require(totalSupply(tokenId) < tokenInfo[tokenId].maxSupply, "BasedBadge: Max supply reached");
        }

        _mint(to, tokenId, 1, "");
        earnedAt[tokenId][to] = block.timestamp;
        emit BadgeIssued(tokenId, to, 1);
    }

    /**
      * @dev Mints multiple badges to a list of recipients. Requires MINTER_ROLE.
      */
    function batchIssueBadges(address[] calldata recipients, uint256 tokenId, uint256 amount)
    public onlyRole(MINTER_ROLE) nonReentrant {
        require(recipients.length > 0, "BasedBadge: Recipient array cannot be empty");
        require(recipients.length <= 100, "BasedBadge: Batch size exceeds limit of 100");
        require(tokenInfo[tokenId].issuer != address(0), "BasedBadge: Token type does not exist");

        if (tokenInfo[tokenId].maxSupply > 0) {
            uint256 totalMintAmount = amount * recipients.length;
            require(totalSupply(tokenId) + totalMintAmount <= tokenInfo[tokenId].maxSupply, "BasedBadge: Max supply would be exceeded");
        }

        for (uint256 i = 0; i < recipients.length; i++) {
            require(recipients[i] != address(0), "BasedBadge: Cannot issue to the zero address in a batch");
            _mint(recipients[i], tokenId, amount, "");
            earnedAt[tokenId][recipients[i]] = block.timestamp;
        }

        emit BatchBadgesIssued(tokenId, recipients.length, amount);
    }

    /**
      * @dev Grants a special, non-transferable achievement to a student. Requires MINTER_ROLE.
      */
    function grantAchievement(address student, string memory achievementName, uint256 rarity, uint256 validUntil)
        public onlyRole(MINTER_ROLE) nonReentrant returns (uint256) {
        require(student != address(0), "BasedBadge: Student cannot be the zero address");
        require(bytes(achievementName).length > 0, "BasedBadge: Achievement name cannot be empty");
        require(rarity >= 1 && rarity <= 4, "BasedBadge: Rarity must be between 1 and 4");

        uint256 tokenId = ACHIEVEMENT_BASE + _achievementCounter++;

        uint256 maxSupply;
        if (rarity == 1) maxSupply = 100;
        else if (rarity == 2) maxSupply = 50;
        else if (rarity == 3) maxSupply = 25;
        else maxSupply = 10;

        tokenInfo[tokenId] = TokenInfo(achievementName, "achievement", maxSupply, false, validUntil, msg.sender);
        _tokenURIs[tokenId] = string.concat("https://api.example.com/achievement/", Strings.toString(tokenId));
        
        _mint(student, tokenId, 1, "");
        earnedAt[tokenId][student] = block.timestamp;
        
        emit AchievementGranted(tokenId, student, achievementName);
        return tokenId;
    }

    /**
      * @dev Creates a series of workshop session tokens. Requires MINTER_ROLE.
      */
    function createWorkshop(string memory seriesName, uint256 totalSessions)
        public onlyRole(MINTER_ROLE) nonReentrant returns (uint256[] memory) {
        require(bytes(seriesName).length > 0, "BasedBadge: Series name cannot be empty");
        require(totalSessions > 0 && totalSessions <= 50, "BasedBadge: Total sessions must be between 1 and 50");

        uint256[] memory sessionIds = new uint256[](totalSessions);
        for (uint256 i = 0; i < totalSessions; i++) {
            uint256 tokenId = WORKSHOP_BASE + _workshopCounter++;
            
            string memory name = string(abi.encodePacked(seriesName, " - Session ", Strings.toString(i + 1)));
            tokenInfo[tokenId] = TokenInfo(name, "workshop", 100, false, 0, msg.sender);
            _tokenURIs[tokenId] = string.concat("https://api.example.com/workshop/", Strings.toString(tokenId));
            
            sessionIds[i] = tokenId;
            emit TokenTypeCreated(tokenId, name, "workshop", 100, false);
        }
        return sessionIds;
    }

    /**
      * @dev Sets the metadata URI for a given token ID. Requires URI_SETTER_ROLE.
      */
    function setURI(uint256 tokenId, string memory newuri) public onlyRole(URI_SETTER_ROLE) {
        require(bytes(newuri).length > 0, "BasedBadge: URI cannot be empty");
        require(tokenInfo[tokenId].issuer != address(0), "BasedBadge: Token type does not exist");
        _tokenURIs[tokenId] = newuri;
    }

    /**
      * @dev Verifies if a holder's badge is currently valid.
      */
    function verifyBadge(address holder, uint256 tokenId)
        public view returns (bool valid, uint256 earnedTimestamp) {
        require(tokenInfo[tokenId].issuer != address(0), "BasedBadge: Token type does not exist");

        if (balanceOf(holder, tokenId) == 0) {
            return (false, 0);
        }

        earnedTimestamp = earnedAt[tokenId][holder];
        valid = tokenInfo[tokenId].validUntil == 0 || block.timestamp <= tokenInfo[tokenId].validUntil;
        
        return (valid, earnedTimestamp);
    }

    function pause() public onlyRole(PAUSER_ROLE) { _pause(); }
    function unpause() public onlyRole(PAUSER_ROLE) { _unpause(); }

    function _update(address from, address to, uint256[] memory ids, uint256[] memory values) internal override(ERC1155, ERC1155Supply) whenNotPaused {
        if (from != address(0) && to != address(0)) { // This is a transfer, not a mint or burn
            for (uint i = 0; i < ids.length; i++) {
                require(tokenInfo[ids[i]].isTransferable, "BasedBadge: This token is non-transferable");
            }
        }
        super._update(from, to, ids, values);
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        require(tokenInfo[tokenId].issuer != address(0), "BasedBadge: URI query for nonexistent token");
        return _tokenURIs[tokenId];
    }

    /**
     * @dev Check interface support
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}